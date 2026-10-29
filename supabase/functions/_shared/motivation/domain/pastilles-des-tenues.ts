import { accorder } from "./accord.ts";
import { estRecue, type EtatDesTenues, PALIERS_DES_TENUES } from "./tenues.ts";

export type PastilleDesTenues = {
  readonly cle: string;
  readonly libelle: string;
  readonly libelleLu: string;
  readonly recue: boolean;
};

export function pastillesDesTenues(tenues: EtatDesTenues): readonly PastilleDesTenues[] {
  return PALIERS_DES_TENUES.map(({ seuil, tenue }) => {
    const recue = estRecue(tenues, tenue.cle);
    return {
      cle: tenue.cle,
      libelle: recue ? tenue.nom : `${seuil} ★`,
      libelleLu: recue ? tenue.nom : accorder(seuil, "étoile"),
      recue,
    };
  });
}
