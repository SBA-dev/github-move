import { assertEquals, assertThrows } from "@std/assert";
import { niveau, NIVEAUX } from "./niveau.ts";
import { NiveauInconnu } from "./erreurs.ts";

Deno.test("les niveaux de l'école élémentaire vont du CP au CM2", () => {
  assertEquals([...NIVEAUX], ["CP", "CE1", "CE2", "CM1", "CM2"]);
});

for (const attendu of ["CP", "CE1", "CE2", "CM1", "CM2"]) {
  Deno.test(`le niveau ${attendu} est accepté`, () => {
    assertEquals(niveau(attendu), attendu);
  });
}

for (const refuse of ["6e", "cp", "", "CM3"]) {
  Deno.test(`« ${refuse} » n'est pas un niveau`, () => {
    assertThrows(() => niveau(refuse), NiveauInconnu);
  });
}

Deno.test("une valeur qui n'est pas un texte n'est pas un niveau", () => {
  assertThrows(() => niveau(3), NiveauInconnu);
});
