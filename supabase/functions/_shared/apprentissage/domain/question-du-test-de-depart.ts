import type { Lecon, Niveau } from "../../catalogue/domain/index.ts";
import { QuestionHorsDuTestDeDepart } from "./erreurs.ts";
import { questionsDeTrous } from "./exercices/trous.ts";
import type { QuestionPrevue } from "./plan-du-test-de-depart.ts";
import { QuestionDeCalcul } from "./question-de-calcul.ts";
import { QuestionJouee, questionJoueeDuTrou, questionsJoueesAvec } from "./question-jouee.ts";
import type { QuestionPosee } from "./question-posee.ts";
import { questionDeCalculEnLigne, questionDeClassement, questionDeConjugaison } from "./questions-de-l-exercice.ts";
import type { Tireur } from "./tireur.ts";

/** La question prévue au plan du test de départ, posée comme en séance. */
export function questionDuTestDeDepart(
  lecon: Lecon,
  { exercice: position, rang }: QuestionPrevue,
  tireur: Tireur,
  niveau: Niveau,
): QuestionPosee {
  const exercice = elementOuHorsDuTest(lecon.exercices, position, "absent");
  switch (exercice.type) {
    case "bulles":
      return premiereQuestion(
        questionsJoueesAvec(
          { ...exercice, questions: [elementOuHorsDuTest(exercice.questions, rang, exercice.type)] },
          tireur,
        ),
        exercice.type,
      );
    case "ecoute":
      return premiereQuestion(
        questionsJoueesAvec({ ...exercice, items: [elementOuHorsDuTest(exercice.items, rang, exercice.type)] }, tireur),
        exercice.type,
      );
    case "calcul": {
      const operations = exercice.operations ?? (exercice.generateur ? tireur.operations(exercice.generateur) : []);
      return QuestionDeCalcul.pour(elementOuHorsDuTest(operations, rang, exercice.type), tireur, niveau);
    }
    case "conjugaison":
      return questionDeConjugaison(exercice, elementOuHorsDuTest(exercice.formes, rang, exercice.type), tireur);
    case "trous":
      return questionJoueeDuTrou(elementOuHorsDuTest(questionsDeTrous(exercice), rang, exercice.type), tireur);
    case "classer":
      return questionDeClassement(exercice, elementOuHorsDuTest(exercice.items, rang, exercice.type), tireur);
    case "addition": {
      const additions = exercice.operations ?? (exercice.generateur ? tireur.additions(exercice.generateur) : []);
      return questionDeCalculEnLigne(elementOuHorsDuTest(additions, rang, exercice.type), tireur, niveau);
    }
    default:
      throw new QuestionHorsDuTestDeDepart(exercice.type);
  }
}

function elementOuHorsDuTest<T>(elements: readonly T[], rang: number, type: string): T {
  const element = elements[rang];
  if (element === undefined) throw new QuestionHorsDuTestDeDepart(type);
  return element;
}

function premiereQuestion(questions: readonly QuestionJouee[], type: string): QuestionJouee {
  return elementOuHorsDuTest(questions, 0, type);
}
