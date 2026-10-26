import { assert, assertEquals, assertStringIncludes } from "@std/assert";
import { HISTOIRE_DES_SAVANTURIERS } from "./histoire.ts";
import {
  annonceDeLEpisodeOuvert,
  annonceLueDeLEpisodeOuvert,
  finDePhraseDeLEpisode,
  parolesDeLaSectionDeLHistoire,
  positionDeLEpisode,
  rangDansLeTexteDeLEpisode,
  sousTitreDeLaSectionDeLHistoire,
  texteALireDeLEpisode,
  titreDeLAnnonceDeLEpisode,
  titreDeLaSectionDeLHistoire,
} from "./paroles-de-l-histoire.ts";

const cartePliee = HISTOIRE_DES_SAVANTURIERS[0];

Deno.test("la section de l'histoire s'intitule « L'histoire des Savanturiers »", () => {
  assertEquals(titreDeLaSectionDeLHistoire(), "L'histoire des Savanturiers");
});

Deno.test("le sous-titre de la section dit qu'un épisode s'ouvre à chaque séance terminée", () => {
  assertEquals(
    sousTitreDeLaSectionDeLHistoire(),
    "Un nouvel épisode s'ouvre à chaque séance terminée.",
  );
});

Deno.test("les paroles de la section, lues avec « tout lire », sont son titre puis son sous-titre", () => {
  assertEquals(parolesDeLaSectionDeLHistoire(), [
    "L'histoire des Savanturiers",
    "Un nouvel épisode s'ouvre à chaque séance terminée.",
  ]);
});

Deno.test("la position d'un épisode dit son rang sur 20", () => {
  assertEquals(positionDeLEpisode(cartePliee), "Épisode 1 sur 20");
});

Deno.test("le texte à lire d'un épisode commence par son titre suivi d'un point", () => {
  assert(texteALireDeLEpisode(cartePliee).startsWith("La carte froissée. "));
});

Deno.test("le texte à lire d'un épisode se termine par le texte de l'épisode", () => {
  assert(texteALireDeLEpisode(cartePliee).endsWith(cartePliee.texte));
});

Deno.test("le texte à lire d'un épisode ne lit pas sa position", () => {
  const texteALire = texteALireDeLEpisode(cartePliee);

  assertEquals(texteALire.includes("Épisode 1 sur 20"), false);
  assertStringIncludes(texteALire, "Noisette");
});

Deno.test("l'écran de fin de séance titre son annonce « Nouvel épisode ! »", () => {
  assertEquals(titreDeLAnnonceDeLEpisode(), "Nouvel épisode !");
});

Deno.test("l'écran de fin de séance annonce l'épisode ouvert par son titre", () => {
  assertEquals(annonceDeLEpisodeOuvert(cartePliee), "La carte froissée");
});

Deno.test("l'annonce lue de l'épisode ouvert commence par « Nouvel épisode ! »", () => {
  assertEquals(annonceLueDeLEpisodeOuvert(cartePliee), "Nouvel épisode ! La carte froissée");
});

Deno.test("le personnage guide termine sa phrase de fin en annonçant un nouvel épisode", () => {
  assertEquals(finDePhraseDeLEpisode(), "Un nouvel épisode de l'histoire t'attend !");
});

Deno.test("un mot du titre de l'épisode, lu avant le texte, n'a aucun rang à surligner dans le texte", () => {
  assertEquals([0, 1, 2].map((rangLu) => rangDansLeTexteDeLEpisode(cartePliee, rangLu)), [
    undefined,
    undefined,
    undefined,
  ]);
});

Deno.test("le premier mot lu après le titre est le mot de rang 0 du texte de l'épisode", () => {
  assertEquals(rangDansLeTexteDeLEpisode(cartePliee, 3), 0);
});

Deno.test("le deuxième mot lu après le titre est le mot de rang 1 du texte de l'épisode", () => {
  assertEquals(rangDansLeTexteDeLEpisode(cartePliee, 4), 1);
});

Deno.test("une apostrophe ne coupe pas un mot : « L'Étoile » compte pour un seul mot du titre", () => {
  const etoileDuSavoir = HISTOIRE_DES_SAVANTURIERS[18];

  assertEquals(rangDansLeTexteDeLEpisode(etoileDuSavoir, 2), undefined);
  assertEquals(rangDansLeTexteDeLEpisode(etoileDuSavoir, 3), 0);
});

Deno.test("le dernier mot lu est le dernier mot du texte de l'épisode", () => {
  const etoileDuSavoir = HISTOIRE_DES_SAVANTURIERS[18];

  assertEquals(rangDansLeTexteDeLEpisode(etoileDuSavoir, 30), 27);
});
