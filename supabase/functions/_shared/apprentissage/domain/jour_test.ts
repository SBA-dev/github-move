import { assertEquals, assertFalse, assertThrows } from "@std/assert";
import { JourInvalide } from "./erreurs.ts";
import { Jour } from "./jour.ts";

Deno.test("un jour se construit à partir d'une date AAAA-MM-JJ et la redonne en texte", () => {
  assertEquals(Jour.de("2026-10-25").toString(), "2026-10-25");
});

Deno.test("un jour refuse une chaîne qui n'est pas au format AAAA-MM-JJ", () => {
  for (const texte of ["", "25/10/2026", "2026-1-5", "2026-10-25T10:00", "demain"]) {
    assertThrows(() => Jour.de(texte), JourInvalide);
  }
});

Deno.test("un jour refuse une date qui n'existe pas dans le calendrier", () => {
  for (const texte of ["2026-02-30", "2026-13-01", "2026-00-10", "2026-04-31", "2025-02-29"]) {
    assertThrows(() => Jour.de(texte), JourInvalide);
  }
});

Deno.test("le 29 février existe les années bissextiles", () => {
  assertEquals(Jour.de("2028-02-29").toString(), "2028-02-29");
});

Deno.test("plus(n) donne le jour n jours plus tard dans le même mois", () => {
  assertEquals(Jour.de("2026-10-25").plus(3).toString(), "2026-10-28");
});

Deno.test("plus(n) change de mois quand le mois se termine", () => {
  assertEquals(Jour.de("2026-10-30").plus(3).toString(), "2026-11-02");
});

Deno.test("plus(n) change d'année à la fin de décembre", () => {
  assertEquals(Jour.de("2026-12-31").plus(1).toString(), "2027-01-01");
});

Deno.test("plus(n) passe par le 29 février d'une année bissextile", () => {
  assertEquals(Jour.de("2028-02-28").plus(1).toString(), "2028-02-29");
  assertEquals(Jour.de("2028-02-28").plus(2).toString(), "2028-03-01");
});

Deno.test("plus(n) saute le 29 février d'une année non bissextile", () => {
  assertEquals(Jour.de("2027-02-28").plus(1).toString(), "2027-03-01");
});

Deno.test("plus(0) donne le même jour", () => {
  assertEquals(Jour.de("2026-10-25").plus(0).toString(), "2026-10-25");
});

Deno.test("plus(7) ne modifie pas le jour d'origine", () => {
  const jour = Jour.de("2026-10-25");
  jour.plus(7);
  assertEquals(jour.toString(), "2026-10-25");
});

Deno.test("un jour est avant ou égal à un jour plus tard, y compris d'un mois à l'autre", () => {
  assertEquals(Jour.de("2026-10-25").estAvantOuEgal(Jour.de("2026-10-26")), true);
  assertEquals(Jour.de("2026-12-31").estAvantOuEgal(Jour.de("2027-01-01")), true);
});

Deno.test("un jour est avant ou égal à lui-même", () => {
  assertEquals(Jour.de("2026-10-25").estAvantOuEgal(Jour.de("2026-10-25")), true);
});

Deno.test("un jour n'est pas avant ou égal à un jour plus ancien", () => {
  assertFalse(Jour.de("2026-10-26").estAvantOuEgal(Jour.de("2026-10-25")));
  assertFalse(Jour.de("2027-01-01").estAvantOuEgal(Jour.de("2026-12-31")));
});

Deno.test("deux jours de même date sont égaux, deux jours différents ne le sont pas", () => {
  assertEquals(Jour.de("2026-10-25").estEgalA(Jour.de("2026-10-25")), true);
  assertEquals(Jour.de("2026-10-25").estEgalA(Jour.de("2026-10-26")), false);
});
