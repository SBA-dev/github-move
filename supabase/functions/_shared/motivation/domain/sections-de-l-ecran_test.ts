import { assertEquals } from "@std/assert";
import type { PastilleDeRecord } from "./records-de-calcul-rapide.ts";
import { sectionsAAfficher, sectionsDeLEcran } from "./sections-de-l-ecran.ts";

Deno.test("la seule section disponible est affichée seule", () => {
  const sections = sectionsAAfficher(["recordsDeFluence"]);

  assertEquals(sections, ["recordsDeFluence"]);
});

Deno.test("les sections disponibles sont rangées dans l'ordre cabane, histoire, badges, records de fluence", () => {
  const sections = sectionsAAfficher(["recordsDeFluence", "cabane", "badges"]);

  assertEquals(sections, ["cabane", "badges", "recordsDeFluence"]);
});

Deno.test("sans section disponible, rien n'est affiché", () => {
  const sections = sectionsAAfficher([]);

  assertEquals(sections, []);
});

const pastille: PastilleDeRecord = {
  lecon: "cp-calcul-addition",
  exercice: "fluence-1",
  libelle: "Additions",
  meilleurScore: 12,
};

Deno.test("sans pastille de record, la section des records n'est pas affichée", () => {
  const sections = sectionsDeLEcran([]);

  assertEquals(sections, []);
});

Deno.test("avec au moins une pastille de record, la section des records de fluence est affichée", () => {
  const sections = sectionsDeLEcran([pastille]);

  assertEquals(sections, ["recordsDeFluence"]);
});
