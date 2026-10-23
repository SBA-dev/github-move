import { type Exercice, type ExerciceGenerique, nombreDeTrous } from "../../catalogue/domain/index.ts";

const QUESTIONS_PAR_DEFAUT_D_UN_CALCUL = 5;
const OPERATIONS_PAR_DEFAUT_D_UNE_ADDITION = 3;
const ETAPES_PAR_DEFAUT_D_UNE_ADDITION = 2;
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
      return nombreDeTrous(exercice.texte ?? "");
    case "conjugaison":
      return taille(exercice.formes);
    case "dictee":
      return taille(exercice.mots);
    case "calcul":
      return exercice.operations?.length ?? combienDemande(exercice) ?? QUESTIONS_PAR_DEFAUT_D_UN_CALCUL;
    case "fluence":
      return 1;
    case "memoriser":
      return taille(exercice.vers) * QUESTIONS_PAR_VERS;
    case "addition":
      return nombreDOperationsPosees(exercice) * (exercice.etapes?.length ?? ETAPES_PAR_DEFAUT_D_UNE_ADDITION);
  }
}

function taille(liste: readonly unknown[] | undefined): number {
  return liste?.length ?? 0;
}

function combienDemande(exercice: ExerciceGenerique): number | undefined {
  const combien = exercice.generateur?.combien;
  return typeof combien === "number" ? combien : undefined;
}

function nombreDOperationsPosees(exercice: ExerciceGenerique): number {
  return exercice.operations?.length ?? combienDemande(exercice) ?? OPERATIONS_PAR_DEFAUT_D_UNE_ADDITION;
}
