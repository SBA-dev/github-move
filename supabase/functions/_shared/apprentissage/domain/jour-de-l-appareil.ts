import { JourIncoherent } from "./erreurs.ts";
import { Jour, jourDe } from "./jour.ts";

const DECALAGE_UTC_MAXIMAL_A_L_OUEST_EN_MINUTES = 12 * 60;
const DECALAGE_UTC_MAXIMAL_A_L_EST_EN_MINUTES = -14 * 60;

/** Le jour du calendrier de l'appareil, accepté s'il est possible pour un appareil situé entre UTC-12 et UTC+14. */
export function jourDeLAppareil(texte: string, termineeLe: Date): Jour {
  const jour = Jour.de(texte);
  const lePlusTot = jourDe(termineeLe, DECALAGE_UTC_MAXIMAL_A_L_OUEST_EN_MINUTES);
  const lePlusTard = jourDe(termineeLe, DECALAGE_UTC_MAXIMAL_A_L_EST_EN_MINUTES);
  if (!lePlusTot.estAvantOuEgal(jour) || !jour.estAvantOuEgal(lePlusTard)) throw new JourIncoherent(jour.toString());
  return jour;
}
