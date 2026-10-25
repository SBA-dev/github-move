import { FileDeRevision, type QuestionRateeARetenir, type ResultatDeRevision, type Jour } from "@domain/apprentissage";

type Mutation = (file: FileDeRevision) => void;

const copies = new Map<string, FileDeRevision>();
/** Les séances terminées que le serveur n'a pas encore enregistrées, par identifiant de séance : la file qu'il rendra ne les contient pas. */
const envoisEnAttente = new Map<string, { readonly profil: string; readonly mutation: Mutation }>();

function appliquerSurLaCopie(profil: string, seance: string, mutation: Mutation): void {
  const file = copies.get(profil) ?? FileDeRevision.vide(profil);
  mutation(file);
  copies.set(profil, file);
  envoisEnAttente.set(seance, { profil, mutation });
}

/** La séance terminée met la copie de la file à jour tout de suite, par les règles du domaine, sans attendre le serveur. */
export function retenirLesQuestionsRatees(
  profil: string,
  seance: string,
  questions: readonly QuestionRateeARetenir[],
  jour: Jour,
  termineeLe: Date,
): void {
  appliquerSurLaCopie(profil, seance, (file) => file.retenir(questions, jour, termineeLe));
}

export function enregistrerLaRevisionSurLAppareil(
  profil: string,
  seance: string,
  resultats: readonly ResultatDeRevision[],
  jour: Jour,
  termineeLe: Date,
): void {
  appliquerSurLaCopie(profil, seance, (file) => file.enregistrerLaRevision(resultats, jour, termineeLe));
}

/** Le serveur a enregistré (ou refusé pour de bon) la séance : sa file la contient désormais. */
export function confirmerLEnvoi(seance: string): void {
  envoisEnAttente.delete(seance);
}

/** La dernière file connue de l'appareil ; `undefined` si le profil n'en a jamais lu ni modifié. */
export function fileDeRevisionDeLAppareil(profil: string): FileDeRevision | undefined {
  return copies.get(profil);
}

/** La file lue du serveur devient la copie, après y avoir réappliqué les séances qu'il n'a pas encore enregistrées. */
export function adopterLaFileDuServeur(profil: string, file: FileDeRevision): FileDeRevision {
  for (const attente of envoisEnAttente.values()) {
    if (attente.profil === profil) attente.mutation(file);
  }
  copies.set(profil, file);
  return file;
}

export function oublierLesFilesDeRevision(): void {
  copies.clear();
  envoisEnAttente.clear();
}
