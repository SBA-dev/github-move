import { FunctionsHttpError } from "@supabase/supabase-js";
import type { SeanceDeRevisionTermineeAEnregistrer } from "@domain/apprentissage";
import { appelerUneFonction } from "../connexion/client-supabase.ts";
import { parentConnecte } from "../famille/profils/lecture-des-profils-supabase.ts";
import { estUnIdentifiantDeProfil } from "../seance/fin-de-seance/corps-de-la-seance.ts";
import { type IssueDeLEnvoi, issueDuStatut, type Sauvegarde } from "../seance/fin-de-seance/sauvegarde-de-la-seance.ts";
import { type CorpsDeLaSeanceDeRevision, enCorpsDeLaSeanceDeRevision } from "./corps-de-la-seance-de-revision.ts";
import { SeancesDeRevisionGardeesSurLAppareil } from "./seances-de-revision-gardees-sur-l-appareil.ts";

async function envoyer(corps: CorpsDeLaSeanceDeRevision): Promise<IssueDeLEnvoi> {
  try {
    const { error } = await appelerUneFonction("terminer-la-seance-de-revision", corps);
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
  return sauvegarder(envoi).catch((): Sauvegarde => "ignoree");
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
    }
  } catch {
    // Le prochain retour du réseau réessaiera.
  } finally {
    renvoiEnCours = false;
  }
}
