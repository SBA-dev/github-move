import { assertEquals } from "@std/assert";
import {
  annonceDeLaTenueRecue,
  descriptionDeLaSectionDesTenues,
  descriptionDuPersonnageGuide,
  phraseDeLEtatDesTenues,
  titreDeLAnnonceDeLaTenue,
  titreDeLaSectionDesTenues,
} from "./paroles-des-tenues.ts";
import { PALIERS_DES_TENUES, tenuesDe } from "./tenues.ts";
import { universDe } from "./univers.ts";

const noisette = universDe("animaux").personnageGuide;
const coachLeo = universDe("sports").personnageGuide;
const echarpeRayee = PALIERS_DES_TENUES[0].tenue;

Deno.test("l'encart de fin s'intitule « Pour » suivi du personnage guide", () => {
  assertEquals(titreDeLAnnonceDeLaTenue(noisette), "Pour Noisette");
});

Deno.test("l'annonce dit que le personnage guide du profil a reçu la tenue", () => {
  assertEquals(annonceDeLaTenueRecue(coachLeo, echarpeRayee), "Coach Léo a reçu une écharpe rayée !");
});

Deno.test("la description accessible nomme le personnage guide avec sa tenue portée", () => {
  assertEquals(descriptionDuPersonnageGuide(noisette, echarpeRayee), "Noisette, avec une écharpe rayée");
});

Deno.test("la description accessible sans tenue nomme le personnage guide seul", () => {
  assertEquals(descriptionDuPersonnageGuide(noisette, undefined), "Noisette");
});

Deno.test("la section des tenues s'intitule « Les tenues de » suivi du personnage guide", () => {
  assertEquals(titreDeLaSectionDesTenues(coachLeo), "Les tenues de Coach Léo");
});

Deno.test("à 5 étoiles, la phrase de l'état annonce les 7 étoiles qui manquent pour le nœud papillon", () => {
  assertEquals(
    phraseDeLEtatDesTenues(noisette, tenuesDe(5)),
    "Encore 7 étoiles et Noisette recevra un nœud papillon !",
  );
});

Deno.test("à 11 étoiles, la phrase de l'état dit « Encore 1 étoile » au singulier", () => {
  assertEquals(
    phraseDeLEtatDesTenues(noisette, tenuesDe(11)),
    "Encore 1 étoile et Noisette recevra un nœud papillon !",
  );
});

Deno.test("quand toutes les tenues sont reçues, la phrase de l'état le dit", () => {
  assertEquals(phraseDeLEtatDesTenues(noisette, tenuesDe(37)), "Noisette a reçu toutes ses tenues !");
});

Deno.test("avec 1 tenue reçue, la section des tenues est décrite « avec 1 tenue » au singulier", () => {
  assertEquals(
    descriptionDeLaSectionDesTenues(noisette, tenuesDe(5)),
    "Les tenues de Noisette, avec 1 tenue",
  );
});

Deno.test("avec 2 tenues reçues, la section des tenues est décrite « avec 2 tenues » au pluriel", () => {
  assertEquals(
    descriptionDeLaSectionDesTenues(noisette, tenuesDe(12)),
    "Les tenues de Noisette, avec 2 tenues",
  );
});
