import type { Exercice, Lecon, Niveau } from "../../catalogue/domain/index.ts";
import type { Hasard } from "./hasard.ts";
import { reserveDuTestDeDepart } from "./reserve-du-test-de-depart.ts";

export type QuestionPrevue = Readonly<{ leconId: string; exercice: number; rang: number }>;
export type PlanDuTestDeDepart = readonly QuestionPrevue[];

const NOMBRE_MAXIMAL_DE_LECONS = 12;

function estAdmissibleAuTestDeDepart(exercice: Exercice): boolean {
  return exercice.type === "bulles";
}

function questionPrevueDeLaLecon(lecon: Lecon): QuestionPrevue | undefined {
  const exercice = lecon.exercices.findIndex(estAdmissibleAuTestDeDepart);
  return exercice === -1 ? undefined : { leconId: lecon.id, exercice, rang: 0 };
}

function leconsAPasReguliers(reserve: readonly Lecon[]): Lecon[] {
  const pas = Math.max(1, reserve.length / NOMBRE_MAXIMAL_DE_LECONS);
  const nombre = Math.min(reserve.length, NOMBRE_MAXIMAL_DE_LECONS);
  return Array.from({ length: nombre }, (_, i) => reserve[Math.floor(i * pas)]);
}

export function planDuTestDeDepart(lecons: readonly Lecon[], niveau: Niveau, _hasard: Hasard): PlanDuTestDeDepart {
  return leconsAPasReguliers(reserveDuTestDeDepart(lecons, niveau))
    .map(questionPrevueDeLaLecon)
    .filter((question): question is QuestionPrevue => question !== undefined);
}
