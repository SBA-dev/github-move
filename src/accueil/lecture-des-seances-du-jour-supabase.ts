import { clientSupabase } from "../connexion/client-supabase.ts";
import { avecDelaiMaximal } from "../reseau/avec-delai-maximal.ts";
import { reseauDisponible } from "../reseau/reseau-disponible.ts";
import { estUnIdentifiantDeProfil } from "../seance/fin-de-seance/corps-de-la-seance.ts";
import { attendreLesEnvoisEnCours } from "../seance/fin-de-seance/sauvegarde-de-la-seance.ts";
import type { SeanceTermineeConnue } from "../seance/fin-de-seance/seances-terminees-pendant-l-utilisation.ts";

/** Au-delà, la lecture serveur est ignorée : l'objectif du jour se contente des séances connues de l'appareil. */
const DELAI_MAXIMAL_DE_LECTURE_EN_MS = 5000;
const DEUX_JOURS_EN_MS = 48 * 60 * 60 * 1000;

type LigneDeSeance = { readonly lecon?: unknown; readonly termine_le?: unknown };
type LigneDeRevision = { readonly jour?: unknown };

function peutLire(profil: string): boolean {
  return estUnIdentifiantDeProfil(profil) && reseauDisponible();
}

/** Lecture sous RLS des séances terminées des dernières 48 heures : le domaine garde celles du jour de l'appareil. */
export function lireLesSeancesTermineesRecentes(profil: string, maintenant: Date): Promise<readonly SeanceTermineeConnue[] | undefined> {
  return avecDelaiMaximal(lireLesSeances(profil, maintenant), DELAI_MAXIMAL_DE_LECTURE_EN_MS);
}

/** Lecture sous RLS des jours des séances de révision terminées depuis la veille. */
export function lireLesJoursDesSeancesDeRevisionRecentes(profil: string, depuis: string): Promise<readonly string[] | undefined> {
  return avecDelaiMaximal(lireLesRevisions(profil, depuis), DELAI_MAXIMAL_DE_LECTURE_EN_MS);
}

async function lireLesSeances(profil: string, maintenant: Date): Promise<readonly SeanceTermineeConnue[] | undefined> {
  if (!peutLire(profil)) return undefined;
  try {
    await attendreLesEnvoisEnCours();
    const { data, error } = await clientSupabase()
      .from("seances_terminees")
      .select("lecon, termine_le")
      .eq("profil", profil)
      .gte("termine_le", new Date(maintenant.getTime() - DEUX_JOURS_EN_MS).toISOString());
    if (error || data === null) return undefined;
    return (data as readonly LigneDeSeance[]).flatMap((ligne) =>
      typeof ligne.lecon === "string" && typeof ligne.termine_le === "string" ? [{ lecon: ligne.lecon, termineeLe: new Date(ligne.termine_le) }] : []
    );
  } catch {
    return undefined;
  }
}

async function lireLesRevisions(profil: string, depuis: string): Promise<readonly string[] | undefined> {
  if (!peutLire(profil)) return undefined;
  try {
    const { data, error } = await clientSupabase().from("seances_de_revision_terminees").select("jour").eq("profil", profil).gte("jour", depuis);
    if (error || data === null) return undefined;
    return (data as readonly LigneDeRevision[]).flatMap((ligne) => (typeof ligne.jour === "string" ? [ligne.jour] : []));
  } catch {
    return undefined;
  }
}
