import { toutesLesMatieres } from "../../catalogue/domain/index.ts";
import {
  ENCOURAGEMENTS,
  FELICITATIONS_COMMUNES,
  presentation,
  presentationAuRetourDuSon,
  RELANCES,
  saluerSansPrenom,
} from "./paroles.ts";
import { saluerAvecLaSerieSansPrenom } from "./paroles-de-la-serie.ts";
import {
  feteDeLaQueteAccomplieSansPrenom,
  propositionDeLaQueteDuJour,
  reponseAuRefusDeLaQuete,
} from "./paroles-de-la-quete.ts";
import { accueillirSurLaPageDeLaLeconSansPrenom, finDeSeanceApres, INVITATIONS_A_JOUER } from "./paroles-de-seance.ts";
import { aiderQuandOnNeSaitPas } from "./paroles-du-calcul.ts";
import {
  CONSIGNE_DU_TEST_DE_DEPART,
  proposerLeTestDeDepartSansPrenom,
  remercierApresLeTestDeDepartSansPrenom,
} from "./paroles-du-test-de-depart.ts";
import { inviterAReleverLeGrandDefiSansPrenom, parolesDeFinDeGrandDefiSansPrenom } from "./paroles-du-defi.ts";
import { UNIVERS } from "./univers.ts";

const personnagesGuides = UNIVERS.map((univers) => univers.personnageGuide);

function parolesDesPersonnagesGuides(): string[] {
  return UNIVERS.flatMap((univers) => [
    ...univers.personnageGuide.expressions,
    presentation(univers),
    presentationAuRetourDuSon(univers.personnageGuide),
  ]);
}

function parolesDeFinDeSeanceConnues(): string[] {
  const felicitationsParEtoiles = (etoiles: number) =>
    etoiles === 3
      ? personnagesGuides.flatMap(({ expressions }) => expressions)
      : [...FELICITATIONS_COMMUNES, ...personnagesGuides.flatMap(({ expressions }) => expressions)];
  return [0, 1, 2, 3].flatMap((etoiles) =>
    felicitationsParEtoiles(etoiles).map((felicitation) => finDeSeanceApres(etoiles, felicitation))
  );
}

function parolesDuGrandDefi(): string[] {
  return toutesLesMatieres().flatMap(({ code }) => [
    inviterAReleverLeGrandDefiSansPrenom({ matiere: code }),
    parolesDeFinDeGrandDefiSansPrenom({ matiere: code, dejaReleve: false }),
    parolesDeFinDeGrandDefiSansPrenom({ matiere: code, dejaReleve: true }),
  ]);
}

function propositionDeLaQueteAccomplie(): string[] {
  return [propositionDeLaQueteDuJour({ genre: "accomplie", quete: "lecon" })].filter((parole) => parole !== undefined);
}

function parolesDuTestDeDepart(): string[] {
  return [
    proposerLeTestDeDepartSansPrenom(),
    CONSIGNE_DU_TEST_DE_DEPART,
    remercierApresLeTestDeDepartSansPrenom(0),
    remercierApresLeTestDeDepartSansPrenom(1),
  ];
}

function paroleDeJeNeSaisPasAvecLesChoix(): string {
  return aiderQuandOnNeSaitPas({ mode: { genre: "choix" } }, undefined, "").texte;
}

function parolesDeLaSerieEtDeLaQuete(): string[] {
  return [
    saluerAvecLaSerieSansPrenom({ nombreDeJours: 0, aJoueAujourdhui: false }),
    saluerAvecLaSerieSansPrenom({ nombreDeJours: 1, aJoueAujourdhui: true }),
    saluerAvecLaSerieSansPrenom({ nombreDeJours: 1, aJoueAujourdhui: false }),
    feteDeLaQueteAccomplieSansPrenom(),
    ...propositionDeLaQueteAccomplie(),
    reponseAuRefusDeLaQuete(),
  ];
}

export function parolesConnuesDAvance(): readonly string[] {
  return [
    ...new Set([
      ...FELICITATIONS_COMMUNES,
      ...ENCOURAGEMENTS,
      ...RELANCES,
      ...INVITATIONS_A_JOUER,
      saluerSansPrenom(),
      accueillirSurLaPageDeLaLeconSansPrenom(),
      ...parolesDesPersonnagesGuides(),
      ...parolesDeFinDeSeanceConnues(),
      ...parolesDuGrandDefi(),
      ...parolesDeLaSerieEtDeLaQuete(),
      ...parolesDuTestDeDepart(),
      paroleDeJeNeSaisPasAvecLesChoix(),
    ]),
  ];
}
