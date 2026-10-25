import { assertEquals, assertThrows } from "@std/assert";
import { CleDeQuestion } from "./cle-de-question.ts";
import { CleDeQuestionInvalide } from "./erreurs.ts";
import type { TypeDeQuestion } from "./question-suivie.ts";

Deno.test("la clé d'une question de bulles commence par « b: » et normalise le texte", () => {
  assertEquals(CleDeQuestion.de("bulles", "  Été   Là ?").valeur, "b:ete la ?");
});

Deno.test("la clé d'une question de lecture commence par « l: »", () => {
  assertEquals(CleDeQuestion.de("lecture", "Où dort Plume ?").valeur, "l:ou dort plume ?");
});

Deno.test("la clé d'une question d'écoute commence par « e: »", () => {
  assertEquals(CleDeQuestion.de("ecoute", "Cat").valeur, "e:cat");
});

Deno.test("deux types de question n'ont jamais le même préfixe de clé", () => {
  const types: TypeDeQuestion[] = [
    "bulles",
    "lecture",
    "ecoute",
    "trous",
    "conjugaison",
    "classer",
    "ordre",
    "chiffre",
    "calcul",
    "colonne",
    "fluence",
    "dictee",
  ];

  const prefixes = types.map((type) => CleDeQuestion.de(type, "x").valeur.replace(/x$/, ""));

  assertEquals(new Set(prefixes).size, types.length);
});

Deno.test("une clé sérialisée redevient la clé d'origine, pour chaque forme de clé", () => {
  const cles = [
    CleDeQuestion.de("bulles", "Combien font 3 + 4 ?"),
    CleDeQuestion.de("classer", "Classer les sons"),
    CleDeQuestion.de("calcul", "12 + 7"),
    CleDeQuestion.de("dictee", "Le chat dort"),
    CleDeQuestion.de("ecoute", "Été"),
  ];

  assertEquals(cles.map((cle) => CleDeQuestion.depuisLaValeur(cle.valeur)), cles);
});

Deno.test("une valeur de clé vide, sans préfixe connu ou sans texte est refusée", () => {
  for (const valeur of ["", "cat", "z:cat", "b:", "b: "]) {
    assertThrows(() => CleDeQuestion.depuisLaValeur(valeur), CleDeQuestionInvalide);
  }
});

Deno.test("une valeur de clé qui n'est pas normalisée est refusée", () => {
  for (const valeur of ["b:Cat", "e:été", "b:deux  espaces", "b: cat"]) {
    assertThrows(() => CleDeQuestion.depuisLaValeur(valeur), CleDeQuestionInvalide);
  }
});
