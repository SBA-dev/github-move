import { assertEquals, assertNotEquals } from "@std/assert";
import { CleDeLaPhrase } from "./cle-de-la-phrase.ts";

Deno.test("la clé d'une phrase simple est la phrase elle-même", () => {
  assertEquals(CleDeLaPhrase.de("Bravo !").valeur, "Bravo !");
});

Deno.test("l'apostrophe typographique et l'apostrophe droite donnent la même clé", () => {
  assertEquals(
    CleDeLaPhrase.de("C’est l’heure").valeur,
    CleDeLaPhrase.de("C'est l'heure").valeur,
  );
  assertEquals(CleDeLaPhrase.de("C’est l’heure").valeur, "C'est l'heure");
});

Deno.test("les espaces insécables et fines insécables valent une espace simple", () => {
  assertEquals(
    CleDeLaPhrase.de("Bravo ! ").valeur,
    "Bravo !",
  );
});

Deno.test("les espaces en trop, au début, à la fin et répétées, sont retirées", () => {
  assertEquals(
    CleDeLaPhrase.de("  Bonjour   les  amis ").valeur,
    "Bonjour les amis",
  );
});

Deno.test("une lettre accentuée décomposée et composée donnent la même clé", () => {
  assertEquals(
    CleDeLaPhrase.de("Écoute").valeur,
    CleDeLaPhrase.de("Écoute").valeur,
  );
});

Deno.test("deux écritures qui ne diffèrent que par ces détails ont la même clé", () => {
  const typographique = CleDeLaPhrase.de("C’est l’heure !");
  const simple = CleDeLaPhrase.de("C'est l'heure !");

  assertEquals(typographique.valeur, simple.valeur);
  assertEquals(typographique.egale(simple), true);
});

Deno.test("la casse est gardée : « bravo ! » et « Bravo ! » ont des clés différentes", () => {
  assertNotEquals(
    CleDeLaPhrase.de("bravo !").valeur,
    CleDeLaPhrase.de("Bravo !").valeur,
  );
});

Deno.test("la ponctuation est gardée : « Bravo ! » et « Bravo. » ont des clés différentes", () => {
  const clePointExclamation = CleDeLaPhrase.de("Bravo !");

  assertEquals(clePointExclamation.egale(CleDeLaPhrase.de("Bravo.")), false);
});
