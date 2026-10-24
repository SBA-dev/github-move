import type { Niveau } from "../../catalogue/domain/index.ts";

const PLUS_GRANDE_REPONSE_A_CHOIX_AU_CP = 20;

export type ModeDeReponse = { genre: "choix" } | { genre: "clavierDeCristaux" };

export const ModeDeReponse = {
  pour(niveau: Niveau, reponse?: number): ModeDeReponse {
    const reponseAChoix = reponse === undefined || reponse <= PLUS_GRANDE_REPONSE_A_CHOIX_AU_CP;
    const parChoix = niveau.valeur === "CP" && reponseAChoix;
    return parChoix ? { genre: "choix" } : { genre: "clavierDeCristaux" };
  },
};

export function choixAutourDuResultat(resultat: number, dernierChoix = resultat + 2): number[] {
  const candidats = [resultat, resultat + 1, Math.max(0, resultat - 1), dernierChoix];
  return [...new Set(candidats)];
}
