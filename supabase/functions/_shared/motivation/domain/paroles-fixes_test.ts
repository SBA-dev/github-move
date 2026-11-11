import { assert, assertEquals } from "@std/assert";
import { toutesLesMatieres } from "../../catalogue/domain/index.ts";
import { parolesFixes } from "./paroles-fixes.ts";
import {
  accueillirSurLaPageDeLaLecon,
  ANNONCES_D_EXERCICE,
  INVITATIONS_A_JOUER,
  parolesDeFinDeSeance,
} from "./paroles-de-seance.ts";
import { feteDeLaQueteAccomplie, propositionDeLaQueteDuJour, reponseAuRefusDeLaQuete } from "./paroles-de-la-quete.ts";
import { saluerAvecLaSerie } from "./paroles-de-la-serie.ts";
import { accueillirEnRevision, annonceDeLaSeanceDeRevision, parolesDeFinDeRevision } from "./paroles-de-revision.ts";
import { accueilDeLaFluence, parolesDeFinDeFluence, SIGNAL_DE_DEPART } from "./paroles-de-fluence.ts";
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
import {
  annonceDuDefiOuvert,
  inviterARelever,
  inviterAReleverLeGrandDefi,
  nomDuDefi,
  parolesDeDebutDeDefi,
  parolesDeDebutDeGrandDefi,
  parolesDeFinDeDefi,
  parolesDeFinDeGrandDefi,
} from "./paroles-du-defi.ts";
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
import type { Hasard } from "./hasard.ts";
import { UNIVERS } from "./univers.ts";

const PRENOM = "Zéphyrine";

function hasardDans(...tirages: number[]): Hasard {
  const restants = [...tirages];
  return { entre0et1: () => restants.shift() ?? 0 };
}

function contientToutes(attendues: readonly string[]) {
  const paroles = parolesFixes();
  for (const attendue of attendues) assert(paroles.includes(attendue), attendue);
}

Deno.test("les paroles fixes contiennent chaque félicitation commune", () => {
  const paroles = parolesFixes();
  for (const felicitation of FELICITATIONS_COMMUNES) assert(paroles.includes(felicitation), felicitation);
});

Deno.test("les paroles fixes contiennent chaque encouragement", () => {
  const paroles = parolesFixes();
  for (const encouragement of ENCOURAGEMENTS) assert(paroles.includes(encouragement), encouragement);
});

Deno.test("les paroles fixes contiennent chaque relance", () => {
  const paroles = parolesFixes();
  for (const relance of RELANCES) assert(paroles.includes(relance), relance);
});

Deno.test("les paroles fixes contiennent chaque invitation à jouer", () => {
  const paroles = parolesFixes();
  for (const invitation of INVITATIONS_A_JOUER) assert(paroles.includes(invitation), invitation);
});

Deno.test("les paroles fixes contiennent chaque annonce d'exercice", () => {
  const paroles = parolesFixes();
  for (const annonce of ANNONCES_D_EXERCICE) assert(paroles.includes(annonce), annonce);
});

Deno.test("les paroles fixes contiennent les expressions de chaque personnage guide", () => {
  const paroles = parolesFixes();
  for (const { personnageGuide } of UNIVERS) {
    for (const expression of personnageGuide.expressions) assert(paroles.includes(expression), expression);
  }
});

Deno.test("les paroles fixes contiennent la présentation de chaque personnage guide, y compris au retour du son", () => {
  const paroles = parolesFixes();
  for (const univers of UNIVERS) {
    assert(paroles.includes(presentation(univers)), presentation(univers));
    assert(
      paroles.includes(presentationAuRetourDuSon(univers.personnageGuide)),
      presentationAuRetourDuSon(univers.personnageGuide),
    );
  }
});

Deno.test("les paroles fixes contiennent la réponse au refus de la quête et la quête accomplie", () => {
  contientToutes([
    reponseAuRefusDeLaQuete(),
    propositionDeLaQueteDuJour({ genre: "accomplie", quete: "lecon" }) ?? "",
  ]);
});

