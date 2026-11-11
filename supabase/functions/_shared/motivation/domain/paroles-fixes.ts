import { toutesLesMatieres } from "../../catalogue/domain/index.ts";
import {
  accueillirSurLaPageDeLaLecon,
  ANNONCES_D_EXERCICE,
  INVITATIONS_A_JOUER,
  parolesDeFinDeSeance,
} from "./paroles-de-seance.ts";
import { feteDeLaQueteAccomplie, propositionDeLaQueteDuJour, reponseAuRefusDeLaQuete } from "./paroles-de-la-quete.ts";
import { saluerAvecLaSerie } from "./paroles-de-la-serie.ts";
import { accueillirEnRevision, parolesDeFinDeRevision } from "./paroles-de-revision.ts";
import { parolesDeFinDeFluence, SIGNAL_DE_DEPART } from "./paroles-de-fluence.ts";
import {
  NOM_DE_L_ECRAN_DES_MEDAILLES,
  parolesDeLaSectionDesBadgesOuSansBadge,
  parolesDuGuideALOuverture,
  TITRE_DES_DEFIS_RELEVES,
  TITRE_DES_RECORDS_DE_CALCUL_RAPIDE,
} from "./paroles-de-l-ecran-des-medailles.ts";
import { parolesDeLaSectionDeLHistoire, texteALireDeLEpisode } from "./paroles-de-l-histoire.ts";
import { titreDeLaSection } from "./paroles-de-la-cabane.ts";
import { HISTOIRE_DES_SAVANTURIERS } from "./histoire.ts";
import { inviterAReleverLeGrandDefi, parolesDeDebutDeGrandDefi, parolesDeFinDeGrandDefi } from "./paroles-du-defi.ts";
import type { Hasard } from "./hasard.ts";
import { sansLePrenom } from "./texte-enregistre-de-remplacement.ts";
import {
  direJeNeSaisPasAvecLesChoix,
  direJeNeSaisPasEnDictee,
  direLeTexteComplet,
  ENCOURAGEMENTS,
  FELICITATIONS_COMMUNES,
  inviterACreerLePremierProfil,
  presentation,
  presentationAuRetourDuSon,
  RELANCES,
  saluer,
} from "./paroles.ts";
import { UNIVERS } from "./univers.ts";

const PRENOM_MARQUEUR = "Prénom";

const sansPrenom = (parole: string) => sansLePrenom(parole, PRENOM_MARQUEUR);

function hasardEnDeuxTirages(premier: number, second: number): Hasard {
  const tirages = [premier, second];
  return { entre0et1: () => tirages.shift() ?? 0 };
}

function parolesAvecPrenomSansLePrenom(): string[] {
  return [
    saluer(PRENOM_MARQUEUR),
    accueillirSurLaPageDeLaLecon(PRENOM_MARQUEUR),
    feteDeLaQueteAccomplie(PRENOM_MARQUEUR),
    ...[
      { nombreDeJours: 0, aJoueAujourdhui: false },
      { nombreDeJours: 1, aJoueAujourdhui: true },
      { nombreDeJours: 1, aJoueAujourdhui: false },
    ].map((serie) => saluerAvecLaSerie(PRENOM_MARQUEUR, serie)),
    parolesDeFinDeRevision({ prenom: PRENOM_MARQUEUR, questionsJustes: 0 }),
    ...toutesLesMatieres().flatMap(({ code }) =>
      [false, true].map((dejaReleve) => parolesDeFinDeGrandDefi({ prenom: PRENOM_MARQUEUR, matiere: code, dejaReleve }))
    ),
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

function parolesDeLaQuete(): string[] {
  return [reponseAuRefusDeLaQuete(), propositionDeLaQueteDuJour({ genre: "accomplie", quete: "lecon" }) ?? ""];
}

function parolesDeLEcranDesMedailles(): string[] {
  const sansRien = { pastilles: [], cabane: undefined };
  const avecUnEpisode = {
    ...sansRien,
    histoire: { nombreDEpisodesOuverts: 1, episodesOuverts: [HISTOIRE_DES_SAVANTURIERS[0]!], complete: false },
  };
  return [
    parolesDuGuideALOuverture(sansRien),
    parolesDuGuideALOuverture(avecUnEpisode),
    NOM_DE_L_ECRAN_DES_MEDAILLES,
    TITRE_DES_RECORDS_DE_CALCUL_RAPIDE,
    TITRE_DES_DEFIS_RELEVES,
    titreDeLaSection(),
    ...parolesDeLaSectionDeLHistoire(),
    ...parolesDeLaSectionDesBadgesOuSansBadge([]),
    ...HISTOIRE_DES_SAVANTURIERS.map(texteALireDeLEpisode),
  ];
}

function parolesDuGrandDefi(): string[] {
  return toutesLesMatieres().map(({ code }) => parolesDeDebutDeGrandDefi({ matiere: code }));
}

function annoncesDuTexteComplet(): string[] {
  const communes = FELICITATIONS_COMMUNES.map((_, i) =>
    direLeTexteComplet(UNIVERS[0]!.personnageGuide, hasardEnDeuxTirages(0.99, i / FELICITATIONS_COMMUNES.length))
  );
  const duPersonnageGuide = UNIVERS.flatMap(({ personnageGuide }) =>
    personnageGuide.expressions.map((_, i) =>
      direLeTexteComplet(personnageGuide, hasardEnDeuxTirages(0, i / personnageGuide.expressions.length))
    )
  );
  return [...communes, ...duPersonnageGuide];
}

function parolesDeLaFluenceEtDeLaRevision(): string[] {
  return [accueillirEnRevision(), SIGNAL_DE_DEPART, parolesDeFinDeFluence({ score: 0, issue: "aucunRecord" })];
}

function parolesDeLaDicteeEtDesChoix(): string[] {
  return [
    direJeNeSaisPasEnDictee("briller"),
    direJeNeSaisPasEnDictee("ecrire"),
    direJeNeSaisPasAvecLesChoix(undefined),
  ];
}

export function parolesFixes(): readonly string[] {
  const paroles = [
    ...FELICITATIONS_COMMUNES,
    ...ENCOURAGEMENTS,
    ...RELANCES,
    ...INVITATIONS_A_JOUER,
    ...ANNONCES_D_EXERCICE,
    ...parolesAvecPrenomSansLePrenom(),
    ...parolesDeLaQuete(),
    ...parolesDeLaFluenceEtDeLaRevision(),
    ...parolesDeLEcranDesMedailles(),
    ...parolesDuGrandDefi(),
    inviterACreerLePremierProfil(),
    ...annoncesDuTexteComplet(),
    ...parolesDeLaDicteeEtDesChoix(),
    ...UNIVERS.flatMap((univers) => [
      ...univers.personnageGuide.expressions,
      presentation(univers),
      presentationAuRetourDuSon(univers.personnageGuide),
    ]),
  ];
  return [...new Set(paroles)];
}
