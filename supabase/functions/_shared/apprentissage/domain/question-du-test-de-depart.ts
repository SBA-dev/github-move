import type { ExerciceClasser, Lecon, Niveau } from "../../catalogue/domain/index.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { QuestionHorsDuTestDeDepart } from "./erreurs.ts";
import { questionsDeTrous } from "./exercices/trous.ts";
import type { QuestionPrevue } from "./plan-du-test-de-depart.ts";
import { QuestionDeCalcul } from "./question-de-calcul.ts";
import { QuestionJouee, questionsJoueesAvec } from "./question-jouee.ts";
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
  const exercice = lecon.exercices[position];
  switch (exercice.type) {
    case "bulles":
      return questionsJoueesAvec({ ...exercice, questions: [exercice.questions[rang]] }, tireur)[0];
    case "ecoute":
      return questionsJoueesAvec({ ...exercice, items: [exercice.items[rang]] }, tireur)[0];
    case "calcul": {
      const operations = exercice.operations ?? (exercice.generateur ? tireur.operations(exercice.generateur) : []);
      return QuestionDeCalcul.pour(operations[rang], tireur, niveau);
    }
    case "conjugaison": {
      const { pronom, forme } = exercice.formes[rang];
      const autresFormes = exercice.formes.filter((_, autre) => autre !== rang).map((autre) => autre.forme);
      return QuestionJouee.aChoix({
        cle: CleDeQuestion.de("conjugaison", `${exercice.verbe} · ${exercice.temps} · ${pronom}`),
        enonce: `Le verbe ${exercice.verbe} au ${exercice.temps} : ${pronom} …`,
        choix: tireur.trou(forme, autresFormes.filter((autre) => autre !== forme)),
        bonneReponse: forme,
        type: "conjugaison",
      });
    }
    case "trous": {
      const question = questionsDeTrous(exercice)[rang];
      return QuestionJouee.aChoix({
        cle: CleDeQuestion.de("trous", question.enonce),
        enonce: question.enonce,
        choix: tireur.trou(question.motAttendu, question.candidats),
        bonneReponse: question.motAttendu,
        type: "trous",
      });
    }
    case "classer":
      return questionDeClassement(exercice, rang, tireur);
    case "addition": {
      const additions = exercice.operations ?? (exercice.generateur ? tireur.additions(exercice.generateur) : []);
      const addition = additions[rang];
      const somme = addition.reduce((total, nombre) => total + nombre, 0);
      return QuestionDeCalcul.pour({ q: enonceDUneAddition(addition), r: somme }, tireur, niveau);
    }
    default:
      throw new QuestionHorsDuTestDeDepart(exercice.type);
  }
}

function questionDeClassement(exercice: ExerciceClasser, rang: number, tireur: Tireur): QuestionJouee {
  const { texte, groupe } = exercice.items[rang];
  const bonneReponse = exercice.groupes.find(({ id }) => id === groupe)?.nom ?? groupe;
  return QuestionJouee.aChoix({
    cle: CleDeQuestion.de("classer", texte),
    enonce: `« ${texte} » va dans quelle maison ?`,
    choix: tireur.choix(exercice.groupes.map(({ nom }) => nom), bonneReponse),
    bonneReponse,
    type: "bulles",
  });
}
