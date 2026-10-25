import type { ExerciceClasser, Lecon, Niveau } from "../../catalogue/domain/index.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { GroupeInconnu, QuestionHorsDuTestDeDepart } from "./erreurs.ts";
import { questionsDeTrous, sansDoublonsNiReponse } from "./exercices/trous.ts";
import type { QuestionPrevue } from "./plan-du-test-de-depart.ts";
import { QuestionDeCalcul } from "./question-de-calcul.ts";
import { QuestionJouee, questionJoueeDuTrou, questionsJoueesAvec } from "./question-jouee.ts";
import type { QuestionPosee } from "./question-posee.ts";
import { enonceDUneAddition } from "./tirage-d-additions.ts";
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
    case "conjugaison": {
      const { pronom, forme } = elementOuHorsDuTest(exercice.formes, rang, exercice.type);
      return QuestionJouee.aChoix({
        cle: CleDeQuestion.de("conjugaison", `${exercice.verbe} · ${exercice.temps} · ${pronom}`),
        enonce: `Le verbe ${exercice.verbe} au ${exercice.temps} : ${pronom} …`,
        choix: tireur.trou(forme, sansDoublonsNiReponse(exercice.formes.map((f) => f.forme), forme)),
        bonneReponse: forme,
        type: "conjugaison",
      });
    }
    case "trous":
      return questionJoueeDuTrou(elementOuHorsDuTest(questionsDeTrous(exercice), rang, exercice.type), tireur);
    case "classer":
      return questionDeClassement(exercice, rang, tireur);
    case "addition": {
      const additions = exercice.operations ?? (exercice.generateur ? tireur.additions(exercice.generateur) : []);
      const addition = elementOuHorsDuTest(additions, rang, exercice.type);
      const somme = addition.reduce((total, nombre) => total + nombre, 0);
      return QuestionDeCalcul.pour({ q: enonceDUneAddition(addition), r: somme }, tireur, niveau);
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

function questionDeClassement(exercice: ExerciceClasser, rang: number, tireur: Tireur): QuestionJouee {
  const { texte, groupe } = elementOuHorsDuTest(exercice.items, rang, exercice.type);
  const bonneReponse = exercice.groupes.find(({ id }) => id === groupe)?.nom;
  if (bonneReponse === undefined) throw new GroupeInconnu(groupe);
  return QuestionJouee.aChoix({
    cle: CleDeQuestion.de("classer", texte),
    enonce: `« ${texte} » va dans quelle maison ?`,
    choix: tireur.choix(exercice.groupes.map(({ nom }) => nom), bonneReponse),
    bonneReponse,
    type: "bulles",
  });
}
