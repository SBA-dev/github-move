import { type EtatDeLaCabane, PALIERS_DE_LA_CABANE } from "./cabane.ts";
import { libelleDuPalier, libelleLuDuPalier } from "./paroles-de-la-cabane.ts";

export type PastilleDeLaCabane = {
  readonly cle: string;
  readonly libelle: string;
  readonly libelleLu: string;
  readonly atteint: boolean;
};

export function pastillesDeLaCabane({ total }: EtatDeLaCabane): readonly PastilleDeLaCabane[] {
  return PALIERS_DE_LA_CABANE.map((palier) => {
    const atteint = palier.seuil <= total;
    return {
      cle: palier.objet.cle,
      libelle: libelleDuPalier(palier, atteint),
      libelleLu: libelleLuDuPalier(palier, atteint),
      atteint,
    };
  });
}
