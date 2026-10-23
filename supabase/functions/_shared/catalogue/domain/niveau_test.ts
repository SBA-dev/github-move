import { assertEquals, assertThrows } from "@std/assert";
import { NiveauInconnu } from "./erreurs.ts";
import { Niveau } from "./niveau.ts";

for (const niveau of ["CP", "CE1", "CE2", "CM1", "CM2"]) {
  Deno.test(`${niveau} est un niveau du Catalogue pédagogique`, () => {
    assertEquals(Niveau.de(niveau).valeur, niveau);
  });
}

for (const inconnu of ["6e", "ce1", "CE1 ", "", "CM3"]) {
  Deno.test(`« ${inconnu} » n'est pas un niveau : il est inconnu`, () => {
    assertThrows(() => Niveau.de(inconnu), NiveauInconnu);
  });
}
