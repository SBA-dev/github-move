import { assertEquals } from "@std/assert";
import { histoireDe } from "./histoire.ts";
import { tuilesDeLHistoire } from "./tuiles-de-l-histoire.ts";

Deno.test("l'histoire montre toujours 20 tuiles, de l'épisode 1 à l'épisode 20", () => {
  const tuiles = tuilesDeLHistoire(histoireDe(0));

  assertEquals(tuiles.map((tuile) => tuile.numero), Array.from({ length: 20 }, (_, i) => i + 1));
});

Deno.test("sans séance terminée, toutes les tuiles sont fermées et à découvrir", () => {
  const tuiles = tuilesDeLHistoire(histoireDe(0));

  assertEquals(tuiles.every((tuile) => !tuile.ouvert && tuile.libelle === "À découvrir"), true);
});

Deno.test("après 2 séances terminées, les tuiles 1 et 2 sont ouvertes avec leur titre", () => {
  const tuiles = tuilesDeLHistoire(histoireDe(2));

  assertEquals(
    tuiles.slice(0, 2).map((tuile) => [tuile.ouvert, tuile.libelle]),
    [[true, "La carte froissée"], [true, "Le premier indice"]],
  );
});

Deno.test("après 2 séances terminées, les tuiles 3 à 20 restent à découvrir", () => {
  const tuiles = tuilesDeLHistoire(histoireDe(2)).slice(2);

  assertEquals(tuiles.every((tuile) => !tuile.ouvert && tuile.libelle === "À découvrir"), true);
});

Deno.test("un lecteur d'écran lit une tuile ouverte avec son numéro et son titre", () => {
  const tuiles = tuilesDeLHistoire(histoireDe(1));

  assertEquals(tuiles[0].libelleLu, "Épisode 1 : La carte froissée");
});

Deno.test("un lecteur d'écran lit une tuile fermée « à découvrir » avec son numéro", () => {
  const tuiles = tuilesDeLHistoire(histoireDe(1));

  assertEquals(tuiles[1].libelleLu, "Épisode 2, à découvrir");
});

Deno.test("au-delà de 20 séances terminées, les 20 tuiles sont ouvertes", () => {
  const tuiles = tuilesDeLHistoire(histoireDe(25));

  assertEquals(tuiles.length, 20);
  assertEquals(tuiles.every((tuile) => tuile.ouvert), true);
});
