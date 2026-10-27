import { assertEquals } from "@std/assert";
import type { Badge } from "./badges.ts";
import { PALIERS_DE_LA_CABANE } from "./cabane.ts";
import { HISTOIRE_DES_SAVANTURIERS } from "./histoire.ts";
import {
  finDePhraseDuBadge,
  libelleDeLaListeDesBadges,
  parolesDeLaSectionDesBadges,
  phraseDeFinAvecLesNouveautes,
  phraseDeLaSectionDesBadges,
  phraseSansBadge,
  titreDeLAnnonceDuBadge,
  titreDeLaSectionDesBadges,
} from "./paroles-des-badges.ts";
import { parolesDeFinDeFluence } from "./paroles-de-fluence.ts";
import { parolesDeFinDeRevision } from "./paroles-de-revision.ts";

const lanterne = PALIERS_DE_LA_CABANE[0].objet;
const tapis = PALIERS_DE_LA_CABANE[1].objet;
const premierEpisode = HISTOIRE_DES_SAVANTURIERS[0];
const FIN_DE_L_EPISODE = "Un nouvel épisode de l'histoire t'attend !";

function unBadge(nom: string): Badge {
  return { cle: nom, nom, matiere: "francais", lecons: [] };
}

const badgeDesSons = unBadge("Je reconnais les sons de test");
const badgeSansCompetence = unBadge("Je sais : Les sons de test");
const deuxBadges = [badgeDesSons, badgeSansCompetence];

Deno.test("la section des badges s'intitule « Mes badges »", () => {
  assertEquals(titreDeLaSectionDesBadges(), "Mes badges");
});

Deno.test("sans badge, la phrase explique comment gagner son premier badge", () => {
  assertEquals(phraseSansBadge(), "Gagne au moins 2 étoiles dans une leçon pour gagner son badge.");
});

Deno.test("avec 1 badge, la phrase de la section dit « Tu as 1 badge. » au singulier", () => {
  assertEquals(phraseDeLaSectionDesBadges([badgeDesSons]), "Tu as 1 badge.");
});

Deno.test("avec 2 badges, la phrase de la section dit « Tu as 2 badges. » au pluriel", () => {
  assertEquals(phraseDeLaSectionDesBadges(deuxBadges), "Tu as 2 badges.");
});

Deno.test("un lecteur d'écran lit la liste d'1 badge au singulier", () => {
  assertEquals(libelleDeLaListeDesBadges([badgeDesSons]), "Mes badges, avec 1 badge");
});

Deno.test("un lecteur d'écran lit la liste de 2 badges au pluriel", () => {
  assertEquals(libelleDeLaListeDesBadges(deuxBadges), "Mes badges, avec 2 badges");
});

Deno.test("le bouton « Écouter » lit le titre de la section puis la phrase des badges", () => {
  assertEquals(parolesDeLaSectionDesBadges(deuxBadges), ["Mes badges", "Tu as 2 badges."]);
});

Deno.test("l'écran de fin de séance titre son annonce « Nouveau badge »", () => {
  assertEquals(titreDeLAnnonceDuBadge(), "Nouveau badge");
});

Deno.test("le personnage guide termine sa phrase de fin par le nom du badge gagné", () => {
  assertEquals(finDePhraseDuBadge(badgeDesSons), "Nouveau badge : Je reconnais les sons de test !");
});

Deno.test("un badge sans compétence garde son nom « Je sais : … » dans la fin de phrase", () => {
  assertEquals(finDePhraseDuBadge(badgeSansCompetence), "Nouveau badge : Je sais : Les sons de test !");
});

const PHRASE_DE_FIN = "Tu gagnes 2 étoiles, Léa. Tu rejoues pour aller chercher les autres ?";

Deno.test("sans objet ni badge, la phrase de fin reste inchangée", () => {
  assertEquals(
    phraseDeFinAvecLesNouveautes(PHRASE_DE_FIN, { objet: undefined, badge: undefined }),
    PHRASE_DE_FIN,
  );
});

