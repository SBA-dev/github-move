import type { Exercice } from "./exercice.ts";

const TYPES_A_ENONCE = ["bulles", "lecture"];

export function enonceDeLaQuestion(exercice: Exercice, rang: number): string | undefined {
  if (!TYPES_A_ENONCE.includes(exercice.type)) return undefined;
  const question = exercice.questions?.[rang];
  if (typeof question !== "object" || question === null || !("question" in question)) return undefined;
  return typeof question.question === "string" ? question.question : undefined;
}
