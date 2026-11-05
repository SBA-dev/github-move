import { assertEquals } from "@std/assert";
import { celebrationDeLaFin } from "./celebration-de-la-fin.ts";
import { celebrationDe } from "./celebrations-des-univers.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { PALIERS_DES_TENUES } from "./tenues.ts";

Deno.test("le premier défi relevé dans l'univers Sports se fête par la célébration de l'univers, variante tirée par le hasard", () => {
  const celebration = celebrationDeLaFin(
    { defiRelevePourLaPremiereFois: true, matiereReussieParLaSeance: false, tenueRecue: undefined },
    "sports",
    hasardFixe(0.5),
  );

  assertEquals(celebration, {
    sorte: "univers",
    celebration: celebrationDe("defiReleve", "sports", hasardFixe(0.5))!,
  });
});

Deno.test("un défi rejoué dans l'univers Sports garde la célébration commune", () => {
  const celebration = celebrationDeLaFin(
    { defiRelevePourLaPremiereFois: false, matiereReussieParLaSeance: false, tenueRecue: undefined },
    "sports",
    hasardFixe(0.5),
  );

  assertEquals(celebration, { sorte: "commune" });
});

Deno.test("le premier défi relevé dans l'univers Pompiers joue la célébration de Capitaine Sam", () => {
  const celebration = celebrationDeLaFin(
    { defiRelevePourLaPremiereFois: true, matiereReussieParLaSeance: false, tenueRecue: undefined },
    "pompier",
    hasardFixe(0.5),
  );

  assertEquals(celebration, {
    sorte: "univers",
    celebration: celebrationDe("defiReleve", "pompier", hasardFixe(0.5))!,
  });
});

Deno.test("une matière réussie dans l'univers Sports se fête par la célébration de l'univers", () => {
  const celebration = celebrationDeLaFin(
    { defiRelevePourLaPremiereFois: false, matiereReussieParLaSeance: true, tenueRecue: undefined },
    "sports",
    hasardFixe(0.5),
  );

  assertEquals(celebration, {
    sorte: "univers",
    celebration: celebrationDe("matiereReussie", "sports", hasardFixe(0.5))!,
  });
});

Deno.test("une matière réussie dans l'univers Pompiers se fête par la célébration de l'univers", () => {
  const celebration = celebrationDeLaFin(
    { defiRelevePourLaPremiereFois: false, matiereReussieParLaSeance: true, tenueRecue: undefined },
    "pompier",
    hasardFixe(0.5),
  );

  assertEquals(celebration, {
    sorte: "univers",
    celebration: celebrationDe("matiereReussie", "pompier", hasardFixe(0.5))!,
  });
});

Deno.test("une tenue reçue dans l'univers Sports se fête par la célébration de l'univers au moment de la tenue reçue", () => {
  const celebration = celebrationDeLaFin(
    {
      defiRelevePourLaPremiereFois: false,
      matiereReussieParLaSeance: false,
      tenueRecue: PALIERS_DES_TENUES[0].tenue,
    },
    "sports",
    hasardFixe(0.5),
  );

  assertEquals(celebration, {
    sorte: "univers",
    celebration: celebrationDe("tenueRecue", "sports", hasardFixe(0.5))!,
  });
});
