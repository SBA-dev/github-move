import { LeconMalFormee } from "./erreurs.ts";
import { enObjet, type Objet, texteFacultatif } from "./lecture.ts";
import { type ExerciceAddition, lireAddition } from "./exercices/addition.ts";
import { type ExerciceBarres, lireBarres } from "./exercices/barres.ts";
import { type ExerciceBoite, lireBoite } from "./exercices/boite.ts";
import { type ExerciceBulles, lireBulles } from "./exercices/bulles.ts";
import { type ExerciceCalcul, lireCalcul } from "./exercices/calcul.ts";
import { type ExerciceClasser, lireClasser } from "./exercices/classer.ts";
import { type ExerciceConjugaison, lireConjugaison } from "./exercices/conjugaison.ts";
import { type ExerciceDictee, lireDictee } from "./exercices/dictee.ts";
import { type ExerciceFluence, lireFluence } from "./exercices/fluence.ts";
import { type ExerciceEcoute, lireEcoute } from "./exercices/ecoute.ts";
import { type ExerciceLecture, lireExerciceDeLecture } from "./exercices/lecture.ts";
import { type ExerciceMemoriser, lireMemoriser } from "./exercices/memoriser.ts";
import { type ExerciceOrdre, lireOrdre } from "./exercices/ordre.ts";
import { type ExerciceTrous, lireTrous } from "./exercices/texte-a-trous.ts";
import { estUnTypeDExercice, type TypeDExercice } from "./type-d-exercice.ts";

export type Exercice =
  | ExerciceBulles
  | ExerciceLecture
  | ExerciceEcoute
  | ExerciceClasser
  | ExerciceOrdre
  | ExerciceTrous
  | ExerciceDictee
  | ExerciceConjugaison
  | ExerciceCalcul
  | ExerciceFluence
  | ExerciceAddition
  | ExerciceBoite
  | ExerciceBarres
  | ExerciceMemoriser;

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
    case "calcul":
      return lireCalcul(brut, communs);
    case "fluence":
      return lireFluence(brut, communs);
    case "addition":
      return lireAddition(brut, communs);
    case "boite":
      return lireBoite(brut, communs);
    case "barres":
      return lireBarres(brut, communs);
    case "memoriser":
      return lireMemoriser(brut, communs);
  }
}
