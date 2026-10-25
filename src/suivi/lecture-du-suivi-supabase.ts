import type { EntreesDuSuivi, SeanceLue } from "@domain/accompagnement";
import type { NombreDEtoiles } from "@domain/apprentissage";
import { clientSupabase } from "../connexion/client-supabase.ts";
import { reseauDisponible } from "../reseau/reseau-disponible.ts";
import { estUnIdentifiantDeProfil } from "../seance/fin-de-seance/corps-de-la-seance.ts";
import { attendreLesEnvoisEnCours } from "../seance/fin-de-seance/sauvegarde-de-la-seance.ts";

/** Ce que le suivi lit chez Apprentissage pour un enfant ; le reste de ses entrées vient du Catalogue et du profil. */
export type DonneesDuSuivi = Pick<
  EntreesDuSuivi,
  | "meilleuresEtoiles"
  | "leconsReussiesAuTestDeDepart"
  | "testDeDepartFaitLe"
  | "seances"
  | "nombreDeSeancesDeRevision"
  | "erreursCorrigeesPourDeBon"
>;

type Ligne = Readonly<Record<string, unknown>>;

function enEtoiles(valeur: unknown): NombreDEtoiles | undefined {
  return valeur === 1 || valeur === 2 || valeur === 3 ? valeur : undefined;
}

function enMeilleuresEtoiles(ligne: Ligne): EntreesDuSuivi["meilleuresEtoiles"] {
  const etoiles = enEtoiles(ligne.meilleures_etoiles);
  return typeof ligne.lecon === "string" && etoiles ? [{ lecon: ligne.lecon, etoiles }] : [];
}

function enSeance(ligne: Ligne): readonly SeanceLue[] {
  const termineeLe = dateDe(ligne.termine_le);
  if (typeof ligne.lecon !== "string" || typeof ligne.erreurs !== "number" || termineeLe === undefined) return [];
  const etoiles = enEtoiles(ligne.etoiles);
  return [{ lecon: ligne.lecon, termineeLe, erreurs: ligne.erreurs, ...(etoiles && { etoiles }) }];
}

type Resultat = { readonly data: unknown; readonly error: unknown };

function lignesDe({ data, error }: Resultat): readonly Ligne[] {
  if (error) throw new Error("Lecture du suivi impossible");
  return Array.isArray(data) ? data as Ligne[] : [];
}

function ligneDe({ data, error }: Resultat): Ligne | undefined {
  if (error) throw new Error("Lecture du suivi impossible");
  return typeof data === "object" && data !== null ? data as Ligne : undefined;
}

function dateDe(valeur: unknown): Date | undefined {
  const date = typeof valeur === "string" ? new Date(valeur) : undefined;
  return date && !Number.isNaN(date.getTime()) ? date : undefined;
}

function textesDe(valeur: unknown): readonly string[] {
  return Array.isArray(valeur) ? valeur.filter((texte): texte is string => typeof texte === "string") : [];
}

/**
 * Lecture sous RLS (JWT du parent) des faits d'Apprentissage d'un seul enfant, colonnes au plus juste.
 * `undefined` : lecture impossible (sans réseau ou erreur) ; le suivi demande le réseau.
 */
export async function lireLesDonneesDuSuivi(profil: string): Promise<DonneesDuSuivi | undefined> {
  if (!estUnIdentifiantDeProfil(profil) || !reseauDisponible()) return undefined;
  try {
    await attendreLesEnvoisEnCours();
    const client = clientSupabase();
    const [resultats, testDeDepart, seances, revisions, file] = await Promise.all([
      client.from("resultats_des_lecons").select("lecon, meilleures_etoiles").eq("profil", profil),
      client.from("resultats_des_tests_de_depart").select("fait_le, lecons_reussies").eq("profil", profil).maybeSingle(),
      client.from("seances_terminees").select("lecon, termine_le, erreurs, etoiles").eq("profil", profil),
      client.from("seances_de_revision_terminees").select("id", { count: "exact", head: true }).eq("profil", profil),
      client.from("files_de_revision").select("erreurs_corrigees_pour_de_bon").eq("profil", profil).maybeSingle(),
    ]);
    if (revisions.error) throw new Error("Lecture du suivi impossible");
    const test = ligneDe(testDeDepart);
    const testDeDepartFaitLe = dateDe(test?.fait_le);
    const erreursCorrigees = ligneDe(file)?.erreurs_corrigees_pour_de_bon;
    return {
      meilleuresEtoiles: lignesDe(resultats).flatMap(enMeilleuresEtoiles),
      leconsReussiesAuTestDeDepart: textesDe(test?.lecons_reussies),
      ...(testDeDepartFaitLe && { testDeDepartFaitLe }),
      seances: lignesDe(seances).flatMap(enSeance),
      nombreDeSeancesDeRevision: revisions.count ?? 0,
      erreursCorrigeesPourDeBon: typeof erreursCorrigees === "number" ? erreursCorrigees : 0,
    };
  } catch {
    return undefined;
  }
}
