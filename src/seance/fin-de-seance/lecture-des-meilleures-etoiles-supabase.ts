import { Etoiles, type NombreDEtoiles } from "@domain/apprentissage";
import { clientSupabase } from "../../connexion/client-supabase.ts";
import { estUnIdentifiantDeProfil } from "./corps-de-la-seance.ts";
import { attendreLesEnvoisEnCours } from "./sauvegarde-de-la-seance.ts";

function enEtoiles(valeur: unknown): Etoiles | undefined {
  return valeur === 1 || valeur === 2 || valeur === 3 ? Etoiles.de(valeur as NombreDEtoiles) : undefined;
}

/** Lecture sous RLS du résultat de la leçon. `undefined` : aucune séance terminée, ou lecture impossible. */
export async function lireLesMeilleuresEtoiles(profil: string, lecon: string): Promise<Etoiles | undefined> {
  if (!estUnIdentifiantDeProfil(profil)) return undefined;
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
