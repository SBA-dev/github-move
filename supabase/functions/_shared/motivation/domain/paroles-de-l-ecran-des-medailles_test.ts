import { assertEquals } from "@std/assert";
import type { Badge } from "./badges.ts";
import { cabaneDe } from "./cabane.ts";
import { histoireDe } from "./histoire.ts";
import type { PastilleDeRecord } from "./records-de-calcul-rapide.ts";
import {
  NOM_DE_L_ECRAN_DES_MEDAILLES,
  parolesALOuverture,
  parolesDeLaSectionDesBadgesOuSansBadge,
  parolesDeLaSectionDesRecords,
  parolesDuGuideALOuverture,
  phraseLueDeLaPastille,
  TITRE_DES_RECORDS_DE_CALCUL_RAPIDE,
} from "./paroles-de-l-ecran-des-medailles.ts";

function pastille(meilleurScore: number): PastilleDeRecord {
  return {
    lecon: "lecon-1",
    exercice: "exercice-1",
    libelle: "Calcul rapide : tables de 3 et 4",
    meilleurScore,
  };
}

Deno.test("l'écran des médailles s'appelle « Mes médailles »", () => {
  assertEquals(NOM_DE_L_ECRAN_DES_MEDAILLES, "Mes médailles");
});

Deno.test("le personnage guide invite l'enfant à regarder ce qu'il a gagné quand il y a un record", () => {
  const paroles = parolesDuGuideALOuverture({ cabane: undefined, pastilles: [pastille(12)] });

  assertEquals(paroles, "Regarde tout ce que tu as gagné !");
});

Deno.test("le personnage guide invite l'enfant à regarder ce qu'il a gagné quand la cabane a au moins un objet", () => {
  const paroles = parolesDuGuideALOuverture({ cabane: cabaneDe(3), pastilles: [] });

  assertEquals(paroles, "Regarde tout ce que tu as gagné !");
});

Deno.test("le personnage guide invite l'enfant à gagner des étoiles quand la cabane n'a aucun objet et qu'il n'y a aucun record", () => {
  const paroles = parolesDuGuideALOuverture({ cabane: cabaneDe(2), pastilles: [] });

  assertEquals(paroles, "Gagne des étoiles pour remplir la cabane !");
});

Deno.test("le personnage guide invite l'enfant à gagner des étoiles quand les étoiles n'ont pas pu être lues et qu'il n'y a aucun record", () => {
  const paroles = parolesDuGuideALOuverture({ cabane: undefined, pastilles: [] });

  assertEquals(paroles, "Gagne des étoiles pour remplir la cabane !");
});

Deno.test("la pastille de record est lue avec le libellé et le record au pluriel", () => {
  const phrase = phraseLueDeLaPastille(pastille(12));

  assertEquals(phrase, "Calcul rapide : tables de 3 et 4 : ton record est de 12 calculs");
});

Deno.test("la pastille d'un record de 1 calcul est lue au singulier", () => {
  const phrase = phraseLueDeLaPastille(pastille(1));

  assertEquals(phrase, "Calcul rapide : tables de 3 et 4 : ton record est de 1 calcul");
});

Deno.test("la section des records s'appelle « Mes records de calcul rapide »", () => {
  assertEquals(TITRE_DES_RECORDS_DE_CALCUL_RAPIDE, "Mes records de calcul rapide");
});

Deno.test("le bouton « Écouter » de la section des records lit son titre puis la phrase de chaque pastille dans l'ordre reçu", () => {
  const premiere = pastille(12);
  const seconde = { ...pastille(1), libelle: "Calcul rapide : tables de 5" };

  const paroles = parolesDeLaSectionDesRecords([premiere, seconde]);

  assertEquals(paroles, [
    "Mes records de calcul rapide",
    "Calcul rapide : tables de 3 et 4 : ton record est de 12 calculs",
    "Calcul rapide : tables de 5 : ton record est de 1 calcul",
  ]);
});

Deno.test("sans « Tout lire à voix haute », seule la phrase du personnage guide est lue à l'ouverture", () => {
  const paroles = parolesALOuverture({ toutLire: false, pastilles: [pastille(12)], cabane: cabaneDe(0) });

  assertEquals(paroles, ["Regarde tout ce que tu as gagné !"]);
});

