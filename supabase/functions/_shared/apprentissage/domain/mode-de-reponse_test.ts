import { assertEquals } from "@std/assert";
import { Niveau } from "../../catalogue/domain/index.ts";
import { choixAutourDuResultat, ModeDeReponse } from "./mode-de-reponse.ts";

Deno.test("au CP, un calcul se répond par choix", () => {
  const mode = ModeDeReponse.pour(Niveau.de("CP"));

  assertEquals(mode, { genre: "choix" });
});

Deno.test("à partir du CE1, un calcul se répond au clavier de cristaux", () => {
  for (const code of ["CE1", "CE2", "CM1", "CM2"]) {
    const mode = ModeDeReponse.pour(Niveau.de(code));

    assertEquals(mode, { genre: "clavierDeCristaux" }, code);
  }
});

Deno.test("les choix autour du résultat 4 sont 4, 5, 3 et 6", () => {
  assertEquals(choixAutourDuResultat(4), [4, 5, 3, 6]);
});

Deno.test("les choix autour du résultat 0 sont dédoublonnés : 0, 1 et 2", () => {
  assertEquals(choixAutourDuResultat(0), [0, 1, 2]);
});
