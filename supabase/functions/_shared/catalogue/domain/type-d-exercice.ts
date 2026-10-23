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

export const TYPES_D_EXERCICE = Object.freeze(Object.keys(LIBELLES) as TypeDExercice[]);

export function estUnTypeDExercice(type: unknown): type is TypeDExercice {
  return typeof type === "string" && Object.hasOwn(LIBELLES, type);
}

export function libelleDuType(type: TypeDExercice): string {
  return LIBELLES[type];
}
