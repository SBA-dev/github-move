import { assertEquals } from "@std/assert";
import { indicationDuGeste } from "../index.ts";

Deno.test("en classer, l'indication du geste dit de glisser ou de toucher l'étiquette puis une maison", () => {
  assertEquals(indicationDuGeste("classer"), "Fais glisser chaque étiquette, ou touche-la puis touche une maison.");
});

Deno.test("en ordre, l'indication du geste dit de toucher d'abord celle qui vient en premier", () => {
  assertEquals(indicationDuGeste("ordre"), "Touche d'abord celle qui vient en premier.");
});

Deno.test("les autres types d'exercice n'ont pas d'indication du geste", () => {
  assertEquals(indicationDuGeste("bulles"), undefined);
});

Deno.test("en mémoriser, l'indication du geste de l'ordre des vers dit de toucher d'abord celui qui vient en premier", () => {
  assertEquals(indicationDuGeste("memoriser"), "Touche d'abord celle qui vient en premier.");
});