Deno.test("avec « Tout lire à voix haute », avec une cabane à 0 étoile, la cabane est lue avant les records", () => {
  const paroles = parolesALOuverture({ toutLire: true, pastilles: [pastille(12)], cabane: cabaneDe(0) });

  assertEquals(paroles, [
    "Regarde tout ce que tu as gagné !",
    "Mes médailles",
    "La cabane de Noisette",
    "Tu as 0 étoile. Encore 3 étoiles et Noisette recevra une lanterne !",
    "Mes records de calcul rapide",
    "Calcul rapide : tables de 3 et 4 : ton record est de 12 calculs",
  ]);
});

Deno.test("avec « Tout lire à voix haute » et rien à montrer, la phrase d'accueil est suivie de « Mes médailles » puis de la cabane", () => {
  const paroles = parolesALOuverture({ toutLire: true, pastilles: [], cabane: cabaneDe(2) });

  assertEquals(paroles, [
    "Gagne des étoiles pour remplir la cabane !",
    "Mes médailles",
    "La cabane de Noisette",
    "Tu as 2 étoiles. Encore 1 étoile et Noisette recevra une lanterne !",
  ]);
});

Deno.test("avec « Tout lire à voix haute », rien à montrer et les étoiles non lues, la phrase d'accueil est suivie de « Mes médailles »", () => {
  const paroles = parolesALOuverture({ toutLire: true, pastilles: [], cabane: undefined });

  assertEquals(paroles, ["Gagne des étoiles pour remplir la cabane !", "Mes médailles"]);
});

Deno.test("avec « Tout lire à voix haute », la cabane est lue avant les records, sans ses pastilles", () => {
  const paroles = parolesALOuverture({ toutLire: true, pastilles: [pastille(12)], cabane: cabaneDe(3) });

  assertEquals(paroles, [
    "Regarde tout ce que tu as gagné !",
    "Mes médailles",
    "La cabane de Noisette",
    "Tu as 3 étoiles. Encore 3 étoiles et Noisette recevra un tapis tout doux !",
    "Mes records de calcul rapide",
    "Calcul rapide : tables de 3 et 4 : ton record est de 12 calculs",
  ]);
});

Deno.test("avec « Tout lire à voix haute » et la cabane seule, le titre de la cabane puis sa phrase suivent « Mes médailles »", () => {
  const paroles = parolesALOuverture({ toutLire: true, pastilles: [], cabane: cabaneDe(3) });

  assertEquals(paroles, [
    "Regarde tout ce que tu as gagné !",
    "Mes médailles",
    "La cabane de Noisette",
    "Tu as 3 étoiles. Encore 3 étoiles et Noisette recevra un tapis tout doux !",
  ]);
});

Deno.test("avec « Tout lire à voix haute » et les étoiles non lues, la cabane n'est pas lue", () => {
  const paroles = parolesALOuverture({ toutLire: true, pastilles: [pastille(12)], cabane: undefined });

  assertEquals(paroles, [
    "Regarde tout ce que tu as gagné !",
    "Mes médailles",
    "Mes records de calcul rapide",
    "Calcul rapide : tables de 3 et 4 : ton record est de 12 calculs",
  ]);
});

const badge: Badge = { cle: "Additionner", nom: "Additionner", matiere: "maths", lecons: ["cp-calcul-addition"] };

Deno.test("le personnage guide invite l'enfant à regarder ce qu'il a gagné quand il y a un badge, sans objet ni record", () => {
  const paroles = parolesDuGuideALOuverture({ cabane: cabaneDe(2), pastilles: [], badges: [badge] });

  assertEquals(paroles, "Regarde tout ce que tu as gagné !");
});

Deno.test("le personnage guide invite l'enfant à gagner des étoiles quand la liste des badges est vide et qu'il n'y a rien d'autre", () => {
  const paroles = parolesDuGuideALOuverture({ cabane: cabaneDe(2), pastilles: [], badges: [] });

  assertEquals(paroles, "Gagne des étoiles pour remplir la cabane !");
});

Deno.test("avec « Tout lire à voix haute », les badges sont lus après la cabane", () => {
  const paroles = parolesALOuverture({ toutLire: true, pastilles: [], cabane: cabaneDe(2), badges: [badge] });

  assertEquals(paroles, [
    "Regarde tout ce que tu as gagné !",
    "Mes médailles",
    "La cabane de Noisette",
    "Tu as 2 étoiles. Encore 1 étoile et Noisette recevra une lanterne !",
    "Mes badges",
    "Tu as 1 badge.",
  ]);
});

