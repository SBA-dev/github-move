import { clientSupabase } from "../connexion/client-supabase.ts";
import { estUnIdentifiantDeProfil } from "../seance/fin-de-seance/corps-de-la-seance.ts";
import { attendreLesEnvoisEnCours } from "../seance/fin-de-seance/sauvegarde-de-la-seance.ts";
import type { SeanceTermineeConnue } from "../seance/fin-de-seance/seances-terminees-pendant-l-utilisation.ts";
import { reseauDisponible } from "../reseau/reseau-disponible.ts";

type LigneDeSeance = { readonly lecon?: unknown; readonly termine_le?: unknown };

/** Lecture sous RLS de la dernière séance terminée du profil. `undefined` : aucune séance, ou lecture impossible (sans réseau, profil préparé). */
export async function lireLaDerniereSeanceTerminee(profil: string): Promise<SeanceTermineeConnue | undefined> {
  if (!estUnIdentifiantDeProfil(profil) || !reseauDisponible()) return undefined;
  try {
    await attendreLesEnvoisEnCours();
    const { data, error } = await clientSupabase()
      .from("seances_terminees")
      .select("lecon, termine_le")
      .eq("profil", profil)
      .order("termine_le", { ascending: false })
      .limit(1);
    if (error || data === null) return undefined;
    const [ligne] = data as readonly LigneDeSeance[];
    if (typeof ligne?.lecon !== "string" || typeof ligne.termine_le !== "string") return undefined;
    return { lecon: ligne.lecon, termineeLe: new Date(ligne.termine_le) };
  } catch {
    return undefined;
  }
}
