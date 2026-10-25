const jours = new Map<string, readonly string[]>();

/** Retient le jour d'une séance de révision terminée dans ce navigateur, même si le serveur ne l'a pas reçue. */
export function retenirLaSeanceDeRevisionTerminee(profil: string, jour: string): void {
  jours.set(profil, [...joursDesSeancesDeRevisionTermineesPendantLUtilisation(profil), jour]);
}

export function joursDesSeancesDeRevisionTermineesPendantLUtilisation(profil: string): readonly string[] {
  return jours.get(profil) ?? [];
}

export function oublierLesSeancesDeRevisionTerminees(): void {
  jours.clear();
}