Deno.test("avec « Tout lire à voix haute » et aucun badge gagné, la phrase sans badge suit le titre des badges", () => {
  const paroles = parolesALOuverture({ toutLire: true, pastilles: [], cabane: cabaneDe(2), badges: [] });

  assertEquals(paroles, [
    "Gagne des étoiles pour remplir la cabane !",
    "Mes médailles",
    "La cabane de Noisette",
    "Tu as 2 étoiles. Encore 1 étoile et Noisette recevra une lanterne !",
    "Mes badges",
    "Gagne au moins 2 étoiles dans une leçon pour gagner son badge.",
  ]);
});

Deno.test("avec « Tout lire à voix haute », les records sont lus après les badges", () => {
  const paroles = parolesALOuverture({
    toutLire: true,
    pastilles: [pastille(12)],
    cabane: cabaneDe(2),
    badges: [badge],
  });

  assertEquals(paroles, [
    "Regarde tout ce que tu as gagné !",
    "Mes médailles",
    "La cabane de Noisette",
    "Tu as 2 étoiles. Encore 1 étoile et Noisette recevra une lanterne !",
    "Mes badges",
    "Tu as 1 badge.",
    "Mes records de calcul rapide",
    "Calcul rapide : tables de 3 et 4 : ton record est de 12 calculs",
  ]);
});

Deno.test("sans « Tout lire à voix haute », les badges ne sont pas lus : seule la phrase du personnage guide l'est", () => {
  const paroles = parolesALOuverture({ toutLire: false, pastilles: [], cabane: cabaneDe(2), badges: [badge] });

  assertEquals(paroles, ["Regarde tout ce que tu as gagné !"]);
});

Deno.test("le bouton « Écouter » de la section des badges lit son titre puis la phrase sans badge quand il n'y en a aucun", () => {
  assertEquals(parolesDeLaSectionDesBadgesOuSansBadge([]), [
    "Mes badges",
    "Gagne au moins 2 étoiles dans une leçon pour gagner son badge.",
  ]);
});

Deno.test("le bouton « Écouter » de la section des badges lit son titre puis le nombre de badges gagnés", () => {
  const autreBadge: Badge = { cle: "Soustraire", nom: "Soustraire", matiere: "maths", lecons: [] };

  assertEquals(parolesDeLaSectionDesBadgesOuSansBadge([badge, autreBadge]), [
    "Mes badges",
    "Tu as 2 badges.",
  ]);
});

Deno.test("le personnage guide invite l'enfant à regarder ce qu'il a gagné quand un épisode de l'histoire est ouvert", () => {
  const paroles = parolesDuGuideALOuverture({ cabane: cabaneDe(0), pastilles: [], histoire: histoireDe(1) });

  assertEquals(paroles, "Regarde tout ce que tu as gagné !");
});

Deno.test("le personnage guide invite l'enfant à gagner des étoiles quand l'histoire n'a aucun épisode ouvert", () => {
  const paroles = parolesDuGuideALOuverture({ cabane: cabaneDe(0), pastilles: [], histoire: histoireDe(0) });

  assertEquals(paroles, "Gagne des étoiles pour remplir la cabane !");
});

Deno.test("avec « Tout lire à voix haute », le titre de l'histoire puis son sous-titre suivent la cabane, sans titre d'épisode", () => {
  const paroles = parolesALOuverture({
    toutLire: true,
    pastilles: [],
    cabane: cabaneDe(3),
    histoire: histoireDe(2),
  });

  assertEquals(paroles, [
    "Regarde tout ce que tu as gagné !",
    "Mes médailles",
    "La cabane de Noisette",
    "Tu as 3 étoiles. Encore 3 étoiles et Noisette recevra un tapis tout doux !",
    "L'histoire des Savanturiers",
    "Un nouvel épisode s'ouvre à chaque séance terminée.",
  ]);
});

Deno.test("avec « Tout lire à voix haute », l'histoire est lue avant les badges", () => {
  const paroles = parolesALOuverture({
    toutLire: true,
    pastilles: [],
    cabane: undefined,
    histoire: histoireDe(0),
    badges: [],
  });

  assertEquals(paroles, [
    "Gagne des étoiles pour remplir la cabane !",
    "Mes médailles",
    "L'histoire des Savanturiers",
    "Un nouvel épisode s'ouvre à chaque séance terminée.",
    "Mes badges",
    "Gagne au moins 2 étoiles dans une leçon pour gagner son badge.",
  ]);
});

Deno.test("avec « Tout lire à voix haute » et sans histoire connue, rien de l'histoire n'est lu", () => {
  const paroles = parolesALOuverture({ toutLire: true, pastilles: [], cabane: undefined, histoire: undefined });

  assertEquals(paroles, ["Gagne des étoiles pour remplir la cabane !", "Mes médailles"]);
});
