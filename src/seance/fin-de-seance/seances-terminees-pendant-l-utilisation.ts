export type SeanceTermineeConnue = { readonly lecon: string; readonly termineeLe: Date };

const terminees = new Map<string, readonly SeanceTermineeConnue[]>();

/** Retient la leçon et la date de fin d'une séance terminée dans ce navigateur, même si le serveur l'a refusée ou ne l'a pas reçue. */
export function retenirLaSeanceTerminee(profil: string, seance: SeanceTermineeConnue): void {
  terminees.set(profil, [...seancesTermineesPendantLUtilisation(profil), seance]);
}

export function seancesTermineesPendantLUtilisation(profil: string): readonly SeanceTermineeConnue[] {
  return terminees.get(profil) ?? [];
}

export function derniereSeanceTermineePendantLUtilisation(profil: string): SeanceTermineeConnue | undefined {
  return seancesTermineesPendantLUtilisation(profil).reduce<SeanceTermineeConnue | undefined>(
    (recente, seance) => (recente && recente.termineeLe > seance.termineeLe ? recente : seance),
    undefined,
  );
}

export function oublierLesSeancesTerminees(): void {
  terminees.clear();
}