Deno.test("les paroles fixes contiennent la salutation de chaque état de la série, sans le prénom", () => {
  const series = [
    { nombreDeJours: 0, aJoueAujourdhui: false },
    { nombreDeJours: 1, aJoueAujourdhui: true },
    { nombreDeJours: 1, aJoueAujourdhui: false },
  ];
  contientToutes(series.map((serie) => sansLePrenom(saluerAvecLaSerie(PRENOM, serie), PRENOM)));
});

Deno.test("les paroles fixes contiennent les paroles de la révision sans nombre, la fin sans le prénom", () => {
  contientToutes([
    accueillirEnRevision(),
    sansLePrenom(parolesDeFinDeRevision({ prenom: PRENOM, questionsJustes: 0 }), PRENOM),
  ]);
});

Deno.test("les paroles fixes contiennent le signal de départ et l'encouragement de la fluence sans calcul réussi", () => {
  contientToutes([SIGNAL_DE_DEPART, parolesDeFinDeFluence({ score: 0, issue: "aucunRecord" })]);
});

Deno.test("les paroles fixes contiennent les paroles du guide à l'ouverture de l'écran des médailles", () => {
  const sansRien = { pastilles: [], cabane: undefined };
  const avecUnEpisode = {
    ...sansRien,
    histoire: { nombreDEpisodesOuverts: 1, episodesOuverts: [HISTOIRE_DES_SAVANTURIERS[0]!], complete: false },
  };
  contientToutes([parolesDuGuideALOuverture(sansRien), parolesDuGuideALOuverture(avecUnEpisode)]);
});

Deno.test("les paroles fixes contiennent les titres et phrases fixes lus sur l'écran des médailles", () => {
  contientToutes([
    NOM_DE_L_ECRAN_DES_MEDAILLES,
    TITRE_DES_RECORDS_DE_CALCUL_RAPIDE,
    TITRE_DES_DEFIS_RELEVES,
    titreDeLaSection(),
    ...parolesDeLaSectionDeLHistoire(),
    ...parolesDeLaSectionDesBadgesOuSansBadge([]),
  ]);
});

Deno.test("les paroles fixes contiennent le texte lu de chaque épisode de l'histoire", () => {
  contientToutes(HISTOIRE_DES_SAVANTURIERS.map(texteALireDeLEpisode));
});

Deno.test("les paroles fixes contiennent l'ouverture de chaque grand défi", () => {
  contientToutes(toutesLesMatieres().map(({ code }) => parolesDeDebutDeGrandDefi({ matiere: code })));
});

Deno.test("les paroles fixes contiennent la fin de chaque grand défi, relevé ou non, sans le prénom", () => {
  contientToutes(
    toutesLesMatieres().flatMap(({ code }) =>
      [false, true].map((dejaReleve) =>
        sansLePrenom(parolesDeFinDeGrandDefi({ prenom: PRENOM, matiere: code, dejaReleve }), PRENOM)
      )
    ),
  );
});

Deno.test("les paroles fixes contiennent l'invitation à créer le premier profil", () => {
  contientToutes([inviterACreerLePremierProfil()]);
});

Deno.test("les paroles fixes contiennent chaque annonce « le texte est complet », félicitation commune ou du personnage guide", () => {
  const communes = FELICITATIONS_COMMUNES.map((_, i) => hasardDans(0.99, i / FELICITATIONS_COMMUNES.length));
  const duPersonnage = UNIVERS.flatMap(({ personnageGuide }) =>
    personnageGuide.expressions.map((_, i) => ({
      personnageGuide,
      hasard: hasardDans(0, i / personnageGuide.expressions.length),
    }))
  );
  contientToutes([
    ...communes.map((hasard) => direLeTexteComplet(UNIVERS[0]!.personnageGuide, hasard)),
    ...duPersonnage.map(({ personnageGuide, hasard }) => direLeTexteComplet(personnageGuide, hasard)),
  ]);
});

