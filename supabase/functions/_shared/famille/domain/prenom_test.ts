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

Deno.test("un prénom correspond à sa saisie sans accents, en majuscules ou en minuscules", () => {
  const prenom = Prenom.de("Léa");

  assertEquals(prenom.correspondA(Prenom.de("lea")), true);
  assertEquals(prenom.correspondA(Prenom.de("LÉA")), true);
  assertEquals(prenom.correspondA(Prenom.de("Léa")), true);
});

Deno.test("un prénom accentué correspond à sa saisie sans l'accent final", () => {
  assertEquals(Prenom.de("Chloé").correspondA(Prenom.de("chloe")), true);
});

Deno.test("les espaces autour de la saisie ne comptent pas pour la correspondance", () => {
  assertEquals(Prenom.de("Léa").correspondA(Prenom.de("  lea  ")), true);
});

Deno.test("le trait d'union compte : « marie lou » et « MarieLou » ne correspondent pas à « Marie-Lou »", () => {
  const prenom = Prenom.de("Marie-Lou");

  assertEquals(prenom.correspondA(Prenom.de("marie lou")), false);
  assertEquals(prenom.correspondA(Prenom.de("MarieLou")), false);
});

Deno.test("la ligature compte : « oelia » ne correspond pas à « Œlia » mais « œlia » oui", () => {
  const prenom = Prenom.de("Œlia");

  assertEquals(prenom.correspondA(Prenom.de("oelia")), false);
  assertEquals(prenom.correspondA(Prenom.de("œlia")), true);
});

Deno.test("un prénom plus long ou plus court ne correspond pas à « Léa »", () => {
  const prenom = Prenom.de("Léa");

  assertEquals(prenom.correspondA(Prenom.de("Léane")), false);
  assertEquals(prenom.correspondA(Prenom.de("Lé")), false);
});
