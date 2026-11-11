import { toutesLesMatieres } from "../../catalogue/domain/index.ts";
import {
  accueillirSurLaPageDeLaLecon,
  ANNONCES_D_EXERCICE,
  INVITATIONS_A_JOUER,
  parolesDeFinDeSeance,
} from "./paroles-de-seance.ts";
import { feteDeLaQueteAccomplie } from "./paroles-de-la-quete.ts";
import { inviterAReleverLeGrandDefi } from "./paroles-du-defi.ts";
import { sansLePrenom } from "./texte-enregistre-de-remplacement.ts";
import {
  ENCOURAGEMENTS,
  FELICITATIONS_COMMUNES,
  presentation,
  presentationAuRetourDuSon,
  RELANCES,
  saluer,
} from "./paroles.ts";
import { UNIVERS } from "./univers.ts";

const PRENOM_MARQUEUR = "Prénom";

function parolesAvecPrenomSansLePrenom(): string[] {
  const sansPrenom = (parole: string) => sansLePrenom(parole, PRENOM_MARQUEUR);
  return [
    saluer(PRENOM_MARQUEUR),
    accueillirSurLaPageDeLaLecon(PRENOM_MARQUEUR),
    feteDeLaQueteAccomplie(PRENOM_MARQUEUR),
    ...toutesLesMatieres().map(({ code }) => inviterAReleverLeGrandDefi({ prenom: PRENOM_MARQUEUR, matiere: code })),
    ...UNIVERS.flatMap(({ personnageGuide }) =>
      personnageGuide.expressions.map((_, i) =>
        parolesDeFinDeSeance(3, PRENOM_MARQUEUR, personnageGuide, {
          entre0et1: () => i / personnageGuide.expressions.length,
        })
      )
    ),
  ].map(sansPrenom);
}

export function parolesFixes(): readonly string[] {
  const paroles = [
    ...FELICITATIONS_COMMUNES,
    ...ENCOURAGEMENTS,
    ...RELANCES,
    ...INVITATIONS_A_JOUER,
    ...ANNONCES_D_EXERCICE,
    ...parolesAvecPrenomSansLePrenom(),
    ...UNIVERS.flatMap((univers) => [
      ...univers.personnageGuide.expressions,
      presentation(univers),
      presentationAuRetourDuSon(univers.personnageGuide),
    ]),
  ];
  return [...new Set(paroles)];
}
