import type { RecordDuProfil } from "@domain/motivation";
import { clientSupabase } from "../connexion/client-supabase.ts";
import { reseauDisponible } from "../reseau/reseau-disponible.ts";
import { estUnIdentifiantDeProfil } from "../seance/fin-de-seance/corps-de-la-seance.ts";
import { attendreLesEnvoisEnCours } from "../seance/fin-de-seance/sauvegarde-de-la-seance.ts";

type LigneDeRecord = { readonly lecon: unknown; readonly exercice: unknown; readonly meilleur_score: unknown };

function enRecord(ligne: LigneDeRecord): RecordDuProfil[] {
  const { lecon, exercice, meilleur_score: meilleurScore } = ligne;
  return typeof lecon === "string" && typeof exercice === "string" && typeof meilleurScore === "number"
    ? [{ lecon, exercice, meilleurScore }]
    : [];
}

/** Lecture sous RLS, filtrée sur le profil en cours. Aucun record : profil de démonstration, sans réseau ou lecture impossible. */
export async function lireLesRecordsDuProfil(profil: string): Promise<readonly RecordDuProfil[]> {
  if (!estUnIdentifiantDeProfil(profil) || !reseauDisponible()) return [];
  try {
    await attendreLesEnvoisEnCours();
    const { data, error } = await clientSupabase()
      .from("records_de_fluence")
      .select("lecon, exercice, meilleur_score")
      .eq("profil", profil);
    return error || !data ? [] : (data as LigneDeRecord[]).flatMap(enRecord);
  } catch {
    return [];
  }
}
