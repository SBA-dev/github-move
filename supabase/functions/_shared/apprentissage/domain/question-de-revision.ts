import type { Exercice, Lecon, Niveau } from "../../catalogue/domain/index.ts";
import type { CleDeQuestion } from "./cle-de-question.ts";
import type { OrigineDeLaQuestion } from "./origine-de-la-question.ts";
import type { QuestionDeDictee } from "./question-de-dictee.ts";
import { questionsJoueesAvec } from "./question-jouee.ts";
import type { QuestionPosee } from "./question-posee.ts";
import { questionDeCalculEnLigne, questionDeClassement, questionDeConjugaison } from "./question-du-test-de-depart.ts";
import { EtiquettesAPlacer } from "./etiquettes-a-placer.ts";
import { lireUneAddition } from "./tirage-d-additions.ts";
import { lireUneOperation } from "./tirage-d-operations.ts";
import {
  questionsDeBoite,
  questionsDeCalcul,
  questionsDeDictee,
  questionsDeProblemesEnBarres,
} from "./questions-de-l-exercice.ts";
import type { Tireur } from "./tireur.ts";

export type QuestionDeRevision =
  | Readonly<{ identite: CleDeQuestion; question: QuestionPosee; dictee?: undefined }>
  | Readonly<{ identite: CleDeQuestion; dictee: QuestionDeDictee; question?: undefined }>;

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
  if (exercice.type === "dictee") {
    const dictee = retrouver(questionsDeDictee(exercice, tireur), identite);
    return dictee && { identite, dictee };
  }
  const candidate = retrouver(candidatesPosees(exercice, origine, tireur, niveau), identite);
  return candidate && { identite, question: candidate.question };
}

type CandidatePosee = Readonly<{ cle: CleDeQuestion; question: QuestionPosee }>;

function retrouver<Q extends { readonly cle: CleDeQuestion }>(
  questions: readonly Q[],
  identite: CleDeQuestion,
): Q | undefined {
  return questions.find((candidate) => candidate.cle.valeur === identite.valeur);
}

function candidatesPosees(
  exercice: Exercice,
  origine: OrigineDeLaQuestion,
  tireur: Tireur,
  niveau: Niveau,
): readonly CandidatePosee[] {
  switch (exercice.type) {
    case "classer":
      return EtiquettesAPlacer.questionsDeClasser(exercice).map(({ cle }, rang) => ({
        cle,
        question: questionDeClassement(exercice, rang, tireur),
      }));
    case "conjugaison":
      return exercice.formes.map((forme) => lierALaCle(questionDeConjugaison(exercice, forme, tireur)));
    case "addition": {
      const additions = exercice.operations ??
        (origine.tirage === undefined ? [] : [lireUneAddition(origine.tirage)]);
      return additions.map((addition) => lierALaCle(questionDeCalculEnLigne(addition, tireur, niveau)));
    }
    case "boite":
      return questionsDeBoite(exercice, tireur, niveau).map(lierALaCle);
    case "barres":
      return questionsDeProblemesEnBarres(exercice, tireur, niveau).map(lierALaCle);
    case "calcul": {
      const operations = exercice.operations ??
        (origine.tirage === undefined ? [] : [lireUneOperation(origine.tirage)]);
      return questionsDeCalcul(operations, tireur, niveau).map(lierALaCle);
    }
    default:
      return questionsJoueesAvec(exercice, tireur).map(lierALaCle);
  }
}

function lierALaCle(question: QuestionPosee): CandidatePosee {
  return { cle: question.cle, question };
}
