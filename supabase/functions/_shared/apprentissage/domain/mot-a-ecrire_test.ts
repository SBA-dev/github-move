import { assertEquals, assertThrows } from "@std/assert";
import { MotIncomplet } from "./erreurs.ts";
import { MotAEcrire } from "./mot-a-ecrire.ts";

Deno.test("un mot dicté a une case à écrire par lettre", () => {
  const mot = MotAEcrire.de("chat");

  assertEquals(mot.cases().map((une) => une.genre), ["aEcrire", "aEcrire", "aEcrire", "aEcrire"]);
});

Deno.test("les tirets d'un mot dicté sont des caractères déjà écrits, à leur place", () => {
  const mot = MotAEcrire.de("arc-en-ciel");

  assertEquals(mot.cases()[3], { genre: "dejaEcrit", caractere: "-" });
  assertEquals(mot.cases()[6], { genre: "dejaEcrit", caractere: "-" });
  assertEquals(mot.cases().length, 11);
});

Deno.test("l'espace, les deux apostrophes et le point sont des caractères déjà écrits", () => {
  const caracteresDejaEcrits = ["à midi", "aujourd'hui", "l’eau", "fin."].map((texte) =>
    MotAEcrire.de(texte).cases().flatMap((une) => une.genre === "dejaEcrit" ? [une.caractere] : [])
  );

  assertEquals(caracteresDejaEcrits, [[" "], ["'"], ["’"], ["."]]);
});

Deno.test("les lettres à écrire d'un mot sont ses lettres en minuscules, sans les caractères déjà écrits", () => {
  assertEquals(MotAEcrire.de("arc-en-ciel").lettresAEcrire(), ["a", "r", "c", "e", "n", "c", "i", "e", "l"]);
  assertEquals(MotAEcrire.de("Paris").lettresAEcrire(), ["p", "a", "r", "i", "s"]);
});

Deno.test("un mot écrit avec les bonnes lettres est juste, caractères déjà écrits compris", () => {
  const correction = MotAEcrire.de("arc-en-ciel").corriger(["a", "r", "c", "e", "n", "c", "i", "e", "l"]);

  assertEquals(correction.juste, true);
});

Deno.test("la correction ne tient pas compte des majuscules", () => {
  assertEquals(MotAEcrire.de("Paris").corriger(["p", "a", "r", "i", "s"]).juste, true);
  assertEquals(MotAEcrire.de("paris").corriger(["P", "A", "R", "I", "S"]).juste, true);
});

Deno.test("un mot mal écrit n'est pas juste et montre la lettre fausse", () => {
  const correction = MotAEcrire.de("chat").corriger(["c", "h", "a", "s"]);

  assertEquals(correction.juste, false);
  assertEquals(correction.lettresFausses, [{ position: 3, lettre: "s" }]);
});

Deno.test("le début juste du mot est gardé jusqu'à la première lettre fausse", () => {
  const correction = MotAEcrire.de("chat").corriger(["c", "h", "a", "s"]);

  assertEquals(correction.lettresGardees, ["c", "h", "a"]);
});

Deno.test("une lettre juste après la première fausse n'est pas montrée fausse ni gardée", () => {
  const correction = MotAEcrire.de("chat").corriger(["c", "x", "a", "x"]);

  assertEquals(correction.lettresFausses.map((fausse) => fausse.position), [1, 3]);
  assertEquals(correction.lettresGardees, ["c"]);
});

Deno.test("un mot dont toutes les lettres sont fausses ne garde rien", () => {
  const correction = MotAEcrire.de("chat").corriger(["b", "x", "y", "z"]);

  assertEquals(correction.lettresGardees, []);
});

Deno.test("corriger un mot avant sa dernière case est refusé", () => {
  assertThrows(() => MotAEcrire.de("chat").corriger(["c", "h", "a"]), MotIncomplet);
});
