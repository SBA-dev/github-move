import type { Exercice } from "@domain/catalogue";

const TYPES_A_QUESTIONS_AFFICHEES = ["bulles", "lecture"];

/** Affichage minimal de #16 : le texte de la question en cours des exercices à bulles. Les autres mécaniques arrivent avec #17 à #22. */
export function texteDeLaQuestion(exercice: Exercice, rang: number): string | undefined {
  if (!TYPES_A_QUESTIONS_AFFICHEES.includes(exercice.type)) return undefined;
  const question: unknown = exercice.questions?.[rang];
  if (typeof question !== "object" || question === null || !("question" in question)) return undefined;
  return typeof question.question === "string" ? question.question : undefined;
}
