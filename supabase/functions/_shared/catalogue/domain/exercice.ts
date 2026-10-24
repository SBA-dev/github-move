import { LeconMalFormee } from "./erreurs.ts";
import { enObjet, listeFacultative, type Objet, texteFacultatif } from "./lecture.ts";
import { type ExerciceAddition, lireAddition } from "./exercices/addition.ts";
import { type ExerciceBulles, lireBulles } from "./exercices/bulles.ts";
import { type ExerciceCalcul, lireCalcul } from "./exercices/calcul.ts";
import { type ExerciceClasser, lireClasser } from "./exercices/classer.ts";
import { type ExerciceFluence, lireFluence } from "./exercices/fluence.ts";
import { type ExerciceEcoute, lireEcoute } from "./exercices/ecoute.ts";
import { type ExerciceLecture, lireExerciceDeLecture } from "./exercices/lecture.ts";
import { type ExerciceOrdre, lireOrdre } from "./exercices/ordre.ts";
import { type ExerciceTrous, lireTrous } from "./exercices/texte-a-trous.ts";
import { estUnTypeDExercice, type TypeDExercice } from "./type-d-exercice.ts";

type TypeSpecifique =
  | "bulles"
  | "lecture"
  | "ecoute"
  | "classer"
  | "ordre"
  | "trous"
  | "calcul"
  | "fluence"
  | "addition";
type TypeGenerique = Exclude<TypeDExercice, TypeSpecifique>;

export type Exercice =
  | ExerciceBulles
  | ExerciceLecture
  | ExerciceEcoute
  | ExerciceClasser
  | ExerciceOrdre
  | ExerciceTrous
  | ExerciceCalcul
  | ExerciceFluence
  | ExerciceAddition
  | ExerciceGenerique;

export type ExerciceGenerique = Readonly<{
  type: TypeGenerique;
  titre?: string;
  consigne?: string;
  auteur?: string;
  verbe?: string;
  temps?: string;
  questions?: readonly unknown[];
  items?: readonly unknown[];
  mots?: readonly unknown[];
  formes?: readonly unknown[];
  vers?: readonly unknown[];
}>;

type Donnee = Exclude<keyof ExerciceGenerique, "type">;

const DONNEES_REQUISES: Record<TypeGenerique, readonly Donnee[]> = {
  dictee: ["mots"],
  conjugaison: ["formes"],
  memoriser: ["vers"],
  boite: ["items"],
  barres: ["items"],
};

export function lireExercices(brut: readonly unknown[]): readonly Exercice[] {
  const exercices = brut
    .map((exercice) => enObjet(exercice, "un exercice"))
    .flatMap((exercice) => {
      const type = exercice.type;
      if (typeof type !== "string") throw new LeconMalFormee("un exercice n'a pas de type");
      return estUnTypeDExercice(type) ? [lireExercice(exercice, type)] : [];
    });
  return Object.freeze(exercices);
}

function lireExercice(brut: Objet, type: TypeDExercice): Exercice {
  const communs = {
    titre: texteFacultatif(brut.titre, "le titre d'un exercice"),
    consigne: texteFacultatif(brut.consigne, "la consigne d'un exercice"),
  };
  switch (type) {
    case "bulles":
      return lireBulles(brut, communs);
    case "lecture":
      return lireExerciceDeLecture(brut, communs);
    case "ecoute":
      return lireEcoute(brut, communs);
    case "classer":
      return lireClasser(brut, communs);
    case "ordre":
      return lireOrdre(brut, communs);
    case "trous":
      return lireTrous(brut, communs);
    case "calcul":
      return lireCalcul(brut, communs);
    case "fluence":
      return lireFluence(brut, communs);
    case "addition":
      return lireAddition(brut, communs);
    default:
      return lireExerciceGenerique(brut, type, communs);
  }
}

function lireExerciceGenerique(
  brut: Objet,
  type: TypeGenerique,
  communs: { titre?: string; consigne?: string },
): ExerciceGenerique {
  const exercice: ExerciceGenerique = Object.freeze({
    type,
    ...communs,
    auteur: texteFacultatif(brut.auteur, "l'auteur d'un exercice"),
    verbe: texteFacultatif(brut.verbe, "le verbe d'un exercice"),
    temps: texteFacultatif(brut.temps, "le temps d'un exercice"),
    questions: listeFacultative(brut.questions, "les questions"),
    items: listeFacultative(brut.items, "les items"),
    mots: listeFacultative(brut.mots, "les mots"),
    formes: listeFacultative(brut.formes, "les formes"),
    vers: listeFacultative(brut.vers, "les vers"),
  });
  for (const donnee of DONNEES_REQUISES[type]) {
    if (exercice[donnee] === undefined) throw new LeconMalFormee(`l'exercice « ${type} » n'a pas de ${donnee}`);
  }
  if (!aDesQuestions(exercice)) throw new LeconMalFormee(`l'exercice « ${type} » n'a aucune question à poser`);
  return exercice;
}

function listeDe(exercice: ExerciceGenerique, donnee: Donnee): readonly unknown[] {
  switch (donnee) {
    case "questions":
    case "items":
    case "mots":
    case "formes":
    case "vers":
      return exercice[donnee] ?? [];
    default:
      return [];
  }
}

function aDesQuestions(exercice: ExerciceGenerique): boolean {
  return DONNEES_REQUISES[exercice.type].every((donnee) => listeDe(exercice, donnee).length > 0);
}
