import { type DefiReleve } from "@domain/apprentissage";
import { estUneMatiere, matiereDeCode, Niveau, NiveauInconnu } from "@domain/catalogue";
import { clientSupabase } from "../connexion/client-supabase.ts";
import { reseauDisponible } from "../reseau/reseau-disponible.ts";
import { estUnIdentifiantDeProfil } from "../seance/fin-de-seance/corps-de-la-seance.ts";

type LigneDeDefiTermine = { readonly matiere: string; readonly classe: string; readonly numero?: number };

function defiReleveDepuisLaLigne(ligne: LigneDeDefiTermine): DefiReleve | undefined {
  if (!estUneMatiere(ligne.matiere)) return undefined;
  try {
    const matiere = matiereDeCode(ligne.matiere);
    const niveau = Niveau.de(ligne.classe);
    return ligne.numero === undefined ? { matiere, niveau, grandDefi: true } : { matiere, niveau, numero: ligne.numero };
  } catch (erreur) {
    if (erreur instanceof NiveauInconnu) return undefined;
    throw erreur;
  }
}

async function lireLesLignes(table: string, colonnes: string, profil: string): Promise<LigneDeDefiTermine[] | undefined> {
  const { data, error } = await clientSupabase().from(table).select(colonnes).eq("profil", profil);
  return error || data === null ? undefined : (data as unknown as LigneDeDefiTermine[]);
}

/** Lecture sous RLS, avec le client du parent, des défis d'une partie et des grands défis. `undefined` : sans réseau, profil non enregistré ou lecture impossible. Une ligne illisible est ignorée. */
export async function lireLesDefisRelevesDuServeur(profil: string): Promise<readonly DefiReleve[] | undefined> {
  if (!estUnIdentifiantDeProfil(profil) || !reseauDisponible()) return undefined;
  try {
    const [defis, grandsDefis] = await Promise.all([
      lireLesLignes("defis_termines", "matiere, classe, numero", profil),
      lireLesLignes("grands_defis_termines", "matiere, classe", profil),
    ]);
    if (defis === undefined || grandsDefis === undefined) return undefined;
    return [...defis, ...grandsDefis].flatMap((ligne) => defiReleveDepuisLaLigne(ligne) ?? []);
  } catch {
    return undefined;
  }
}
