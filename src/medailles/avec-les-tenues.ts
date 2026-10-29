import { type EtatDeLaCabane, phraseDeLEtat } from "@domain/motivation";

const APRES_LE_GUIDE_ET_LE_NOM_DE_L_ECRAN = 2;

/** Glisse la lecture de la section des tenues juste après celle de la cabane, comme à l'écran. */
export function avecLesTenues(
  paroles: readonly string[],
  cabane: EtatDeLaCabane | undefined,
  parolesDesTenues: readonly string[],
): readonly string[] {
  const apres = cabane === undefined ? APRES_LE_GUIDE_ET_LE_NOM_DE_L_ECRAN : paroles.indexOf(phraseDeLEtat(cabane)) + 1;
  return [...paroles.slice(0, apres), ...parolesDesTenues, ...paroles.slice(apres)];
}
