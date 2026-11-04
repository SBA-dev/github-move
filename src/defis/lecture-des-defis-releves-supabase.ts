import { type DefiReleve } from "@domain/apprentissage";
import { estUneMatiere, matiereDeCode, Niveau, NiveauInconnu } from "@domain/catalogue";
import { clientSupabase } from "../connexion/client-supabase.ts";
import { reseauDisponible } from "../reseau/reseau-disponible.ts";
import { estUnIdentifiantDeProfil } from "../seance/fin-de-seance/corps-de-la-seance.ts";

type LigneDeDefiTermine = { readonly matiere: string; readonly classe: string; readonly numero: number };
type LigneDeGrandDefiTermine = { readonly matiere: string; readonly classe: string };

function defiReleveDepuisLaLigne(
  ligne: LigneDeDefiTermine | LigneDeGrandDefiTermine,
  enDefiReleve: (matiere: ReturnType<typeof matiereDeCode>, niveau: Niveau) => DefiReleve,
): DefiReleve | undefined {
  if (!estUneMatiere(ligne.matiere)) return undefined;
  try {
    return enDefiReleve(matiereDeCode(ligne.matiere), Niveau.de(ligne.classe));
  } catch (erreur) {
    if (erreur instanceof NiveauInconnu) return undefined;
    throw erreur;
  }
}

async function lireLesLignes<Ligne>(table: string, colonnes: string, profil: string): Promise<Ligne[] | undefined> {
  const { data, error } = await clientSupabase().from(table).select(colonnes).eq("profil", profil);
  return error || data === null ? undefined : (data as unknown as Ligne[]);
}

/** Lecture sous RLS, avec le client du parent, des défis d'une partie (`defis_termines`) et des grands défis (`grands_defis_termines`). `undefined` : sans réseau, profil non enregistré ou lecture impossible. Une ligne illisible est ignorée. */
export async function lireLesDefisRelevesDuServeur(profil: string): Promise<readonly DefiReleve[] | undefined> {
  if (!estUnIdentifiantDeProfil(profil) || !reseauDisponible()) return undefined;
  try {
    const [defis, grandsDefis] = await Promise.all([
      lireLesLignes<LigneDeDefiTermine>("defis_termines", "matiere, classe, numero", profil),
      lireLesLignes<LigneDeGrandDefiTermine>("grands_defis_termines", "matiere, classe", profil),
    ]);
    if (defis === undefined || grandsDefis === undefined) return undefined;
    return [
      ...defis.flatMap((ligne) => defiReleveDepuisLaLigne(ligne, (matiere, niveau) => ({ matiere, niveau, numero: ligne.numero })) ?? []),
      ...grandsDefis.flatMap((ligne) => defiReleveDepuisLaLigne(ligne, (matiere, niveau) => ({ matiere, niveau, grandDefi: true })) ?? []),
    ];
  } catch {
    return undefined;
  }
}