Deno.test("avec un badge seul, la phrase de fin se termine par le badge gagné", () => {
  assertEquals(
    phraseDeFinAvecLesNouveautes(PHRASE_DE_FIN, { objet: undefined, badge: badgeDesSons }),
    `${PHRASE_DE_FIN} Nouveau badge : Je reconnais les sons de test !`,
  );
});

Deno.test("avec un objet seul, la phrase de fin se termine par l'objet reçu pour la cabane", () => {
  assertEquals(
    phraseDeFinAvecLesNouveautes(PHRASE_DE_FIN, { objet: lanterne, badge: undefined }),
    `${PHRASE_DE_FIN} Noisette a reçu une lanterne pour sa cabane.`,
  );
});

Deno.test("la phrase de fin d'un autre personnage guide annonce toujours que Noisette a reçu l'objet", () => {
  const phraseDeCoachLeo = "Tu gagnes 1 étoile, Léa. On remet ça, champion ?";

  assertEquals(
    phraseDeFinAvecLesNouveautes(phraseDeCoachLeo, { objet: lanterne, badge: undefined }),
    "Tu gagnes 1 étoile, Léa. On remet ça, champion ? Noisette a reçu une lanterne pour sa cabane.",
  );
});

Deno.test("avec un objet et un badge, la cabane est annoncée avant le badge", () => {
  assertEquals(
    phraseDeFinAvecLesNouveautes(PHRASE_DE_FIN, { objet: lanterne, badge: badgeDesSons }),
    "Tu gagnes 2 étoiles, Léa. Tu rejoues pour aller chercher les autres ? Noisette a reçu une lanterne pour sa cabane. Nouveau badge : Je reconnais les sons de test !",
  );
});

Deno.test("avec un épisode seul, la phrase de fin se termine par l'épisode qui attend l'enfant", () => {
  assertEquals(
    phraseDeFinAvecLesNouveautes(PHRASE_DE_FIN, { episode: premierEpisode }),
    `${PHRASE_DE_FIN} ${FIN_DE_L_EPISODE}`,
  );
});

Deno.test("avec un objet et un épisode, la cabane est annoncée avant l'épisode", () => {
  assertEquals(
    phraseDeFinAvecLesNouveautes(PHRASE_DE_FIN, { objet: tapis, episode: premierEpisode }),
    `${PHRASE_DE_FIN} Noisette a reçu un tapis tout doux pour sa cabane. ${FIN_DE_L_EPISODE}`,
  );
});

Deno.test("avec un objet, un épisode et un badge, la cabane précède l'épisode, qui précède le badge", () => {
  assertEquals(
    phraseDeFinAvecLesNouveautes(PHRASE_DE_FIN, { objet: tapis, episode: premierEpisode, badge: badgeDesSons }),
    `${PHRASE_DE_FIN} Noisette a reçu un tapis tout doux pour sa cabane. ${FIN_DE_L_EPISODE} Nouveau badge : Je reconnais les sons de test !`,
  );
});

Deno.test("sans épisode, la phrase de fin avec un objet et un badge reste inchangée", () => {
  assertEquals(
    phraseDeFinAvecLesNouveautes(PHRASE_DE_FIN, { objet: lanterne, episode: undefined, badge: badgeDesSons }),
    `${PHRASE_DE_FIN} Noisette a reçu une lanterne pour sa cabane. Nouveau badge : Je reconnais les sons de test !`,
  );
});

Deno.test("les paroles de fin de fluence se terminent par l'épisode qui attend l'enfant", () => {
  const paroles = parolesDeFinDeFluence({ score: 8, issue: "premierRecord" });

  assertEquals(
    phraseDeFinAvecLesNouveautes(paroles, { episode: premierEpisode }),
    `${paroles} ${FIN_DE_L_EPISODE}`,
  );
});

Deno.test("les paroles de fin de révision se terminent par l'épisode qui attend l'enfant", () => {
  const paroles = parolesDeFinDeRevision({ prenom: "Léa", questionsJustes: 3 });

  assertEquals(
    phraseDeFinAvecLesNouveautes(paroles, { episode: premierEpisode }),
    `${paroles} ${FIN_DE_L_EPISODE}`,
  );
});
