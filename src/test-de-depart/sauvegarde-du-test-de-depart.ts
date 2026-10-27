import { FunctionsHttpError } from "@supabase/supabase-js";
import type { TestDeDepartTermineAEnregistrer } from "@domain/apprentissage";
import { appelerUneFonction } from "../connexion/client-supabase.ts";
import { parentConnecte } from "../famille/profils/lecture-des-profils-supabase.ts";
import { estUnIdentifiantDeProfil } from "../seance/fin-de-seance/corps-de-la-seance.ts";
import { type IssueDeLEnvoi, issueDuStatut, type Sauvegarde } from "../seance/fin-de-seance/sauvegarde-de-la-seance.ts";
import { type CorpsDuTestDeDepart, enCorpsDuTestDeDepart } from "./corps-du-test-de-depart.ts";
import { TestsDeDepartGardesSurLAppareil } from "./tests-de-depart-gardes-sur-l-appareil.ts";

const envoisEnCours = new Set<Promise<unknown>>();

async function envoyer(corps: CorpsDuTestDeDepart): Promise<IssueDeLEnvoi> {
  try {
    const { error } = await appelerUneFonction("terminer-le-test-de-depart", corps);
    if (!error) return "enregistree";
    return error instanceof FunctionsHttpError ? issueDuStatut(error.context.status) : "impossible";
  } catch {
    return "impossible";
  }
}

async function sauvegarder(envoi: TestDeDepartTermineAEnregistrer, leconsReussies: ReadonlySet<string>): Promise<Sauvegarde> {
  if (!estUnIdentifiantDeProfil(envoi.enfant)) return "ignoree";
  const parent = await parentConnecte();
  if (parent === undefined) return "ignoree";
  const corps = enCorpsDuTestDeDepart(envoi);
  const issue = await envoyer(corps);
  if (issue === "enregistree") return "enregistree";
  if (issue === "refusee") return "ignoree";
  return (await new TestsDeDepartGardesSurLAppareil().garder(parent, corps, leconsReussies)) ? "gardee" : "perdue";
}

/** Envoie le test de départ terminé au serveur, sans jamais lever d'erreur. */
export function sauvegarderLeTestDeDepart(
  envoi: TestDeDepartTermineAEnregistrer,
  leconsReussies: ReadonlySet<string>,
): Promise<Sauvegarde> {
  const envoye = sauvegarder(envoi, leconsReussies).catch((): Sauvegarde => "ignoree");
  envoisEnCours.add(envoye);
  void envoye.finally(() => envoisEnCours.delete(envoye));
  return envoye;
}

/** Pour lire le résultat après les envois lancés par le test qui vient de finir. */
export async function attendreLesEnvoisDesTestsDeDepart(): Promise<void> {
  await Promise.allSettled([...envoisEnCours]);
}

let renvoiEnCours = false;

/** Renvoie les tests de départ gardés sur l'appareil (retour du réseau, prochain lancement). S'arrête au premier échec ; un refus du serveur est définitif. */
export async function renvoyerLesTestsDeDepartGardes(): Promise<void> {
  if (renvoiEnCours) return;
  renvoiEnCours = true;
  try {
    const parent = await parentConnecte();
    if (parent === undefined) return;
    const appareil = new TestsDeDepartGardesSurLAppareil();
    for (const { corps } of await appareil.lire(parent)) {
      const issue = await envoyer(corps);
      if (issue === "impossible") return;
      await appareil.retirer(corps.test);
    }
  } catch {
    // Le prochain retour du réseau réessaiera.
  } finally {
    renvoiEnCours = false;
  }
}
