import { assertEquals } from "@std/assert";
import { sectionsAAfficher } from "./sections-de-l-ecran.ts";

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
