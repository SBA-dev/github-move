import { FileDeRevision, type QuestionRateeARetenir, type ResultatDeRevision, type Jour } from "@domain/apprentissage";

type Mutation = (file: FileDeRevision) => void;

const copies = new Map<string, FileDeRevision>();

function appliquerSurLaCopie(profil: string, mutation: Mutation): void {
  const file = copies.get(profil) ?? FileDeRevision.vide(profil);
  mutation(file);
  file.retirerFaits();
  copies.set(profil, file);
}

/** La séance terminée met la copie de la file à jour tout de suite, par les règles du domaine, sans attendre le serveur. */
export function retenirLesQuestionsRatees(
  profil: string,
  questions: readonly QuestionRateeARetenir[],
  jour: Jour,
  termineeLe: Date,
): void {
  appliquerSurLaCopie(profil, (file) => file.retenir(questions, jour, termineeLe));
}

export function enregistrerLaRevisionSurLAppareil(
  profil: string,
  resultats: readonly ResultatDeRevision[],
  jour: Jour,
  termineeLe: Date,
): void {
  appliquerSurLaCopie(profil, (file) => file.enregistrerLaRevision(resultats, jour, termineeLe));
}

/** La dernière file connue de l'appareil ; `undefined` si le profil n'en a jamais lu ni modifié. */
export function fileDeRevisionDeLAppareil(profil: string): FileDeRevision | undefined {
  return copies.get(profil);
}

/**
 * La file lue du serveur devient la copie, sauf si l'appareil en a déjà une (une séance terminée pendant la lecture) :
 * l'appareil la fait ensuite évoluer seul, par les règles du domaine. Rend la copie.
 */
export function adopterLaFileDuServeur(profil: string, file: FileDeRevision): FileDeRevision {
  const copie = copies.get(profil);
  if (copie) return copie;
  copies.set(profil, file);
  return file;
}

export function oublierLesFilesDeRevision(): void {
  copies.clear();
}
