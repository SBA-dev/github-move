import { assertEquals, assertThrows } from "@std/assert";
import { NombreDEtoilesInvalide, totalDesEtoiles } from "./cabane.ts";

Deno.test("le total des étoiles d'un profil sans aucune leçon est 0", () => {
  const meilleures = new Map<string, number>();

  assertEquals(totalDesEtoiles(meilleures), 0);
});

Deno.test("le total des étoiles est la somme des meilleures étoiles de toutes les leçons", () => {
  const meilleures = new Map([["lecon-a", 3], ["lecon-b", 2], ["lecon-c", 1]]);

  assertEquals(totalDesEtoiles(meilleures), 6);
});

for (const invalide of [0, 4, 1.5]) {
  Deno.test(`${invalide} étoile(s) pour une leçon n'est pas un nombre d'étoiles valide`, () => {
    const meilleures = new Map([["lecon-a", 2], ["lecon-b", invalide]]);

    assertThrows(() => totalDesEtoiles(meilleures), NombreDEtoilesInvalide);
  });
}
