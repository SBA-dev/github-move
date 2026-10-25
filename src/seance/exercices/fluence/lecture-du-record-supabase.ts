import { clientSupabase } from "../../../connexion/client-supabase.ts";
import { estUnIdentifiantDeProfil } from "../../fin-de-seance/corps-de-la-seance.ts";
import { attendreLesEnvoisEnCours } from "../../fin-de-seance/sauvegarde-de-la-seance.ts";

/** Lecture sous RLS du record de fluence. `undefined` : pas encore de record, profil préparé ou lecture impossible. */
export async function lireLeRecordDeFluence(profil: string, lecon: string, exercice: string): Promise<number | undefined> {
  if (!estUnIdentifiantDeProfil(profil)) return undefined;
  try {
    await attendreLesEnvoisEnCours();
    const { data, error } = await clientSupabase()
      .from("records_de_fluence")
      .select("meilleur_score")
      .eq("profil", profil)
      .eq("lecon", lecon)
      .eq("exercice", exercice)
      .maybeSingle();
    if (error || data === null) return undefined;
    const score = (data as { meilleur_score?: unknown }).meilleur_score;
    return typeof score === "number" ? score : undefined;
  } catch {
    return undefined;
  }
}
