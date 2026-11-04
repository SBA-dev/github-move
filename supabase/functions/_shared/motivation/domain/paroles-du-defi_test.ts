import { assertEquals } from "@std/assert";
import { matiereDeCode, Niveau } from "../../catalogue/domain/index.ts";
import type { Defi, GrandDefi } from "../../apprentissage/domain/index.ts";
import {
  annonceDuDefiOuvert,
  annonceDuGrandDefiOuvert,
  inviterARelever,
  inviterAReleverLeGrandDefi,
  nomDuDefi,
  nomDuDefiOuvert,
  nomDuGrandDefi,
  parolesDeDebutDeDefi,
  parolesDeDebutDeGrandDefi,
  parolesDeFinDeDefi,
  parolesDeFinDeGrandDefi,
  phraseDeFinAvecLeDefi,
  phraseDeFinAvecLeGrandDefi,
  titreDuDefiReleve,
  titreDuGrandDefiReleve,
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

Deno.test("le personnage guide propose le défi ouvert après sa phrase de fin", () => {
  const texte = phraseDeFinAvecLeDefi("À demain !", "Léa", 1);

  assertEquals(texte, `À demain ! ${inviterARelever({ prenom: "Léa", numeroDuDefi: 1 })}`);
});

Deno.test("sans défi ouvert, la phrase de fin reste seule", () => {
  assertEquals(phraseDeFinAvecLeDefi("À demain !", "Léa", undefined), "À demain !");
});

Deno.test("le personnage guide propose le grand défi après sa phrase de fin", () => {
  const texte = phraseDeFinAvecLeGrandDefi("À demain !", "Léa", "maths");

  assertEquals(
    texte,
    "À demain ! Bravo Léa ! Tu as réussi toutes les leçons de maths. Le grand défi t'attend !",
  );
});

Deno.test("un défi se nomme « Défi » suivi de son numéro", () => {
  assertEquals(nomDuDefi(1), "Défi 1");
});

Deno.test("le grand défi se nomme « Grand défi »", () => {
  assertEquals(nomDuGrandDefi(), "Grand défi");
});

Deno.test("la fin de séance annonce que le grand défi de la matière est ouvert", () => {
  assertEquals(annonceDuGrandDefiOuvert("maths"), "Le grand défi des maths est ouvert !");
});

Deno.test("à la fin de la séance qui rend la matière réussie, le personnage guide propose le grand défi", () => {
  const texte = inviterAReleverLeGrandDefi({ prenom: "Léa", matiere: "maths" });

  assertEquals(texte, "Bravo Léa ! Tu as réussi toutes les leçons de maths. Le grand défi t'attend !");
});

Deno.test("au début du grand défi, le personnage guide rassure en parlant de toutes les leçons de la matière", () => {
  const texte = parolesDeDebutDeGrandDefi({ matiere: "maths" });

  assertEquals(texte, "Voici des questions de toutes tes leçons de maths. Prends ton temps, je suis avec toi !");
});

Deno.test("à la fin du grand défi relevé pour la première fois, le personnage guide félicite l'enfant", () => {
  const texte = parolesDeFinDeGrandDefi({ prenom: "Léa", matiere: "maths", dejaReleve: false });

  assertEquals(texte, "Bravo Léa ! Tu as relevé le grand défi des maths !");
});

Deno.test("à la fin d'un grand défi rejoué, le personnage guide dit que l'enfant l'a encore relevé", () => {
  const texte = parolesDeFinDeGrandDefi({ prenom: "Léa", matiere: "maths", dejaReleve: true });

  assertEquals(texte, "Bravo Léa ! Tu as encore relevé le grand défi des maths !");
});

Deno.test("l'annonce de fin de grand défi s'intitule « Grand défi relevé ! », celle du défi d'une partie reste « Défi relevé ! »", () => {
  assertEquals(titreDuGrandDefiReleve(), "Grand défi relevé !");
  assertEquals(titreDuDefiReleve(), "Défi relevé !");
});

const maths = matiereDeCode("maths");
const niveau = Niveau.de("CE1");
const defiNumero2: Defi = { matiere: maths, niveau, numero: 2, lecons: ["ma-ce1-1", "ma-ce1-2", "ma-ce1-3"] };
const grandDefiDesMaths: GrandDefi = { matiere: maths, niveau, grandDefi: true, lecons: ["ma-ce1-1", "ma-ce1-2"] };

Deno.test("le repère d'un défi du parcours porte son numéro, celui du grand défi ne porte pas de numéro", () => {
  assertEquals([nomDuDefiOuvert(defiNumero2), nomDuDefiOuvert(grandDefiDesMaths)], ["Défi 2", "Grand défi"]);
});
