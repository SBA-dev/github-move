import { AdaptationDeLaDifficulte, historiqueDeCalcul } from "@domain/apprentissage";
import { clientSupabase } from "../../connexion/client-supabase.ts";
import { estUnIdentifiantDeProfil } from "../fin-de-seance/corps-de-la-seance.ts";
import { attendreLesEnvoisEnCours } from "../fin-de-seance/sauvegarde-de-la-seance.ts";

const NOMBRE_DE_SEANCES_LUES = 50;
const FACILITE_NORMALE = 1;
const SEANCES_AVEC_DU_CALCUL = "par_type->calcul.not.is.null,par_type->fluence.not.is.null";
const ATTENTE_MAXIMALE_EN_MS = 3000;

type ReussitesEtErreurs = { readonly reussites: number; readonly erreurs: number };
type ParType = Partial<Record<string, ReussitesEtErreurs>>;

function estUnResultat(valeur: unknown): valeur is ReussitesEtErreurs {
  if (typeof valeur !== "object" || valeur === null) return false;
  const { reussites, erreurs } = valeur as Record<string, unknown>;
  return typeof reussites === "number" && typeof erreurs === "number";
}

function enParType(valeur: unknown): ParType {
  if (typeof valeur !== "object" || valeur === null) return {};
  return Object.fromEntries(Object.entries(valeur).filter(([, resultat]) => estUnResultat(resultat)));
}

/** Lecture sous RLS des résumés des dernières séances terminées qui comptent du calcul ou de la fluence, de la plus récente à la plus ancienne. */
async function lireLesParTypeDesDernieresSeances(profil: string): Promise<ParType[]> {
  await attendreLesEnvoisEnCours();
  const { data, error } = await clientSupabase()
    .from("seances_terminees")
    .select("par_type")
    .eq("profil", profil)
    .or(SEANCES_AVEC_DU_CALCUL)
    .order("termine_le", { ascending: false })
    .limit(NOMBRE_DE_SEANCES_LUES);
  if (error || data === null) return [];
  return (data as { par_type?: unknown }[]).map((ligne) => enParType(ligne.par_type));
}

function apresUnDelai<T>(valeur: T): Promise<T> {
  return new Promise((fin) => setTimeout(() => fin(valeur), ATTENTE_MAXIMALE_EN_MS));
}

/**
 * La facilité des nombres tirés pour ce profil. Sans profil réel (profil préparé), hors ligne ou sans réponse
 * assez vite, la difficulté ne change pas.
 */
export async function lireLaFaciliteDuProfil(profil: string): Promise<number> {
  if (!estUnIdentifiantDeProfil(profil)) return FACILITE_NORMALE;
  try {
    const parType = await Promise.race([lireLesParTypeDesDernieresSeances(profil), apresUnDelai<ParType[]>([])]);
    return AdaptationDeLaDifficulte.depuis(historiqueDeCalcul(parType)).facilite;
  } catch {
    return FACILITE_NORMALE;
  }
}
