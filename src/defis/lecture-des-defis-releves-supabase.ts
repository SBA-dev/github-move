import { type DefiReleve } from "@domain/apprentissage";
import { estUneMatiere, matiereDeCode, Niveau, NiveauInconnu } from "@domain/catalogue";
import { clientSupabase } from "../connexion/client-supabase.ts";
import { reseauDisponible } from "../reseau/reseau-disponible.ts";
import { estUnIdentifiantDeProfil } from "../seance/fin-de-seance/corps-de-la-seance.ts";

type LigneDeDefiTermine = { readonly matiere: string; readonly classe: string; readonly numero: number };

function defiReleveDepuisLaLigne(ligne: LigneDeDefiTermine): DefiReleve | undefined {
  if (!estUneMatiere(ligne.matiere)) return undefined;
  try {
    return { matiere: matiereDeCode(ligne.matiere), niveau: Niveau.de(ligne.classe), numero: ligne.numero };
  } catch (erreur) {
    if (erreur instanceof NiveauInconnu) return undefined;
    throw erreur;
  }
}

/** Lecture sous RLS, avec le client du parent. `undefined` : sans réseau, profil non enregistré ou lecture impossible. Une ligne illisible est ignorée. */
export async function lireLesDefisRelevesDuServeur(profil: string): Promise<readonly DefiReleve[] | undefined> {
  if (!estUnIdentifiantDeProfil(profil) || !reseauDisponible()) return undefined;
  try {
    const { data, error } = await clientSupabase().from("defis_termines").select("matiere, classe, numero").eq("profil", profil);
    if (error || data === null) return undefined;
    return (data as LigneDeDefiTermine[]).flatMap((ligne) => defiReleveDepuisLaLigne(ligne) ?? []);
  } catch {
    return undefined;
  }
}
