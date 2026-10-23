import { LeconMalFormee } from "./erreurs.ts";
import { enObjet, listeFacultative, nombreFacultatif, type Objet, texteFacultatif, texteRequis } from "./lecture.ts";
import { nombreDeTrous } from "./trous.ts";
import { estUnTypeDExercice, type TypeDExercice } from "./type-d-exercice.ts";

export type Exercice = Readonly<{
  type: TypeDExercice;
  titre?: string;
  consigne?: string;
  auteur?: string;
  texte?: string;
  verbe?: string;
  temps?: string;
  langue?: string;
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

type Donnee = Exclude<keyof Exercice, "type">;

const DONNEES_REQUISES: Record<TypeDExercice, readonly Donnee[]> = {
  bulles: ["questions"],
  classer: ["items"],
  dictee: ["mots"],
  ordre: ["elements"],
  trous: ["texte"],
  conjugaison: ["formes"],
  lecture: ["questions"],
  memoriser: ["vers"],
  addition: [],
  calcul: [],
  fluence: [],
  ecoute: ["items"],
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
  const exercice: Exercice = Object.freeze({
    type,
    titre: texteFacultatif(brut.titre, "le titre d'un exercice"),
    consigne: texteFacultatif(brut.consigne, "la consigne d'un exercice"),
    auteur: texteFacultatif(brut.auteur, "l'auteur d'un exercice"),
    texte: texteFacultatif(brut.texte, "le texte d'un exercice"),
    verbe: texteFacultatif(brut.verbe, "le verbe d'un exercice"),
    temps: texteFacultatif(brut.temps, "le temps d'un exercice"),
    langue: texteFacultatif(brut.langue, "la langue d'un exercice"),
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
  if (type === "bulles" || type === "lecture") exercice.questions?.forEach(lireEnonce);
  return exercice;
}

function aDesQuestions(exercice: Exercice): boolean {
  switch (exercice.type) {
    case "trous":
      return nombreDeTrous(exercice.texte ?? "") > 0;
    case "fluence":
    case "calcul":
    case "addition":
      return true;
    default:
      return DONNEES_REQUISES[exercice.type].every((donnee) =>
        ((exercice[donnee] as readonly unknown[]) ?? []).length > 0
      );
  }
}

function lireEnonce(question: unknown): void {
  texteRequis(enObjet(question, "une question").question, "l'énoncé d'une question");
}
