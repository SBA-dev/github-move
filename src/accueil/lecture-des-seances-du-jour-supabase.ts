import { clientSupabase } from "../connexion/client-supabase.ts";
import { avecDelaiMaximal } from "../reseau/avec-delai-maximal.ts";
import { reseauDisponible } from "../reseau/reseau-disponible.ts";
import { estUnIdentifiantDeProfil } from "../seance/fin-de-seance/corps-de-la-seance.ts";
import { attendreLesEnvoisEnCours } from "../seance/fin-de-seance/sauvegarde-de-la-seance.ts";
import { jourDeLaSeance } from "../seance/jour-de-la-seance.ts";
import type { SeanceTermineeConnue } from "../seance/fin-de-seance/seances-terminees-pendant-l-utilisation.ts";

/** Au-delà, la lecture serveur est ignorée : l'objectif du jour se contente des séances connues de l'appareil. */
const DELAI_MAXIMAL_DE_LECTURE_EN_MS = 5000;
const UN_JOUR_EN_MS = 24 * 60 * 60 * 1000;
const DEUX_JOURS_EN_MS = 2 * UN_JOUR_EN_MS;
/** La fenêtre de lecture de la série : plus longue qu'une série que l'on espère, assez courte pour une lecture légère. */
export const NOMBRE_DE_JOURS_LUS_POUR_LA_SERIE = 400;

type LigneDeSeance = { readonly lecon?: unknown; readonly termine_le?: unknown; readonly jour?: unknown };
type LigneAvecJour = { readonly jour?: unknown };

function peutLire(profil: string): boolean {
  return estUnIdentifiantDeProfil(profil) && reseauDisponible();
}

/** Lecture sous RLS des séances terminées des dernières 48 heures : le domaine garde celles du jour de l'appareil. */
export function lireLesSeancesTermineesRecentes(profil: string, maintenant: Date): Promise<readonly SeanceTermineeConnue[] | undefined> {
  return avecDelaiMaximal(lireLesSeances(profil, new Date(maintenant.getTime() - DEUX_JOURS_EN_MS)), DELAI_MAXIMAL_DE_LECTURE_EN_MS);
}

/** Lecture sous RLS des seuls jours des séances terminées de la fenêtre de la série. */
export function lireLesJoursDesSeancesTermineesPourLaSerie(profil: string, maintenant: Date): Promise<readonly string[] | undefined> {
  const depuis = new Date(maintenant.getTime() - NOMBRE_DE_JOURS_LUS_POUR_LA_SERIE * UN_JOUR_EN_MS);
  return avecDelaiMaximal(lireLesJoursDesSeances(profil, depuis), DELAI_MAXIMAL_DE_LECTURE_EN_MS);
}

/** Lecture sous RLS des jours des séances de révision terminées depuis la veille. */
export function lireLesJoursDesSeancesDeRevisionRecentes(profil: string, depuis: string): Promise<readonly string[] | undefined> {
  return avecDelaiMaximal(lireLesRevisions(profil, depuis), DELAI_MAXIMAL_DE_LECTURE_EN_MS);
}

async function lireLesSeances(profil: string, depuis: Date): Promise<readonly SeanceTermineeConnue[] | undefined> {
  if (!peutLire(profil)) return undefined;
  try {
    await attendreLesEnvoisEnCours();
    const { data, error } = await clientSupabase()
      .from("seances_terminees")
      .select("lecon, termine_le, jour")
      .eq("profil", profil)
      .gte("termine_le", depuis.toISOString())
      .order("termine_le", { ascending: false });
    if (error || data === null) return undefined;
    return (data as readonly LigneDeSeance[]).flatMap((ligne) =>
      lireUneSeance(ligne)
    );
  } catch {
    return undefined;
  }
}

function lireUneSeance(ligne: LigneDeSeance): readonly SeanceTermineeConnue[] {
  if (typeof ligne.lecon !== "string" || typeof ligne.termine_le !== "string") return [];
  const termineeLe = new Date(ligne.termine_le);
  return [{ lecon: ligne.lecon, termineeLe, jour: jourDeLaSeance(ligne.jour, termineeLe) }];
}

async function lireLesJoursDesSeances(profil: string, depuis: Date): Promise<readonly string[] | undefined> {
  if (!peutLire(profil)) return undefined;
  try {
    await attendreLesEnvoisEnCours();
    const { data, error } = await clientSupabase()
      .from("seances_terminees")
      .select("jour")
      .eq("profil", profil)
      .gte("termine_le", depuis.toISOString())
      .order("termine_le", { ascending: false });
    if (error || data === null) return undefined;
    return (data as readonly LigneAvecJour[]).flatMap((ligne) => (typeof ligne.jour === "string" ? [ligne.jour] : []));
  } catch {
    return undefined;
  }
}

async function lireLesRevisions(profil: string, depuis: string): Promise<readonly string[] | undefined> {
  if (!peutLire(profil)) return undefined;
  try {
    const { data, error } = await clientSupabase().from("seances_de_revision_terminees").select("jour").eq("profil", profil).gte("jour", depuis)
      .order("jour", { ascending: false });
    if (error || data === null) return undefined;
    return (data as readonly LigneAvecJour[]).flatMap((ligne) => (typeof ligne.jour === "string" ? [ligne.jour] : []));
  } catch {
    return undefined;
  }
}
