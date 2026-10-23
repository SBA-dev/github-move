import { type Objet, texteRequis } from "../lecture.ts";
import { lireQuestionsAChoix, type QuestionAChoix } from "./question-a-choix.ts";

export type ExerciceLecture = Readonly<{
  type: "lecture";
  titre?: string;
  consigne?: string;
  texte: string;
  questions: readonly QuestionAChoix[];
}>;

export function lireExerciceDeLecture(brut: Objet, communs: { titre?: string; consigne?: string }): ExerciceLecture {
  return Object.freeze({
    type: "lecture",
    ...communs,
    texte: texteRequis(brut.texte, "le texte de lecture"),
    questions: lireQuestionsAChoix(brut.questions),
  });
}
