import { assertEquals } from "@std/assert";
import { celebrationDe } from "./celebrations-des-univers.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";

Deno.test("le défi relevé dans l'univers Sports est fêté par le cri de victoire « BUT ! » sur la grande victoire", () => {
  const celebration = celebrationDe("defiReleve", "sports", hasardFixe(0));

  assertEquals(celebration?.univers, "sports");
  assertEquals(celebration?.moment, "defiReleve");
  assertEquals(celebration?.cri, "BUT !");
  assertEquals(celebration?.musique, "grandeVictoire");
});

Deno.test("la variante de la célébration Sports est tirée par le hasard parmi glissade, avion et danse", () => {
  const variantes = [0, 0.5, 0.99].map((tirage) =>
    celebrationDe("defiReleve", "sports", hasardFixe(tirage))?.variante.cle
  );

  assertEquals(variantes, ["glissade", "avion", "danse"]);
});
