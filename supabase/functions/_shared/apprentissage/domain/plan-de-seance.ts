import type { EtapeDeLecon, Lecon } from "../../catalogue/domain/index.ts";
import type { ChoixDeSeance } from "./choix-de-seance.ts";
import { ExerciceIntrouvable, LeconSansExercice } from "./erreurs.ts";

export class PlanDeSeance {
  private constructor(
    readonly etapes: readonly EtapeDeLecon[],
    readonly positionsDesExercices: readonly number[],
  ) {}

  static pour(lecon: Lecon, choix: ChoixDeSeance): PlanDeSeance {
    if (lecon.exercices.length === 0) throw new LeconSansExercice(lecon.id);
    if (choix.genre === "unExercice") {
      if (!lecon.exercices[choix.position]) throw new ExerciceIntrouvable(choix.position);
      return new PlanDeSeance([], [choix.position]);
    }
    return new PlanDeSeance(lecon.etapes, lecon.exercices.map((_, position) => position));
  }
}
