import { assertEquals } from "@std/assert";
import { Etoiles } from "./etoiles.ts";

Deno.test("une séance sans erreur donne 3 étoiles", () => {
  assertEquals(Etoiles.depuisErreurs(0).nombre, 3);
});

Deno.test("une séance avec 1 à 3 erreurs donne 2 étoiles", () => {
  assertEquals([1, 2, 3].map((erreurs) => Etoiles.depuisErreurs(erreurs).nombre), [2, 2, 2]);
});

Deno.test("une séance avec 4 erreurs ou plus donne toujours au moins 1 étoile", () => {
  assertEquals([4, 5, 12, 100].map((erreurs) => Etoiles.depuisErreurs(erreurs).nombre), [1, 1, 1, 1]);
});
