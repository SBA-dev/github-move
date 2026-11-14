import { assertEquals } from "@std/assert";
import { repertoireDeTest } from "../test_utils/repertoire-de-test.ts";
import { peutDireLesPhrases } from "./peut-dire-les-phrases.ts";

Deno.test("sans voix de l'appareil, des phrases absentes du répertoire ne peuvent pas être dites", () => {
  const repertoireVide = repertoireDeTest({});

  const peutLesDire = peutDireLesPhrases({
    textes: ["lapin"],
    allure: "normale",
    repertoire: repertoireVide,
    syntheseVocalePresente: false,
  });

  assertEquals(peutLesDire, false);
});
