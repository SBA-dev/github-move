import type { ExerciceBarres, ExerciceBoite, ExerciceDictee, Niveau, Operation } from "../../catalogue/domain/index.ts";
import { MotAEcrire } from "./mot-a-ecrire.ts";
import { QuestionDeBoite } from "./question-de-boite.ts";
import { QuestionDeCalcul } from "./question-de-calcul.ts";
import { QuestionDeDictee } from "./question-de-dictee.ts";
import { QuestionDeProblemeEnBarres } from "./question-de-probleme-en-barres.ts";
import type { Tireur } from "./tireur.ts";

export function questionsDeCalcul(
  operations: readonly Operation[],
  tireur: Tireur,
  niveau: Niveau,
): QuestionDeCalcul[] {
  return operations.map((operation) => QuestionDeCalcul.pour(operation, tireur, niveau));
}

export function questionsDeBoite(exercice: ExerciceBoite, tireur: Tireur, niveau: Niveau): QuestionDeBoite[] {
  return exercice.items.map((item) => QuestionDeBoite.pour(item, tireur, niveau));
}

export function questionsDeProblemesEnBarres(
  exercice: ExerciceBarres,
  tireur: Tireur,
  niveau: Niveau,
): QuestionDeProblemeEnBarres[] {
  return exercice.items.map((probleme) => QuestionDeProblemeEnBarres.pour(probleme, tireur, niveau));
}

export function questionsDeDictee(exercice: ExerciceDictee, tireur: Tireur): QuestionDeDictee[] {
  return exercice.mots.map((mot) =>
    new QuestionDeDictee(mot, exercice.consigne, tireur.clavier(MotAEcrire.de(mot.mot)))
  );
}
