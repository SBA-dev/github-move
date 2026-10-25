import { FunctionsHttpError } from "@supabase/supabase-js";
import type { SeanceDeRevisionTermineeAEnregistrer } from "@domain/apprentissage";
import { clientSupabase } from "../connexion/client-supabase.ts";
import { parentConnecte } from "../famille/profils/lecture-des-profils-supabase.ts";
import { estUnIdentifiantDeProfil } from "../seance/fin-de-seance/corps-de-la-seance.ts";
import { type IssueDeLEnvoi, issueDuStatut, type Sauvegarde } from "../seance/fin-de-seance/sauvegarde-de-la-seance.ts";
import { confirmerLEnvoi } from "./copie-de-la-file-sur-l-appareil.ts";
import { type CorpsDeLaSeanceDeRevision, enCorpsDeLaSeanceDeRevision } from "./corps-de-la-seance-de-revision.ts";
import { SeancesDeRevisionGardeesSurLAppareil } from "./seances-de-revision-gardees-sur-l-appareil.ts";

const envoisEnCours = new Set<Promise<unknown>>();

async function envoyer(corps: CorpsDeLaSeanceDeRevision): Promise<IssueDeLEnvoi> {
  try {
    const { error } = await clientSupabase().functions.invoke("terminer-la-seance-de-revision", { body: corps });
    if (!error) return "enregistree";
    return error instanceof FunctionsHttpError ? issueDuStatut(error.context.status) : "impossible";
  } catch {
    return "impossible";
  }
}

async function sauvegarder(envoi: SeanceDeRevisionTermineeAEnregistrer): Promise<Sauvegarde> {
  if (!estUnIdentifiantDeProfil(envoi.enfant)) return "ignoree";
  const parent = await parentConnecte();
  if (parent === undefined) return "ignoree";
  const corps = enCorpsDeLaSeanceDeRevision(envoi);
  const issue = await envoyer(corps);
  if (issue === "enregistree") return "enregistree";
  if (issue === "refusee") return "ignoree";
  return (await new SeancesDeRevisionGardeesSurLAppareil().garder(parent, corps)) ? "gardee" : "perdue";
}

/** Envoie la séance de révision terminée au serveur, sans jamais lever d'erreur. */
export function sauvegarderLaSeanceDeRevision(envoi: SeanceDeRevisionTermineeAEnregistrer): Promise<Sauvegarde> {
  const envoyee = sauvegarder(envoi).then((sauvegarde) => {
    if (sauvegarde === "enregistree" || sauvegarde === "ignoree") confirmerLEnvoi(envoi.id);
    return sauvegarde;
  }).catch((): Sauvegarde => "ignoree");
  envoisEnCours.add(envoyee);
  void envoyee.finally(() => envoisEnCours.delete(envoyee));
  return envoyee;
}

/** Pour lire la file après les envois lancés par la séance de révision qui vient de finir. */
export async function attendreLesEnvoisDesSeancesDeRevision(): Promise<void> {
  await Promise.allSettled([...envoisEnCours]);
}

let renvoiEnCours = false;

/** Renvoie les séances de révision gardées sur l'appareil (retour du réseau, prochain lancement). S'arrête au premier échec. */
export async function renvoyerLesSeancesDeRevisionGardees(): Promise<void> {
  if (renvoiEnCours) return;
  renvoiEnCours = true;
  try {
    const parent = await parentConnecte();
    if (parent === undefined) return;
    const appareil = new SeancesDeRevisionGardeesSurLAppareil();
    for (const corps of await appareil.lire(parent)) {
      const issue = await envoyer(corps);
      if (issue === "impossible") return;
      await appareil.retirer(corps.id);
      confirmerLEnvoi(corps.id);
    }
  } catch {
    // Le prochain retour du réseau réessaiera.
  } finally {
    renvoiEnCours = false;
  }
}
