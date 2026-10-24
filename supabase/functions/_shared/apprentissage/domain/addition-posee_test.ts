import { assertEquals } from "@std/assert";
import { AdditionPosee } from "./addition-posee.ts";

Deno.test("une addition posée a autant de colonnes que de chiffres de la somme, de droite à gauche", () => {
  const addition = AdditionPosee.depuis([45, 37]);

  assertEquals(addition.colonnes.map((c) => c.rang), ["unites", "dizaines"]);
});

Deno.test("une somme à trois chiffres donne une colonne des centaines", () => {
  const addition = AdditionPosee.depuis([45, 65]);

  assertEquals(addition.colonnes.map((c) => c.rang), [
    "unites",
    "dizaines",
    "centaines",
  ]);
});

Deno.test("les colonnes unités, dizaines et centaines sont bleue, rose et verte", () => {
  const addition = AdditionPosee.depuis([45, 65]);

  assertEquals(addition.colonnes.map((c) => c.couleur), [
    "bleue",
    "rose",
    "verte",
  ]);
});

Deno.test("chaque nombre donne ses chiffres dans la colonne de son rang", () => {
  const addition = AdditionPosee.depuis([45, 37]);

  assertEquals(addition.colonnes.map((c) => c.chiffres), [[5, 7], [4, 3]]);
});

Deno.test("un nombre à un chiffre ne donne que son chiffre des unités", () => {
  const addition = AdditionPosee.depuis([28, 8]);

  assertEquals(addition.colonnes.map((c) => c.chiffres), [[8, 8], [2]]);
});
