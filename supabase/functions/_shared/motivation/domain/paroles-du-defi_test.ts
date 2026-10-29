import { assertEquals } from "@std/assert";
import {
  annonceDuDefiOuvert,
  inviterARelever,
  parolesDeDebutDeDefi,
  parolesDeFinDeDefi,
  titreDuDefiReleve,
} from "./paroles-du-defi.ts";

Deno.test("à la fin de la séance qui ouvre le défi, le personnage guide propose de le relever", () => {
  const texte = inviterARelever({ prenom: "Léa", numeroDuDefi: 1 });

  assertEquals(texte, "Bravo Léa ! Tu as réussi toutes les leçons avant le défi 1. Tu veux le relever ?");
});

Deno.test("au début du défi, le personnage guide rassure en comptant les leçons que l'enfant connaît", () => {
  const texte = parolesDeDebutDeDefi({ nombreDeLecons: 5 });

  assertEquals(texte, "Voici des questions de 5 leçons que tu connais. Prends ton temps, je suis avec toi !");
});

Deno.test("à la fin du défi relevé pour la première fois, le personnage guide félicite l'enfant", () => {
  const texte = parolesDeFinDeDefi({ prenom: "Léa", numeroDuDefi: 1, dejaReleve: false });

  assertEquals(texte, "Bravo Léa ! Tu as relevé le défi 1 !");
});

Deno.test("à la fin d'un défi rejoué, le personnage guide dit que l'enfant l'a encore relevé", () => {
  const texte = parolesDeFinDeDefi({ prenom: "Léa", numeroDuDefi: 1, dejaReleve: true });

  assertEquals(texte, "Bravo Léa ! Tu as encore relevé le défi 1 !");
});

Deno.test("la fin de séance annonce que le défi est ouvert", () => {
  assertEquals(annonceDuDefiOuvert(2), "Le défi 2 est ouvert !");
});

Deno.test("l'annonce de fin de défi s'intitule « Défi relevé ! »", () => {
  assertEquals(titreDuDefiReleve(), "Défi relevé !");
});
