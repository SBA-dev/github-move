import { Etoiles, type NombreDEtoiles } from "@domain/apprentissage";
import { clientSupabase } from "../../connexion/client-supabase.ts";
import { reseauDisponible } from "../../reseau/reseau-disponible.ts";
import { estUnIdentifiantDeProfil } from "./corps-de-la-seance.ts";
import { attendreLesEnvoisEnCours } from "./sauvegarde-de-la-seance.ts";

function enEtoiles(valeur: unknown): Etoiles | undefined {
  return valeur === 1 || valeur === 2 || valeur === 3 ? Etoiles.de(valeur as NombreDEtoiles) : undefined;
}

/** Lecture sous RLS du résultat de la leçon. `undefined` : aucune séance terminée, ou lecture impossible. */
export async function lireLesMeilleuresEtoiles(profil: string, lecon: string): Promise<Etoiles | undefined> {
  if (!estUnIdentifiantDeProfil(profil) || !reseauDisponible()) return undefined;
  try {
    await attendreLesEnvoisEnCours();
    const { data, error } = await clientSupabase()
      .from("resultats_des_lecons")
      .select("meilleures_etoiles")
      .eq("profil", profil)
      .eq("lecon", lecon)
      .maybeSingle();
    if (error || data === null) return undefined;
    return enEtoiles((data as { meilleures_etoiles?: unknown }).meilleures_etoiles);
  } catch {
    return undefined;
  }
}

type LigneDeResultat = { readonly lecon?: unknown; readonly meilleures_etoiles?: unknown };

/** Lecture sous RLS des résultats de toutes les leçons du profil. `undefined` : la lecture a échoué. Vide pour un identifiant qui n'est pas celui d'un profil réel. */
export async function lireToutesLesMeilleuresEtoilesSiPossible(profil: string): Promise<ReadonlyMap<string, Etoiles> | undefined> {
  const meilleures = new Map<string, Etoiles>();
  if (!estUnIdentifiantDeProfil(profil)) return meilleures;
  try {
    const { data, error } = await clientSupabase().from("resultats_des_lecons").select("lecon, meilleures_etoiles").eq("profil", profil);
    if (error || data === null) return undefined;
    for (const ligne of data as readonly LigneDeResultat[]) {
      const etoiles = enEtoiles(ligne.meilleures_etoiles);
      if (typeof ligne.lecon === "string" && etoiles) meilleures.set(ligne.lecon, etoiles);
    }
  } catch {
    return undefined;
  }
  return meilleures;
}

/** Lecture sous RLS des résultats de toutes les leçons du profil. Vide si la lecture est impossible (sans réseau). */
export async function lireToutesLesMeilleuresEtoiles(profil: string): Promise<ReadonlyMap<string, Etoiles>> {
  return (await lireToutesLesMeilleuresEtoilesSiPossible(profil)) ?? new Map();
}
