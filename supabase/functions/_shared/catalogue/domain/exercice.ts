import { LeconMalFormee } from "./erreurs.ts";
import { enObjet, listeFacultative, nombreFacultatif, type Objet, texteFacultatif } from "./lecture.ts";
import { nombreDeTrous } from "./trous.ts";
import { type ExerciceBulles, lireBulles } from "./exercices/bulles.ts";
import { type ExerciceEcoute, lireEcoute } from "./exercices/ecoute.ts";
import { type ExerciceLecture, lireExerciceDeLecture } from "./exercices/lecture.ts";
import { estUnTypeDExercice, type TypeDExercice } from "./type-d-exercice.ts";

type TypeAChoix = "bulles" | "lecture" | "ecoute";
type TypeGenerique = Exclude<TypeDExercice, TypeAChoix>;

export type Exercice = ExerciceBulles | ExerciceLecture | ExerciceEcoute | ExerciceGenerique;

export type ExerciceGenerique = Readonly<{
  type: TypeGenerique;
  titre?: string;
  consigne?: string;
  auteur?: string;
  texte?: string;
  verbe?: string;
  temps?: string;
  duree?: number;
  questions?: readonly unknown[];
  items?: readonly unknown[];
  groupes?: readonly unknown[];
  mots?: readonly unknown[];
  elements?: readonly unknown[];
  distracteurs?: readonly unknown[];
  formes?: readonly unknown[];
  vers?: readonly unknown[];
  operations?: readonly unknown[];
  etapes?: readonly unknown[];
  generateur?: Readonly<Record<string, unknown>>;
}>;

type Donnee = Exclude<keyof ExerciceGenerique, "type">;

const DONNEES_REQUISES: Record<TypeGenerique, readonly Donnee[]> = {
  classer: ["items"],
  dictee: ["mots"],
  ordre: ["elements"],
  trous: ["texte"],
  conjugaison: ["formes"],
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
    texte: texteFacultatif(brut.texte, "le texte d'un exercice"),
    verbe: texteFacultatif(brut.verbe, "le verbe d'un exercice"),
    temps: texteFacultatif(brut.temps, "le temps d'un exercice"),
    duree: nombreFacultatif(brut.duree, "la durée d'un exercice"),
    questions: listeFacultative(brut.questions, "les questions"),
    items: listeFacultative(brut.items, "les items"),
    groupes: listeFacultative(brut.groupes, "les groupes"),
    mots: listeFacultative(brut.mots, "les mots"),
    elements: listeFacultative(brut.elements, "les éléments"),
    distracteurs: listeFacultative(brut.distracteurs, "les distracteurs"),
    formes: listeFacultative(brut.formes, "les formes"),
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
    case "groupes":
    case "mots":
    case "elements":
    case "distracteurs":
    case "formes":
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
    case "trous":
      return nombreDeTrous(exercice.texte ?? "") > 0;
    case "fluence":
    case "calcul":
    case "addition":
      return true;
    default:
      return DONNEES_REQUISES[exercice.type].every((donnee) => listeDe(exercice, donnee).length > 0);
  }
}
