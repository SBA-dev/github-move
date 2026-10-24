import { type Exercice, type ExerciceAddition } from "../../catalogue/domain/index.ts";

const QUESTIONS_PAR_DEFAUT_D_UN_CALCUL = 5;
const OPERATIONS_PAR_DEFAUT_D_UNE_ADDITION = 3;
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
      return nombreDOperationsPosees(exercice) * (exercice.etapes.length);
  }
}

function taille(liste: readonly unknown[] | undefined): number {
  return liste?.length ?? 0;
}

function nombreDOperationsPosees(exercice: ExerciceAddition): number {
  return exercice.operations?.length ?? exercice.generateur?.combien ?? OPERATIONS_PAR_DEFAUT_D_UNE_ADDITION;
}
