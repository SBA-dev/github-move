import { type Exercice, TYPES_A_ENONCE } from "./exercice.ts";
import { enObjet, texteRequis } from "./lecture.ts";

export function enonceDeLaQuestion(exercice: Exercice, rang: number): string | undefined {
  if (!TYPES_A_ENONCE.includes(exercice.type)) return undefined;
  const question = exercice.questions?.[rang];
  if (question === undefined) return undefined;
  return texteRequis(enObjet(question, "une question").question, "l'énoncé d'une question");
}
