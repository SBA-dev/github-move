import {
  QuestionDeBoite,
  QuestionDeCalcul,
  QuestionDeProblemeEnBarres,
  type QuestionDeRevision,
  QuestionDHorloge,
  type QuestionPosee,
} from "@domain/apprentissage";
import { type PersonnageGuide, reagirALaReponse } from "@domain/motivation";
import type { EffetSonore } from "@domain/voix";
import { hasardDuNavigateur } from "../seance/hasard-navigateur.ts";
import {
  encouragerApresUneErreurDeCalcul,
  feliciterPuisExpliquer,
  feliciterUnCalcul,
} from "../seance/exercices/paroles-du-calcul.ts";
import type { ParoleADire } from "../seance/usePersonnageQuiParle.ts";

/** Les vues d'une question qui se joue comme un calcul : calcul, boîte à jetons, problème en barres, horloge. */
export function vueDuCalcul(question: QuestionPosee) {
  if (
    question instanceof QuestionDeCalcul || question instanceof QuestionDeBoite || question instanceof QuestionDeProblemeEnBarres ||
    question instanceof QuestionDHorloge
  ) {
    return question.enCours();
  }
  return undefined;
}

export function encouragerLaReponse(courante: QuestionDeRevision, personnageGuide: PersonnageGuide): ParoleADire {
  if (courante.dictee === undefined) return encouragerApresUneErreurDeCalcul(personnageGuide, courante.question.aideApresErreur());
  const { humeur, parole, effetSonore } = reagirALaReponse(false, personnageGuide, hasardDuNavigateur);
  const aide = courante.dictee.aideApresErreur();
  return {
    texte: aide === undefined ? parole.texte : `${parole.texte} ${aide}`,
    nature: "encouragement",
    humeur,
    effetsAvant: [effetSonore],
  };
}

export function feliciterLaReponse(
  courante: QuestionDeRevision,
  personnageGuide: PersonnageGuide,
  effetsAvant: readonly EffetSonore[],
): ParoleADire {
  const { dictee, question } = courante;
  if (dictee !== undefined) {
    const { humeur, parole } = reagirALaReponse(true, personnageGuide, hasardDuNavigateur);
    return { texte: `${parole.texte} ${dictee.suiteDeLaFelicitation()}`, nature: "felicitation", humeur, effetsAvant };
  }
  if (question instanceof QuestionDeBoite) return feliciterUnCalcul(personnageGuide, question.ouverte().ouverture, effetsAvant);
  if (question instanceof QuestionDeProblemeEnBarres) return feliciterPuisExpliquer(personnageGuide, question.resolu().explication, effetsAvant);
  return feliciterUnCalcul(personnageGuide, undefined, effetsAvant);
}
