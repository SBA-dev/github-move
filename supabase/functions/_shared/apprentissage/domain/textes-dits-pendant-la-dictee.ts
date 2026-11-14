import { AIDE_APRES_UNE_ERREUR, type QuestionDeDictee } from "./question-de-dictee.ts";

export type TextesDitsPendantLaDictee = {
  readonly normale: readonly string[];
  readonly lente: readonly string[];
};

export function textesDitsPendantLaDictee(question: QuestionDeDictee): TextesDitsPendantLaDictee {
  return {
    normale: [question.texteDit(), question.suiteDeLaFelicitation(), AIDE_APRES_UNE_ERREUR],
    lente: [question.motADire()],
  };
}
