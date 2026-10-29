import { FunctionsHttpError } from "@supabase/supabase-js";
import type { DefiTermineAEnregistrer } from "@domain/apprentissage";
import { appelerUneFonction } from "../connexion/client-supabase.ts";
import { parentConnecte } from "../famille/profils/lecture-des-profils-supabase.ts";
import { estUnIdentifiantDeProfil } from "../seance/fin-de-seance/corps-de-la-seance.ts";
import { type IssueDeLEnvoi, issueDuStatut, type Sauvegarde } from "../seance/fin-de-seance/sauvegarde-de-la-seance.ts";
import { type CorpsDuDefi, enCorpsDuDefi } from "./corps-du-defi.ts";
import { DefisGardesSurLAppareil } from "./defis-gardes-sur-l-appareil.ts";

async function envoyer(corps: CorpsDuDefi): Promise<IssueDeLEnvoi> {
  try {
    const { error } = await appelerUneFonction("terminer-le-defi", corps);
    if (!error) return "enregistree";
    return error instanceof FunctionsHttpError ? issueDuStatut(error.context.status) : "impossible";
  } catch {
    return "impossible";
  }
}

async function sauvegarder(envoi: DefiTermineAEnregistrer): Promise<Sauvegarde> {
  if (!estUnIdentifiantDeProfil(envoi.enfant)) return "ignoree";
  const parent = await parentConnecte();
  if (parent === undefined) return "ignoree";
  const corps = enCorpsDuDefi(envoi);
  const issue = await envoyer(corps);
  if (issue === "enregistree") return "enregistree";
  if (issue === "refusee") return "ignoree";
  return (await new DefisGardesSurLAppareil().garder(parent, corps)) ? "gardee" : "perdue";
}

/** Envoie le défi terminé au serveur, sans jamais lever d'erreur. */
export function sauvegarderLeDefi(envoi: DefiTermineAEnregistrer): Promise<Sauvegarde> {
  return sauvegarder(envoi).catch((): Sauvegarde => "ignoree");
}

let renvoiEnCours = false;

/** Renvoie les défis gardés sur l'appareil (retour du réseau, prochain lancement). S'arrête au premier échec. */
export async function renvoyerLesDefisGardes(): Promise<void> {
  if (renvoiEnCours) return;
  renvoiEnCours = true;
  try {
    const parent = await parentConnecte();
    if (parent === undefined) return;
    const appareil = new DefisGardesSurLAppareil();
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
