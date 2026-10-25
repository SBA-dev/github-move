import type { Exercice, Lecon, Niveau } from "../../catalogue/domain/index.ts";
import type { CleDeQuestion } from "./cle-de-question.ts";
import type { OrigineDeLaQuestion } from "./origine-de-la-question.ts";
import { QuestionDeCalcul } from "./question-de-calcul.ts";
import { questionsJoueesAvec } from "./question-jouee.ts";
import type { QuestionPosee } from "./question-posee.ts";
import { lireUneOperation } from "./tirage-d-operations.ts";
import type { Tireur } from "./tireur.ts";

export type QuestionDeRevision = Readonly<{ identite: CleDeQuestion; question: QuestionPosee }>;

/** La question retenue, retrouvée par sa clé dans l'exercice d'où elle vient. */
export function questionDeRevision(
  lecon: Lecon,
  origine: OrigineDeLaQuestion,
  identite: CleDeQuestion,
  tireur: Tireur,
  niveau: Niveau,
): QuestionDeRevision | undefined {
  const exercice = lecon.exercices[origine.position];
  if (!exercice) return undefined;
  const question = questionsDeLExercice(exercice, origine, tireur, niveau)
    .find((candidate) => candidate.cle.valeur === identite.valeur);
  return question && { identite, question };
}

function questionsDeLExercice(
  exercice: Exercice,
  origine: OrigineDeLaQuestion,
  tireur: Tireur,
  niveau: Niveau,
): readonly QuestionPosee[] {
  if (exercice.type !== "calcul") return questionsJoueesAvec(exercice, tireur);
  const operations = exercice.operations ?? (origine.tirage === undefined ? [] : [lireUneOperation(origine.tirage)]);
  return operations.map((operation) => QuestionDeCalcul.pour(operation, tireur, niveau));
}
