import type { Objet } from "../lecture.ts";
import { lireQuestionsAChoix, type QuestionAChoix } from "./question-a-choix.ts";

export type ExerciceBulles = Readonly<{
  type: "bulles";
  titre?: string;
  consigne?: string;
  questions: readonly QuestionAChoix[];
}>;

export function lireBulles(brut: Objet, communs: { titre?: string; consigne?: string }): ExerciceBulles {
  return Object.freeze({ type: "bulles", ...communs, questions: lireQuestionsAChoix(brut.questions) });
}
