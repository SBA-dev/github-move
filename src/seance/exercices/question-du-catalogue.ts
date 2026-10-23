import type { Exercice } from "@domain/catalogue";

/** Ce que le catalogue publie sur la question en cours et que la question jouée ne porte pas. */
export type QuestionDuCatalogue = {
  readonly type: "bulles" | "lecture" | "ecoute";
  readonly reponse: string;
  readonly aide?: string;
  /** Écoute seulement : le mot à écouter, jamais écrit, et sa langue. */
  readonly dire?: string;
  readonly langue?: string;
};

export function questionDuCatalogue(exercice: Exercice | undefined, rang: number): QuestionDuCatalogue | undefined {
  if (exercice?.type === "bulles" || exercice?.type === "lecture") {
    const question = exercice.questions[rang];
    return question && { type: exercice.type, reponse: question.reponse, aide: question.aide };
  }
  if (exercice?.type === "ecoute") {
    const item = exercice.items[rang];
    return item && { type: "ecoute", reponse: item.reponse, aide: item.aide, dire: item.dire, langue: exercice.langue };
  }
  return undefined;
}
