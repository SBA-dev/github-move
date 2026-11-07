import {
  QuestionDeBoite,
  QuestionDeCalcul,
  QuestionDeProblemeEnBarres,
  type QuestionDeRevision,
  type QuestionPosee,
} from "@domain/apprentissage";
import {
  encouragerApresUneErreurDeCalcul,
  feliciterPuisExpliquer,
  feliciterUnCalcul,
  type PersonnageGuide,
} from "@domain/motivation";
import type { EffetSonore } from "@domain/voix";
import { hasardDuNavigateur } from "../seance/hasard-navigateur.ts";
import type { ParoleADire } from "../seance/usePersonnageQuiParle.ts";

/** Les vues d'une question qui se joue comme un calcul : calcul, boîte à jetons, problème en barres. */
export function vueDuCalcul(question: QuestionPosee) {
  if (question instanceof QuestionDeCalcul || question instanceof QuestionDeBoite || question instanceof QuestionDeProblemeEnBarres) {
    return question.enCours();
  }
  return undefined;
}

export function encouragerLaReponse(courante: QuestionDeRevision, personnageGuide: PersonnageGuide): ParoleADire {
  const { dictee, question } = courante;
  const aide = dictee === undefined ? question.aideApresErreur() : dictee.aideApresErreur();
  return encouragerApresUneErreurDeCalcul(personnageGuide, aide, hasardDuNavigateur);
}

export function feliciterLaReponse(
  courante: QuestionDeRevision,
  personnageGuide: PersonnageGuide,
  effetsAvant: readonly EffetSonore[],
): ParoleADire {
  const { dictee, question } = courante;
  if (dictee !== undefined) {
    return feliciterPuisExpliquer(personnageGuide, dictee.suiteDeLaFelicitation(), hasardDuNavigateur, effetsAvant);
  }
  if (question instanceof QuestionDeBoite) {
    return feliciterUnCalcul(personnageGuide, hasardDuNavigateur, question.ouverte().ouverture, effetsAvant);
  }
  if (question instanceof QuestionDeProblemeEnBarres) {
    return feliciterPuisExpliquer(personnageGuide, question.resolu().explication, hasardDuNavigateur, effetsAvant);
  }
  return feliciterUnCalcul(personnageGuide, hasardDuNavigateur, undefined, effetsAvant);
}
