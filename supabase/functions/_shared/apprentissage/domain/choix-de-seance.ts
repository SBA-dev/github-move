import type { Lecon } from "../../catalogue/domain/index.ts";
import { ExerciceIntrouvable } from "./erreurs.ts";

export type ChoixDeSeance =
  | { readonly genre: "complete" }
  | { readonly genre: "unExercice"; readonly position: number };

export function seanceComplete(): ChoixDeSeance {
  return { genre: "complete" };
}

export function seanceDUnExercice(lecon: Lecon, position: number): ChoixDeSeance {
  if (!Number.isInteger(position) || position < 0 || position >= lecon.exercices.length) {
    throw new ExerciceIntrouvable();
  }
  return { genre: "unExercice", position };
}
