import { TypeDExerciceInconnu } from "./erreurs.ts";

const LIBELLES = {
  bulles: "Bulles-réponses",
  classer: "Ranger dans les maisons",
  dictee: "Dictée",
  ordre: "Remettre dans l'ordre",
  trous: "Texte à trous",
  conjugaison: "Conjugaison",
  lecture: "Écouter et comprendre",
  memoriser: "Apprendre par cœur",
  addition: "Addition posée",
  calcul: "Calcul",
  fluence: "Calcul rapide",
  ecoute: "Écouter (langue)",
  boite: "La boîte à jetons",
  barres: "Problème en schéma",
} as const;

export type TypeDExercice = keyof typeof LIBELLES;

export const TYPES_D_EXERCICE = Object.keys(LIBELLES) as ReadonlyArray<TypeDExercice>;

export function estUnTypeDExercice(valeur: unknown): valeur is TypeDExercice {
  return typeof valeur === "string" && Object.hasOwn(LIBELLES, valeur);
}

export function typeDExercice(valeur: unknown): TypeDExercice {
  if (!estUnTypeDExercice(valeur)) throw new TypeDExerciceInconnu();
  return valeur;
}

export function libelleDuType(type: TypeDExercice): string {
  return LIBELLES[type];
}
