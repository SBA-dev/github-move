import type { Niveau } from "../../catalogue/domain/index.ts";

export type ModeDeReponse = { genre: "choix" } | { genre: "clavierDeCristaux" };

export const ModeDeReponse = {
  pour(niveau: Niveau): ModeDeReponse {
    return niveau.valeur === "CP" ? { genre: "choix" } : { genre: "clavierDeCristaux" };
  },
};

export function choixAutourDuResultat(resultat: number, dernierChoix = resultat + 2): number[] {
  const candidats = [resultat, resultat + 1, Math.max(0, resultat - 1), dernierChoix];
  return [...new Set(candidats)];
}
