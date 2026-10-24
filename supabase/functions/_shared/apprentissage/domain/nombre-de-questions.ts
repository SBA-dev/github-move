import { type Exercice, type ExerciceAddition } from "../../catalogue/domain/index.ts";
import { AdditionPosee } from "./addition-posee.ts";

const QUESTIONS_PAR_DEFAUT_D_UN_CALCUL = 5;
const QUESTIONS_PAR_VERS = 2;

export function nombreDeQuestions(exercice: Exercice): number {
  switch (exercice.type) {
    case "bulles":
    case "lecture":
      return taille(exercice.questions);
    case "ecoute":
    case "boite":
    case "barres":
    case "classer":
      return taille(exercice.items);
    case "ordre":
      return taille(exercice.elements);
    case "trous":
      return taille(exercice.motsAttendus);
    case "conjugaison":
      return taille(exercice.formes);
    case "dictee":
      return taille(exercice.mots);
    case "calcul":
      return exercice.operations?.length ?? exercice.generateur?.combien ?? QUESTIONS_PAR_DEFAUT_D_UN_CALCUL;
    case "fluence":
      return 1;
    case "memoriser":
      return taille(exercice.vers) * QUESTIONS_PAR_VERS;
    case "addition":
      return lesAdditionsLesPlusLongues(exercice)
        .map((nombres) => questionsDUneAddition(nombres, exercice.etapes))
        .reduce((total, questions) => total + questions, 0);
  }
}

function taille(liste: readonly unknown[] | undefined): number {
  return liste?.length ?? 0;
}

function lesAdditionsLesPlusLongues({ operations, generateur }: ExerciceAddition): readonly (readonly number[])[] {
  if (operations) return operations;
  if (!generateur) return [];
  return Array.from(
    { length: generateur.combien },
    () => Array.from({ length: generateur.nombres }, () => generateur.max),
  );
}

function questionsDUneAddition(nombres: readonly number[], etapes: ExerciceAddition["etapes"]): number {
  const addition = AdditionPosee.depuis(nombres);
  const chiffresPoses = etapes.includes("poser") ? addition.etapePoser().questions.length : 0;
  const colonnesCalculees = etapes.includes("calculer") ? addition.colonnes.length : 0;
  return chiffresPoses + colonnesCalculees;
}
