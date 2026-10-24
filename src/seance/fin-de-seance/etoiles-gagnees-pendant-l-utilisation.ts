import type { Etoiles } from "@domain/apprentissage";

const gagnees = new Map<string, Map<string, Etoiles>>();

/** Retient les étoiles d'une séance terminée dans ce navigateur, avant même que le serveur les ait enregistrées. */
export function retenirLesEtoilesGagnees(profil: string, lecon: string, etoiles: Etoiles): void {
  const duProfil = gagnees.get(profil) ?? new Map<string, Etoiles>();
  duProfil.set(lecon, etoiles.meilleureQue(duProfil.get(lecon)));
  gagnees.set(profil, duProfil);
}

export function etoilesGagneesPendantLUtilisation(profil: string): ReadonlyMap<string, Etoiles> {
  return gagnees.get(profil) ?? new Map<string, Etoiles>();
}
