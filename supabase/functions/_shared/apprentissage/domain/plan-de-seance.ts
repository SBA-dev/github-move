import type { EtapeDeLecon, Lecon } from "../../catalogue/domain/index.ts";
import type { ChoixDeSeance } from "./choix-de-seance.ts";
import { LeconSansExercice } from "./erreurs.ts";

export type PlanDeSeance = {
  readonly etapes: ReadonlyArray<EtapeDeLecon>;
  readonly positionsDesExercices: ReadonlyArray<number>;
};

export function planDeSeance(lecon: Lecon, choix: ChoixDeSeance): PlanDeSeance {
  if (choix.genre === "unExercice") return { etapes: [], positionsDesExercices: [choix.position] };
  if (lecon.exercices.length === 0) throw new LeconSansExercice();
  return { etapes: lecon.etapes, positionsDesExercices: lecon.exercices.map((_, position) => position) };
}
