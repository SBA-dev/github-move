export const EFFETS_SONORES = [
  "reponseJuste",
  "reponseFausse",
  "pointDuRecipient",
  "texteComplet",
  "seanceTerminee",
  "grandeVictoire",
  "decouverte",
  "boutonTouche",
] as const;

export type EffetSonore = typeof EFFETS_SONORES[number];
