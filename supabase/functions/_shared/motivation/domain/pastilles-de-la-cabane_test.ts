import { assertEquals } from "@std/assert";
import { cabaneDe, PALIERS_DE_LA_CABANE } from "./cabane.ts";
import { pastillesDeLaCabane } from "./pastilles-de-la-cabane.ts";

Deno.test("à 6 étoiles, les deux premières pastilles sont atteintes et les suivantes affichent leur seuil", () => {
  const pastilles = pastillesDeLaCabane(cabaneDe(6));

  assertEquals(pastilles.length, PALIERS_DE_LA_CABANE.length);
  assertEquals(pastilles[0], {
    cle: "lanterne",
    libelle: "une lanterne",
    libelleLu: "une lanterne",
    atteint: true,
  });
  assertEquals(pastilles[1], {
    cle: "tapis",
    libelle: "un tapis tout doux",
    libelleLu: "un tapis tout doux",
    atteint: true,
  });
  assertEquals(pastilles[2], {
    cle: "pot-de-fleurs",
    libelle: "10 ★",
    libelleLu: "10 étoiles",
    atteint: false,
  });
  assertEquals(pastilles[11], {
    cle: "etoile-magique",
    libelle: "75 ★",
    libelleLu: "75 étoiles",
    atteint: false,
  });
});

Deno.test("à 75 étoiles, toutes les pastilles de la cabane sont atteintes", () => {
  const pastilles = pastillesDeLaCabane(cabaneDe(75));

  assertEquals(pastilles.map((pastille) => pastille.atteint), Array(12).fill(true));
});

Deno.test("à 0 étoile, aucune pastille de la cabane n'est atteinte", () => {
  const pastilles = pastillesDeLaCabane(cabaneDe(0));

  assertEquals(pastilles.some((pastille) => pastille.atteint), false);
});
