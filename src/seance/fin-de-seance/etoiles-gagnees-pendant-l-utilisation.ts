import { type Etoiles, meilleuresEtoilesReunies } from "@domain/apprentissage";

const gagnees = new Map<string, ReadonlyMap<string, Etoiles>>();

/** Retient les étoiles d'une séance terminée dans ce navigateur, avant même que le serveur les ait enregistrées. */
export function retenirLesEtoilesGagnees(profil: string, lecon: string, etoiles: Etoiles): void {
  gagnees.set(profil, meilleuresEtoilesReunies(etoilesGagneesPendantLUtilisation(profil), new Map([[lecon, etoiles]])));
}

export function etoilesGagneesPendantLUtilisation(profil: string): ReadonlyMap<string, Etoiles> {
  return gagnees.get(profil) ?? new Map<string, Etoiles>();
}

export function oublierLesEtoilesGagnees(): void {
  gagnees.clear();
}
