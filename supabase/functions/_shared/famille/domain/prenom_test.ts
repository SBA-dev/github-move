import { assertEquals, assertThrows } from "@std/assert";
import { PrenomObligatoire } from "./erreurs.ts";
import { Prenom } from "./prenom.ts";

Deno.test("un prénom simple est accepté tel quel", () => {
  assertEquals(Prenom.de("Léa").valeur, "Léa");
});

Deno.test("un prénom d'un seul caractère est accepté", () => {
  assertEquals(Prenom.de("A").valeur, "A");
});

Deno.test("un prénom avec des traits d'union est accepté tel quel, à 20 caractères exactement", () => {
  assertEquals(Prenom.de("Marie-Anne-Charlotte").valeur, "Marie-Anne-Charlotte");
});

Deno.test("un pseudo avec des chiffres est accepté tel quel", () => {
  assertEquals(Prenom.de("Zoé2015").valeur, "Zoé2015");
});

Deno.test("les espaces au début et à la fin du prénom sont retirés", () => {
  assertEquals(Prenom.de("  Léa  ").valeur, "Léa");
});

Deno.test("un prénom de plus de 20 caractères est coupé à 20 caractères", () => {
  assertEquals(Prenom.de("Marie-Anne-Charlottes").valeur, "Marie-Anne-Charlotte");
});

Deno.test("les espaces autour sont retirés avant de couper à 20 caractères", () => {
  assertEquals(Prenom.de("   Marie-Anne-Charlottes   ").valeur, "Marie-Anne-Charlotte");
});

Deno.test("un prénom vide est obligatoire", () => {
  assertThrows(() => Prenom.de(""), PrenomObligatoire, "Écris le prénom de l'enfant.");
});

Deno.test("un prénom fait seulement d'espaces est obligatoire", () => {
  assertThrows(() => Prenom.de("    "), PrenomObligatoire);
});
