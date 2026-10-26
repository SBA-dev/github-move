import { assertEquals } from "@std/assert";
import type { Badge } from "./badges.ts";
import { PALIERS_DE_LA_CABANE } from "./cabane.ts";
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

const lanterne = PALIERS_DE_LA_CABANE[0].objet;

function unBadge(nom: string): Badge {
  return { cle: nom, nom, matiere: "francais", lecons: [] };
}

const badgeDesSons = unBadge("Je reconnais les sons de test !");
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
  assertEquals(finDePhraseDuBadge(badgeSansCompetence), "Nouveau badge : Je sais : Les sons de test");
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

Deno.test("avec un objet et un badge, la cabane est annoncée avant le badge", () => {
  assertEquals(
    phraseDeFinAvecLesNouveautes(PHRASE_DE_FIN, { objet: lanterne, badge: badgeDesSons }),
    "Tu gagnes 2 étoiles, Léa. Tu rejoues pour aller chercher les autres ? Noisette a reçu une lanterne pour sa cabane. Nouveau badge : Je reconnais les sons de test !",
  );
});