Deno.test("les paroles fixes contiennent « je ne sais pas » en dictée et au choix sans aide", () => {
  contientToutes([
    direJeNeSaisPasEnDictee("briller"),
    direJeNeSaisPasEnDictee("ecrire"),
    direJeNeSaisPasAvecLesChoix(undefined),
  ]);
});

Deno.test("les paroles fixes ne contiennent aucune parole avec le prénom de l'enfant", () => {
  const avecLePrenom = [
    saluer(PRENOM),
    accueillirSurLaPageDeLaLecon(PRENOM),
    feteDeLaQueteAccomplie(PRENOM),
    saluerAvecLaSerie(PRENOM, { nombreDeJours: 0, aJoueAujourdhui: false }),
    parolesDeFinDeRevision({ prenom: PRENOM, questionsJustes: 0 }),
    ...toutesLesMatieres().flatMap(({ code }) => [
      inviterAReleverLeGrandDefi({ prenom: PRENOM, matiere: code }),
      parolesDeFinDeGrandDefi({ prenom: PRENOM, matiere: code, dejaReleve: false }),
    ]),
    ...UNIVERS.map(({ personnageGuide }) => parolesDeFinDeSeance(3, PRENOM, personnageGuide, hasardDans(0))),
  ];
  const paroles = parolesFixes();
  for (const parole of avecLePrenom) assert(!paroles.includes(parole), parole);
  for (const parole of paroles) assert(!parole.includes(PRENOM), parole);
});

Deno.test("les paroles fixes ne contiennent aucune parole à nombre variable", () => {
  const guide = UNIVERS[0]!.personnageGuide;
  const pourDeuxValeurs = <T>(parole: (valeur: number) => T) => [parole(1), parole(2)];
  const aNombreVariable = [
    ...[1, 2].flatMap((etoiles) =>
      [parolesDeFinDeSeance(etoiles, PRENOM, guide, hasardDans(0))].map((parole) => sansLePrenom(parole, PRENOM))
    ),
    ...pourDeuxValeurs((questionsJustes) =>
      sansLePrenom(parolesDeFinDeRevision({ prenom: PRENOM, questionsJustes }), PRENOM)
    ),
    ...pourDeuxValeurs(annonceDeLaSeanceDeRevision),
    ...pourDeuxValeurs((nombreDeLecons) => parolesDeDebutDeDefi({ nombreDeLecons })),
    ...[3, 4].flatMap((numeroDuDefi) => [
      sansLePrenom(inviterARelever({ prenom: PRENOM, numeroDuDefi }), PRENOM),
      sansLePrenom(parolesDeFinDeDefi({ prenom: PRENOM, numeroDuDefi, dejaReleve: false }), PRENOM),
      annonceDuDefiOuvert(numeroDuDefi),
      nomDuDefi(numeroDuDefi),
    ]),
    ...pourDeuxValeurs((duree) => accueilDeLaFluence({ duree })),
    ...pourDeuxValeurs((score) => parolesDeFinDeFluence({ score, issue: "nouveauRecord" })),
    ...pourDeuxValeurs((score) => parolesDeFinDeFluence({ score, issue: "premierRecord" })),
    ...pourDeuxValeurs((record) => parolesDeFinDeFluence({ score: 5, issue: "recordInchange", record })),
  ];
  const paroles = parolesFixes();
  for (const parole of aNombreVariable) assert(!paroles.includes(parole), parole);
});

Deno.test("les paroles fixes ne contiennent aucun doublon", () => {
  const paroles = parolesFixes();
  assertEquals(new Set(paroles).size, paroles.length);
});

Deno.test("les paroles fixes ne contiennent aucune parole vide", () => {
  for (const parole of parolesFixes()) assert(parole.trim() !== "", "parole vide");
});
