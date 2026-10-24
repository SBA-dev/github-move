import { assertEquals } from "@std/assert";
import { carteDuCalcul, phraseDuCalcul } from "./phrases-du-calcul.ts";

Deno.test("le personnage guide lit une opération : « 2 + 2 » devient « Combien font 2 plus 2 ? »", () => {
  assertEquals(phraseDuCalcul({ q: "2 + 2", r: 4 }), "Combien font 2 plus 2 ?");
});

Deno.test("les signes − × : se lisent « moins », « fois », « divisé par »", () => {
  assertEquals(phraseDuCalcul({ q: "12 − 5", r: 7 }), "Combien font 12 moins 5 ?");
  assertEquals(phraseDuCalcul({ q: "3 × 4", r: 12 }), "Combien font 3 fois 4 ?");
  assertEquals(phraseDuCalcul({ q: "12 : 3", r: 4 }), "Combien font 12 divisé par 3 ?");
});

Deno.test("dans un complément, les points de suspension se lisent « combien »", () => {
  assertEquals(phraseDuCalcul({ q: "3 + … = 10", r: 7 }), "Combien font 3 plus combien = 10 ?");
});

Deno.test("une question qui n'est pas une opération est lue : « Moitié de 10 : combien ? »", () => {
  assertEquals(phraseDuCalcul({ q: "Moitié de 10", r: 5 }), "Moitié de 10 : combien ?");
});

Deno.test("la carte d'une opération montre « 2 + 2 = ? »", () => {
  assertEquals(carteDuCalcul({ q: "2 + 2", r: 4 }), "2 + 2 = ?");
});

Deno.test("la carte d'un complément est la question telle quelle", () => {
  assertEquals(carteDuCalcul({ q: "3 + … = 10", r: 7 }), "3 + … = 10");
});

Deno.test("la carte d'une question sans signe se termine par « ? »", () => {
  assertEquals(carteDuCalcul({ q: "Moitié de 10", r: 5 }), "Moitié de 10 ?");
});

Deno.test("une fois réussie, la carte d'une opération montre le résultat à la place du « ? »", () => {
  assertEquals(carteDuCalcul({ q: "2 + 2", r: 4 }, 4), "2 + 2 = 4");
});

Deno.test("une fois réussi, la carte d'un complément montre le résultat à la place des points de suspension", () => {
  assertEquals(carteDuCalcul({ q: "3 + … = 10", r: 7 }, 7), "3 + 7 = 10");
});

Deno.test("une fois réussie, la carte d'une question sans signe montre « Moitié de 10 : 5 »", () => {
  assertEquals(carteDuCalcul({ q: "Moitié de 10", r: 5 }, 5), "Moitié de 10 : 5");
});
