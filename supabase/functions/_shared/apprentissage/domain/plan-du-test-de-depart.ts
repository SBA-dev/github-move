import type { Exercice, Lecon, Niveau } from "../../catalogue/domain/index.ts";
import type { Hasard } from "./hasard.ts";
import { reserveDuTestDeDepart } from "./reserve-du-test-de-depart.ts";

export type QuestionPrevue = Readonly<{ leconId: string; exercice: number; rang: number }>;
export type PlanDuTestDeDepart = readonly QuestionPrevue[];

const NOMBRE_MAXIMAL_DE_LECONS = 12;

function nombreDeQuestionsCandidates(exercice: Exercice): number {
  switch (exercice.type) {
    case "bulles":
      return exercice.questions.length;
    case "ecoute":
      return exercice.items.length;
    case "calcul":
      return exercice.operations?.length ?? 1;
    case "conjugaison":
      return exercice.formes.length;
    case "trous":
      return exercice.motsAttendus.length;
    case "classer":
      return exercice.items.length;
    case "addition":
      return exercice.operations?.length ?? 1;
    case "dictee":
    case "lecture":
    case "ordre":
    case "memoriser":
    case "fluence":
    case "boite":
    case "barres":
      return 0;
    default:
      return exercice satisfies never;
  }
}

function questionsCandidates(lecon: Lecon): QuestionPrevue[] {
  return lecon.exercices.flatMap((exercice, indice) =>
    Array.from(
      { length: nombreDeQuestionsCandidates(exercice) },
      (_, rang) => ({ leconId: lecon.id, exercice: indice, rang }),
    )
  );
}

function questionPrevueDeLaLecon(lecon: Lecon, hasard: Hasard): QuestionPrevue | undefined {
  const candidates = questionsCandidates(lecon);
  return candidates.length === 0 ? undefined : candidates[Math.floor(hasard.entre0et1() * candidates.length)];
}

function leconsAPasReguliers(reserve: readonly Lecon[]): Lecon[] {
  const pas = Math.max(1, reserve.length / NOMBRE_MAXIMAL_DE_LECONS);
  const nombre = Math.min(reserve.length, NOMBRE_MAXIMAL_DE_LECONS);
  return Array.from({ length: nombre }, (_, i) => reserve[Math.floor(i * pas)]);
}

export function planDuTestDeDepart(lecons: readonly Lecon[], niveau: Niveau, hasard: Hasard): PlanDuTestDeDepart {
  return leconsAPasReguliers(reserveDuTestDeDepart(lecons, niveau))
    .map((lecon) => questionPrevueDeLaLecon(lecon, hasard))
    .filter((question): question is QuestionPrevue => question !== undefined);
}
