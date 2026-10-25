import { assertEquals } from "@std/assert";
import { cabaneDe, PALIERS_DE_LA_CABANE } from "./cabane.ts";
import {
  annonceDeLObjetRecu,
  descriptionDuDessin,
  finDePhraseDuPersonnageGuide,
  libelleDuPalier,
  libelleLuDuPalier,
  phraseDeFinAvecLaCabane,
  phraseDeLEtat,
  titreDeLAnnonce,
  titreDeLaSection,
} from "./paroles-de-la-cabane.ts";

const lanterne = PALIERS_DE_LA_CABANE[0];
const tapis = PALIERS_DE_LA_CABANE[1];
const potDeFleurs = PALIERS_DE_LA_CABANE[2];

Deno.test("la section de la cabane s'intitule toujours « La cabane de Noisette »", () => {
  assertEquals(titreDeLaSection(), "La cabane de Noisette");
});

Deno.test("à 0 étoile, la phrase de l'état annonce la lanterne avec « 0 étoile » au singulier", () => {
  assertEquals(
    phraseDeLEtat(cabaneDe(0)),
    "Tu as 0 étoile. Encore 3 étoiles et Noisette recevra une lanterne !",
  );
});

Deno.test("à 1 étoile, la phrase de l'état compte les étoiles qui manquent au pluriel", () => {
  assertEquals(
    phraseDeLEtat(cabaneDe(1)),
    "Tu as 1 étoile. Encore 2 étoiles et Noisette recevra une lanterne !",
  );
});

Deno.test("à 2 étoiles, la phrase de l'état dit « Encore 1 étoile » au singulier", () => {
  assertEquals(
    phraseDeLEtat(cabaneDe(2)),
    "Tu as 2 étoiles. Encore 1 étoile et Noisette recevra une lanterne !",
  );
});

Deno.test("à 75 étoiles, la phrase de l'état dit que la cabane est complète", () => {
  assertEquals(
    phraseDeLEtat(cabaneDe(75)),
    "Tu as 75 étoiles. La cabane est complète, quelle merveille !",
  );
});

Deno.test("la description du dessin dit « avec 0 objet » quand la cabane est vide", () => {
  assertEquals(descriptionDuDessin(cabaneDe(0)), "La cabane de Noisette, avec 0 objet");
});

Deno.test("la description du dessin dit « avec 1 objet » au singulier", () => {
  assertEquals(descriptionDuDessin(cabaneDe(3)), "La cabane de Noisette, avec 1 objet");
});

Deno.test("la description du dessin dit « avec 2 objets » au pluriel", () => {
  assertEquals(descriptionDuDessin(cabaneDe(9)), "La cabane de Noisette, avec 2 objets");
});

Deno.test("le libellé d'un palier atteint est le nom de son objet", () => {
  assertEquals(libelleDuPalier(tapis, true), "un tapis tout doux");
});

Deno.test("le libellé d'un palier non atteint est son seuil suivi d'une étoile", () => {
  assertEquals(libelleDuPalier(potDeFleurs, false), "10 ★");
});

Deno.test("un lecteur d'écran lit un palier non atteint en étoiles", () => {
  assertEquals(libelleLuDuPalier(potDeFleurs, false), "10 étoiles");
});

Deno.test("un lecteur d'écran lit un palier atteint par le nom de son objet", () => {
  assertEquals(libelleLuDuPalier(lanterne, true), "une lanterne");
});

Deno.test("l'écran de fin de séance titre son annonce « Pour la cabane »", () => {
  assertEquals(titreDeLAnnonce(), "Pour la cabane");
});

Deno.test("l'écran de fin de séance annonce que Noisette a reçu l'objet", () => {
  assertEquals(annonceDeLObjetRecu(tapis.objet), "Noisette a reçu un tapis tout doux !");
});

Deno.test("le personnage guide termine sa phrase de fin par l'objet reçu pour la cabane", () => {
  assertEquals(
    finDePhraseDuPersonnageGuide(tapis.objet),
    "Noisette a reçu un tapis tout doux pour sa cabane.",
  );
});

const PHRASE_DE_FIN = "Tu gagnes 1 étoile, Léa. Tu rejoues pour aller chercher les autres ?";

Deno.test("sans objet reçu, la phrase de fin reste inchangée", () => {
  assertEquals(phraseDeFinAvecLaCabane(PHRASE_DE_FIN, undefined), PHRASE_DE_FIN);
});

Deno.test("avec un objet reçu, la phrase de fin se termine par l'objet reçu pour la cabane", () => {
  assertEquals(
    phraseDeFinAvecLaCabane(PHRASE_DE_FIN, tapis.objet),
    "Tu gagnes 1 étoile, Léa. Tu rejoues pour aller chercher les autres ? Noisette a reçu un tapis tout doux pour sa cabane.",
  );
});

Deno.test("la phrase de fin d'un autre personnage guide annonce toujours que Noisette a reçu l'objet", () => {
  const phraseDeCoachLeo = "Tu gagnes 1 étoile, Léa. On remet ça, champion ?";

  assertEquals(
    phraseDeFinAvecLaCabane(phraseDeCoachLeo, tapis.objet),
    "Tu gagnes 1 étoile, Léa. On remet ça, champion ? Noisette a reçu un tapis tout doux pour sa cabane.",
  );
});
