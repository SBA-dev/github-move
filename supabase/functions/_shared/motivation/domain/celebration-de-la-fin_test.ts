import { assertEquals } from "@std/assert";
import { celebrationDeLaFin } from "./celebration-de-la-fin.ts";
import { celebrationDe } from "./celebrations-des-univers.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";

Deno.test("le premier défi relevé dans l'univers Sports se fête par la célébration de l'univers, variante tirée par le hasard", () => {
  const celebration = celebrationDeLaFin(
    { defiRelevePourLaPremiereFois: true },
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
    { defiRelevePourLaPremiereFois: false },
    "sports",
    hasardFixe(0.5),
  );

  assertEquals(celebration, { sorte: "commune" });
});

Deno.test("le premier défi relevé dans un univers pas encore livré garde la célébration commune", () => {
  const celebration = celebrationDeLaFin(
    { defiRelevePourLaPremiereFois: true },
    "pompier",
    hasardFixe(0.5),
  );

  assertEquals(celebration, { sorte: "commune" });
});
