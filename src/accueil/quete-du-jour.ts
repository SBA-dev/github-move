import { type EntreesDuJour, type LeconDuJour, leconDuJour } from "@domain/apprentissage";
import { type FaitsDuJour, type LeconDuJourProposee, type QueteDuJour, queteDuJour } from "@domain/motivation";

/** La leçon du jour d'Apprentissage, sous la forme propre que Motivation lit. */
function leconProposee(lecon: LeconDuJour): LeconDuJourProposee {
  return lecon.genre === "aJouer" ? { genre: "aJouer", lecon: lecon.lecon, titre: lecon.titre } : lecon;
}

/** La quête du jour à partir des lectures de l'accueil ; `nombreDeQuestionsDues` est `undefined` quand la file de révision est inconnue. */
export function queteDuJourDeLAccueil(
  entrees: EntreesDuJour,
  nombreDeQuestionsDues: number | undefined,
  faits: FaitsDuJour,
): QueteDuJour {
  return queteDuJour({ leconDuJour: leconProposee(leconDuJour(entrees)), nombreDeQuestionsDues }, faits);
}
