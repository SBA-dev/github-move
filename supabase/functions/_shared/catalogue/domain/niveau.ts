import { NiveauInconnu } from "./erreurs.ts";

export const NIVEAUX = ["CP", "CE1", "CE2", "CM1", "CM2"] as const;

export type Niveau = typeof NIVEAUX[number];

export function niveau(valeur: unknown): Niveau {
  const trouve = NIVEAUX.find((candidat) => candidat === valeur);
  if (trouve === undefined) throw new NiveauInconnu();
  return trouve;
}
