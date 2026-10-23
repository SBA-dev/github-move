import type { Exercice } from "./exercice.ts";

export function enonceDeLaQuestion(exercice: Exercice, rang: number): string | undefined {
  if (exercice.type !== "bulles" && exercice.type !== "lecture") return undefined;
  return exercice.questions[rang]?.question;
}
