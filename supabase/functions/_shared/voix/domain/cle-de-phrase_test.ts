import { assertEquals } from "@std/assert";
import cas from "../../../../../docs/voix/cas-des-cles-de-phrases.json" with {
  type: "json",
};
import { empreinteFnv1a64, phrasesAvecCle } from "./cle-de-phrase.ts";

type CasDeCle = {
  readonly brut: string;
  readonly phrases: readonly { readonly texte: string; readonly cle: string }[];
};

for (const { brut, phrases } of cas as readonly CasDeCle[]) {
  Deno.test(`les phrases et leurs clés de « ${brut} » sont celles du jeu de cas partagé`, () => {
    assertEquals(phrasesAvecCle(brut), phrases);
  });
}

Deno.test("la clé d'un texte vide est la base de FNV-1a 64 bits", () => {
  assertEquals(empreinteFnv1a64(""), "cbf29ce484222325");
});

Deno.test("la clé du texte « a » est le vecteur connu de FNV-1a 64 bits", () => {
  assertEquals(empreinteFnv1a64("a"), "af63dc4c8601ec8c");
});
