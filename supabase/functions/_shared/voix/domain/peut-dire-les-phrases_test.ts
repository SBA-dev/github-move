import { assertEquals } from "@std/assert";
import { repertoireDeTest } from "../test_utils/repertoire-de-test.ts";
import { cleDePhrase } from "./cle-de-phrase.ts";
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

Deno.test("sans voix de l'appareil, des phrases toutes au répertoire peuvent être dites", () => {
  const repertoire = repertoireDeTest({ [cleDePhrase("lapin")]: { normale: "lapin.mp3" } });

  const peutLesDire = peutDireLesPhrases({
    textes: ["lapin"],
    allure: "normale",
    repertoire,
    syntheseVocalePresente: false,
  });

  assertEquals(peutLesDire, true);
});

Deno.test("à l'allure lente, une phrase sans MP3 lent ne peut pas être dite", () => {
  const repertoire = repertoireDeTest({ [cleDePhrase("lapin")]: { normale: "lapin.mp3" } });

  const peutLesDire = peutDireLesPhrases({
    textes: ["lapin"],
    allure: "lente",
    repertoire,
    syntheseVocalePresente: false,
  });

  assertEquals(peutLesDire, false);
});

Deno.test("avec la synthèse vocale, des phrases absentes du répertoire peuvent être dites", () => {
  const repertoireVide = repertoireDeTest({});

  const peutLesDire = peutDireLesPhrases({
    textes: ["lapin"],
    allure: "normale",
    repertoire: repertoireVide,
    syntheseVocalePresente: true,
  });

  assertEquals(peutLesDire, true);
});
