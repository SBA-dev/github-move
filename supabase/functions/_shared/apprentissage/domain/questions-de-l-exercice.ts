import type {
  ExerciceBarres,
  ExerciceBoite,
  ExerciceClasser,
  ExerciceConjugaison,
  ExerciceDictee,
  FormeConjuguee,
  MotDicte,
  Niveau,
  Operation,
} from "../../catalogue/domain/index.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { GroupeInconnu } from "./erreurs.ts";
import { sansDoublonsNiReponse } from "./exercices/trous.ts";
import { MotAEcrire } from "./mot-a-ecrire.ts";
import { QuestionDeBoite } from "./question-de-boite.ts";
import { QuestionDeCalcul } from "./question-de-calcul.ts";
import { QuestionDeDictee } from "./question-de-dictee.ts";
import { QuestionDeProblemeEnBarres } from "./question-de-probleme-en-barres.ts";
import { QuestionJouee } from "./question-jouee.ts";
import { type Addition, enonceDUneAddition } from "./tirage-d-additions.ts";
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

export function questionDeDictee(exercice: ExerciceDictee, mot: MotDicte, tireur: Tireur): QuestionDeDictee {
  return new QuestionDeDictee(mot, exercice.consigne, tireur.clavier(MotAEcrire.de(mot.mot)));
}

export function questionsDeDictee(exercice: ExerciceDictee, tireur: Tireur): QuestionDeDictee[] {
  return exercice.mots.map((mot) => questionDeDictee(exercice, mot, tireur));
}

export function questionDeClassement(
  exercice: ExerciceClasser,
  { texte, groupe }: ExerciceClasser["items"][number],
  tireur: Tireur,
): QuestionJouee {
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

export function questionDeConjugaison(
  exercice: ExerciceConjugaison,
  { pronom, forme }: FormeConjuguee,
  tireur: Tireur,
): QuestionJouee {
  return QuestionJouee.aChoix({
    cle: CleDeQuestion.de("conjugaison", `${exercice.verbe} · ${exercice.temps} · ${pronom}`),
    enonce: `Le verbe ${exercice.verbe} au ${exercice.temps} : ${pronom} …`,
    choix: tireur.trou(forme, sansDoublonsNiReponse(exercice.formes.map((f) => f.forme), forme)),
    bonneReponse: forme,
    type: "conjugaison",
  });
}

export function questionDeCalculEnLigne(addition: Addition, tireur: Tireur, niveau: Niveau): QuestionDeCalcul {
  const somme = addition.reduce((total, nombre) => total + nombre, 0);
  return QuestionDeCalcul.pour({ q: enonceDUneAddition(addition), r: somme }, tireur, niveau);
}
