import { assertEquals, assertThrows } from "@std/assert";
import { lireCleUnivers } from "./cle-univers.ts";
import { UniversInconnu } from "./erreurs.ts";

for (const cle of ["princesse", "animaux", "sports", "police", "pompier", "danse"]) {
  Deno.test(`la clé « ${cle} » est celle d'un univers de Motivation`, () => {
    assertEquals(lireCleUnivers(cle), cle);
  });
}

for (const inconnue of ["pirates", "Danse", "", "pompiers"]) {
  Deno.test(`la clé « ${inconnue} » n'est celle d'aucun univers : l'univers est inconnu`, () => {
    assertThrows(() => lireCleUnivers(inconnue), UniversInconnu);
  });
}
