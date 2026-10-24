import { LeconMalFormee } from "./erreurs.ts";
import { enObjet, listeFacultative, nombreFacultatif, type Objet, texteFacultatif } from "./lecture.ts";
import { type ExerciceBulles, lireBulles } from "./exercices/bulles.ts";
import { type ExerciceClasser, lireClasser } from "./exercices/classer.ts";
import { type ExerciceConjugaison, lireConjugaison } from "./exercices/conjugaison.ts";
import { type ExerciceDictee, lireDictee } from "./exercices/dictee.ts";
import { type ExerciceEcoute, lireEcoute } from "./exercices/ecoute.ts";
import { type ExerciceLecture, lireExerciceDeLecture } from "./exercices/lecture.ts";
import { type ExerciceOrdre, lireOrdre } from "./exercices/ordre.ts";
import { type ExerciceTrous, lireTrous } from "./exercices/texte-a-trous.ts";
import { estUnTypeDExercice, type TypeDExercice } from "./type-d-exercice.ts";

type TypeSpecifique = "bulles" | "lecture" | "ecoute" | "classer" | "ordre" | "trous" | "dictee" | "conjugaison";
type TypeGenerique = Exclude<TypeDExercice, TypeSpecifique>;

export type Exercice =
  | ExerciceBulles
  | ExerciceLecture
  | ExerciceEcoute
  | ExerciceClasser
  | ExerciceOrdre
  | ExerciceTrous
  | ExerciceDictee
  | ExerciceConjugaison
  | ExerciceGenerique;

export type ExerciceGenerique = Readonly<{
  type: TypeGenerique;
  titre?: string;
  consigne?: string;
  auteur?: string;
  duree?: number;
  questions?: readonly unknown[];
  items?: readonly unknown[];
  vers?: readonly unknown[];
  operations?: readonly unknown[];
  etapes?: readonly unknown[];
  generateur?: Readonly<Record<string, unknown>>;
}>;

type Donnee = Exclude<keyof ExerciceGenerique, "type">;

const DONNEES_REQUISES: Record<TypeGenerique, readonly Donnee[]> = {
  memoriser: ["vers"],
  addition: [],
  calcul: [],
  fluence: [],
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
    case "dictee":
      return lireDictee(brut, communs);
    case "conjugaison":
      return lireConjugaison(brut, communs);
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
    duree: nombreFacultatif(brut.duree, "la durée d'un exercice"),
    questions: listeFacultative(brut.questions, "les questions"),
    items: listeFacultative(brut.items, "les items"),
    vers: listeFacultative(brut.vers, "les vers"),
    operations: listeFacultative(brut.operations, "les opérations"),
    etapes: listeFacultative(brut.etapes, "les étapes d'un exercice"),
    generateur: brut.generateur === undefined ? undefined : enObjet(brut.generateur, "le générateur"),
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
    case "vers":
    case "operations":
    case "etapes":
      return exercice[donnee] ?? [];
    default:
      return [];
  }
}

function aDesQuestions(exercice: ExerciceGenerique): boolean {
  switch (exercice.type) {
    case "fluence":
    case "calcul":
    case "addition":
      return true;
    default:
      return DONNEES_REQUISES[exercice.type].every((donnee) => listeDe(exercice, donnee).length > 0);
  }
}
