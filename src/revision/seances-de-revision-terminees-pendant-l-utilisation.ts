const jours = new Map<string, readonly string[]>();
const identifiants = new Map<string, readonly string[]>();

/** Retient l'identifiant et le jour d'une séance de révision terminée dans ce navigateur, même si le serveur ne l'a pas reçue. */
export function retenirLaSeanceDeRevisionTerminee(profil: string, jour: string, identifiant: string): void {
  jours.set(profil, [...joursDesSeancesDeRevisionTermineesPendantLUtilisation(profil), jour]);
  identifiants.set(profil, [...identifiantsDesSeancesDeRevisionTermineesPendantLUtilisation(profil), identifiant]);
}

export function identifiantsDesSeancesDeRevisionTermineesPendantLUtilisation(profil: string): readonly string[] {
  return identifiants.get(profil) ?? [];
}

export function joursDesSeancesDeRevisionTermineesPendantLUtilisation(profil: string): readonly string[] {
  return jours.get(profil) ?? [];
}

export function oublierLesSeancesDeRevisionTerminees(): void {
  jours.clear();
  identifiants.clear();
}
