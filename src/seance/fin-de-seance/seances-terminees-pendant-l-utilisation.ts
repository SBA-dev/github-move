export type SeanceTermineeConnue = { readonly lecon: string; readonly termineeLe: Date };

const dernieres = new Map<string, SeanceTermineeConnue>();

/** Retient la leçon et la date de fin d'une séance terminée dans ce navigateur, même si le serveur l'a refusée ou ne l'a pas reçue. */
export function retenirLaSeanceTerminee(profil: string, seance: SeanceTermineeConnue): void {
  const precedente = dernieres.get(profil);
  if (!precedente || seance.termineeLe >= precedente.termineeLe) dernieres.set(profil, seance);
}

export function derniereSeanceTermineePendantLUtilisation(profil: string): SeanceTermineeConnue | undefined {
  return dernieres.get(profil);
}

export function oublierLesSeancesTerminees(): void {
  dernieres.clear();
}
