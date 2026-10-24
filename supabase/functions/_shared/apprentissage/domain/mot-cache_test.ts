import { assertEquals } from "@std/assert";
import { motCache } from "./mot-cache.ts";

const cas: Array<[string, string | undefined]> = [
  ["Au clair de la lune,", "clair"],
  ["Mon ami Pierrot,", "Pierrot"],
  ["Ma chandelle est morte,", "chandelle"],
  ["Pour l'amour de Dieu.", "amour"],
  ["Prête-moi ta plume", "Prête-moi"],
  ["Je n'ai plus de feu.", "plus"],
  ["Le soleil brille", "soleil"],
  ["Les oiseaux chantent", "chantent"],
  ["Voilà l'éclair qui luit.", "éclair"],
  ["Ce reste de jour dont s'éclaire", "éclaire"],
  ["Il a vu.", undefined],
];

for (const [vers, attendu] of cas) {
  Deno.test(`le mot caché du vers « ${vers} » est ${attendu ?? "absent"}`, () => {
    assertEquals(motCache(vers), attendu);
  });
}

Deno.test("l'élision en majuscule ou avec une apostrophe typographique n'entre pas dans le mot caché", () => {
  assertEquals(motCache("L’amour Qu’il"), "amour");
});

Deno.test("un mot comme aujourd'hui reste entier", () => {
  assertEquals(motCache("Il est là aujourd'hui"), "aujourd'hui");
});
