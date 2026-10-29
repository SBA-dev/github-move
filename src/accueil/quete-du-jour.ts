import { type EntreesDuJour, type LeconDuJour, leconDuJour } from "@domain/apprentissage";
import {
  type FaitsDuJour,
  type LeconDuJourProposee,
  type PropositionsDuJour,
  type QueteDuJour,
  queteDuJour,
} from "@domain/motivation";

/** La leçon du jour d'Apprentissage, sous la forme propre que Motivation lit. */
function leconProposee(lecon: LeconDuJour): LeconDuJourProposee {
  return lecon.genre === "aJouer" ? { genre: "aJouer", lecon: lecon.lecon, titre: lecon.titre } : lecon;
}

/** Les propositions de l'accueil que la quête du jour désigne ; `nombreDeQuestionsDues` est `undefined` quand la file de révision est inconnue. */
export function propositionsDuJour(entrees: EntreesDuJour, nombreDeQuestionsDues: number | undefined): PropositionsDuJour {
  return { leconDuJour: leconProposee(leconDuJour(entrees)), nombreDeQuestionsDues };
}

/** La quête du jour à partir des lectures de l'accueil. */
export function queteDuJourDeLAccueil(
  entrees: EntreesDuJour,
  nombreDeQuestionsDues: number | undefined,
  faits: FaitsDuJour,
): QueteDuJour {
  return queteDuJour(propositionsDuJour(entrees, nombreDeQuestionsDues), faits);
}
