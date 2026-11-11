import { ANNONCES_D_EXERCICE, INVITATIONS_A_JOUER } from "./paroles-de-seance.ts";
import {
  ENCOURAGEMENTS,
  FELICITATIONS_COMMUNES,
  presentation,
  presentationAuRetourDuSon,
  RELANCES,
} from "./paroles.ts";
import { UNIVERS } from "./univers.ts";

export function parolesFixes(): readonly string[] {
  const paroles = [
    ...FELICITATIONS_COMMUNES,
    ...ENCOURAGEMENTS,
    ...RELANCES,
    ...INVITATIONS_A_JOUER,
    ...ANNONCES_D_EXERCICE,
    ...UNIVERS.flatMap((univers) => [
      ...univers.personnageGuide.expressions,
      presentation(univers),
      presentationAuRetourDuSon(univers.personnageGuide),
    ]),
  ];
  return [...new Set(paroles)];
}
