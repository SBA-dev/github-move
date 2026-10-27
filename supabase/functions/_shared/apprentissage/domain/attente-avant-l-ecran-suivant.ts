export const DUREE_D_AFFICHAGE_SANS_VOIX_MS = 2000;

export type AttenteAvantLEcranSuivant =
  | { genre: "aucune" }
  | { genre: "enfantQuiContinue" }
  | { genre: "dureeDAffichageSansVoix"; millisecondes: number };

/** Quand la parole n'a pas été entendue, le message reste lisible : durée fixe entre deux questions, bouton à la fin de la séance. */
export function attenteAvantLEcranSuivant(
  parole: { entendue: boolean; seanceTerminee: boolean },
): AttenteAvantLEcranSuivant {
  if (parole.entendue) return { genre: "aucune" };
  if (parole.seanceTerminee) return { genre: "enfantQuiContinue" };
  return { genre: "dureeDAffichageSansVoix", millisecondes: DUREE_D_AFFICHAGE_SANS_VOIX_MS };
}
