import { assertEquals } from "@std/assert";
import type { FormeDeSchema } from "../../catalogue/domain/index.ts";
import { descriptionDuSchema } from "./description-du-schema.ts";

Deno.test("la description d'un schéma en parties et tout, dont le tout est cherché, le lit « ? »", () => {
  const forme: FormeDeSchema = { genre: "partiesEtTout", parties: [4, 2], tout: null };

  assertEquals(descriptionDuSchema(forme), "Le tout : ?. Une partie : 4. L'autre partie : 2.");
});

Deno.test("la description d'un schéma en parties et tout, dont une partie est cherchée, lit cette partie « ? »", () => {
  const forme: FormeDeSchema = { genre: "partiesEtTout", parties: [6, null], tout: 9 };

  assertEquals(descriptionDuSchema(forme), "Le tout : 9. Une partie : 6. L'autre partie : ?.");
});

Deno.test("la description d'un schéma en comparaison, dont le grand est cherché, nomme les barres", () => {
  const forme: FormeDeSchema = { genre: "comparaison", grand: null, petit: 9, ecart: 4, noms: ["sa sœur", "Sam"] };

  assertEquals(descriptionDuSchema(forme), "sa sœur : ?. Sam : 9. L'écart : 4.");
});

Deno.test("la description d'un schéma en comparaison, dont l'écart est cherché, lit l'écart « ? »", () => {
  const forme: FormeDeSchema = { genre: "comparaison", grand: 43, petit: 37, ecart: null, noms: ["Lucie", "Léo"] };

  assertEquals(descriptionDuSchema(forme), "Lucie : 43. Léo : 37. L'écart : ?.");
});

Deno.test("la description d'un schéma en parts, dont la valeur d'une part est cherchée, lit « ? » pour chaque part", () => {
  const forme: FormeDeSchema = { genre: "parts", nb: 3, valeur: null, total: 12 };

  assertEquals(descriptionDuSchema(forme), "Le total : 12. 3 parts. Chaque part : ?.");
});

Deno.test("la description d'un schéma en parts, dont le total est cherché, lit le total « ? »", () => {
  const forme: FormeDeSchema = { genre: "parts", nb: 4, valeur: 5, total: null };

  assertEquals(descriptionDuSchema(forme), "Le total : ?. 4 parts. Chaque part : 5.");
});

Deno.test("la description d'un schéma en parts, dont le nombre de parts est cherché, lit ce nombre « ? »", () => {
  const forme: FormeDeSchema = { genre: "parts", nb: null, valeur: 3, total: 18 };

  assertEquals(descriptionDuSchema(forme), "Le total : 18. Nombre de parts : ?. Chaque part : 3.");
});
