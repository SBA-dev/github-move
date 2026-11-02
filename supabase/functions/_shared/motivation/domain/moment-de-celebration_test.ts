import { assertEquals } from "@std/assert";
import { momentDeCelebrationDeLaFin } from "./moment-de-celebration.ts";

Deno.test("un défi relevé pour la première fois est un moment de célébration", () => {
  const moment = momentDeCelebrationDeLaFin({ defiRelevePourLaPremiereFois: true });

  assertEquals(moment, "defiReleve");
});

Deno.test("un défi rejoué, déjà relevé, n'a pas de moment de célébration", () => {
  const moment = momentDeCelebrationDeLaFin({ defiRelevePourLaPremiereFois: false });

  assertEquals(moment, undefined);
});
