import { FunctionsHttpError } from "@supabase/supabase-js";
import type { SeanceTermineeAEnregistrer } from "@domain/apprentissage";
import { appelerUneFonction } from "../../connexion/client-supabase.ts";
import { parentConnecte } from "../../famille/profils/lecture-des-profils-supabase.ts";
import { type CorpsDeLaSeance, enCorps, estUnIdentifiantDeProfil } from "./corps-de-la-seance.ts";
import { SeancesGardeesSurLAppareil } from "./seances-gardees-sur-l-appareil.ts";

/**
 * - `enregistree` : le serveur l'a comptée.
 * - `gardee` : envoi impossible, la séance est gardée sur l'appareil pour plus tard.
 * - `perdue` : envoi impossible et l'appareil n'a pas pu la garder.
 * - `ignoree` : rien à envoyer (profil préparé, aucun parent connecté) ou séance refusée : l'enfant ne voit rien de plus.
 */
export type Sauvegarde = "enregistree" | "gardee" | "perdue" | "ignoree";

export type IssueDeLEnvoi = "enregistree" | "refusee" | "impossible";

const STATUT_NON_AUTORISE = 401;
const PREMIER_STATUT_SERVEUR_INDISPONIBLE = 500;

const envoisEnCours = new Set<Promise<unknown>>();

/** Le serveur a répondu 4xx autre que 401 : le renvoyer ne changerait rien. Un 401 ou un 5xx peut se rétablir. */
export function issueDuStatut(statut: number): IssueDeLEnvoi {
  return statut === STATUT_NON_AUTORISE || statut >= PREMIER_STATUT_SERVEUR_INDISPONIBLE ? "impossible" : "refusee";
}

async function envoyer(corps: CorpsDeLaSeance): Promise<IssueDeLEnvoi> {
  try {
    const { error } = await appelerUneFonction("terminer-la-seance", corps);
    if (!error) return "enregistree";
    return error instanceof FunctionsHttpError ? issueDuStatut(error.context.status) : "impossible";
  } catch {
    return "impossible";
  }
}

async function sauvegarder(envoi: SeanceTermineeAEnregistrer): Promise<Sauvegarde> {
  if (!estUnIdentifiantDeProfil(envoi.enfant)) return "ignoree";
  const parent = await parentConnecte();
  if (parent === undefined) return "ignoree";
  const corps = enCorps(envoi);
  const issue = await envoyer(corps);
  if (issue === "enregistree") return "enregistree";
  if (issue === "refusee") return "ignoree";
  return (await new SeancesGardeesSurLAppareil().garder(parent, corps)) ? "gardee" : "perdue";
}

/** Envoie la séance terminée au serveur, sans jamais lever d'erreur. */
export function sauvegarderLaSeance(envoi: SeanceTermineeAEnregistrer): Promise<Sauvegarde> {
  const envoyee = sauvegarder(envoi).catch((): Sauvegarde => "ignoree");
  envoisEnCours.add(envoyee);
  void envoyee.finally(() => envoisEnCours.delete(envoyee));
  return envoyee;
}

/** Pour lire les étoiles après les envois lancés par la séance qui vient de finir. */
export async function attendreLesEnvoisEnCours(): Promise<void> {
  await Promise.allSettled([...envoisEnCours]);
}

let renvoiEnCours: Promise<void> | undefined;

async function renvoyer(): Promise<void> {
  try {
    const parent = await parentConnecte();
    if (parent === undefined) return;
    const appareil = new SeancesGardeesSurLAppareil();
    for (const corps of await appareil.lire(parent)) {
      const issue = await envoyer(corps);
      if (issue === "impossible") return;
      await appareil.retirer(corps.seance);
    }
  } catch {
    // Le prochain retour du réseau réessaiera.
  }
}

/** Renvoie les séances gardées sur l'appareil (retour du réseau, prochain lancement). S'arrête au premier échec. */
export function renvoyerLesSeancesGardees(): Promise<void> {
  if (renvoiEnCours) return Promise.resolve();
  const renvoi = renvoyer().finally(() => {
    renvoiEnCours = undefined;
  });
  renvoiEnCours = renvoi;
  return renvoi;
}

/** Pour les écritures qui dépendent des séances : attend le renvoi en cours, ou le fait. */
export async function attendreLeRenvoiDesSeancesGardees(): Promise<void> {
  await (renvoiEnCours ?? renvoyerLesSeancesGardees());
}

/** Une séance gardée n'a pas pu être envoyée : les étoiles du serveur ne la comptent pas encore. */
export async function resteDesSeancesGardees(): Promise<boolean> {
  const parent = await parentConnecte();
  return parent !== undefined && (await new SeancesGardeesSurLAppareil().lire(parent)).length > 0;
}
