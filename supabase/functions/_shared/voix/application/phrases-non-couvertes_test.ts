import { assertEquals } from "@std/assert";
import { repertoireDeTest } from "../test_utils/repertoire-de-test.ts";
import type { PhraseAFabriquer } from "./phrases-a-fabriquer.ts";
import { phrasesNonCouvertes } from "./phrases-non-couvertes.ts";

const phrase = (cle: string, allures?: readonly ["normale", "lente"]): PhraseAFabriquer => ({
  cle,
  phrase: "Bravo, on continue !",
  niveau: "commun",
  lecons: [],
  ...(allures === undefined ? {} : { allures }),
});

Deno.test("une phrase dont la clé est absente du répertoire n'est pas couverte", () => {
  const repertoire = repertoireDeTest({});
  const absente = phrase("cle-absente");

  assertEquals(phrasesNonCouvertes([absente], repertoire), [absente]);
});

Deno.test("une phrase à dire à l'allure lente sans MP3 lent au répertoire n'est pas couverte", () => {
  const repertoire = repertoireDeTest({ "cle-a-dire-lentement": { normale: "a.mp3" } });
  const phraseLente = phrase("cle-a-dire-lentement", ["normale", "lente"]);

  assertEquals(phrasesNonCouvertes([phraseLente], repertoire), [phraseLente]);
});

Deno.test("une phrase à dire à l'allure lente avec son MP3 lent au répertoire est couverte", () => {
  const repertoire = repertoireDeTest({ "cle-a-dire-lentement": { normale: "a.mp3", lente: "a-lente.mp3" } });

  assertEquals(phrasesNonCouvertes([phrase("cle-a-dire-lentement", ["normale", "lente"])], repertoire), []);
});

Deno.test("une phrase sans allure lente dont la clé est au répertoire est couverte", () => {
  const repertoire = repertoireDeTest({ "cle-presente": { normale: "p.mp3" } });

  assertEquals(phrasesNonCouvertes([phrase("cle-presente")], repertoire), []);
});
