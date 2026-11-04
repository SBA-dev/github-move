import { assertEquals } from "@std/assert";
import { celebrationDe } from "./celebrations-des-univers.ts";
import { VARIANTES_DES_UNIVERS } from "./index.ts";
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

Deno.test("le défi relevé dans l'univers Danse est fêté par le cri de victoire « Bravo ! » sur la grande victoire", () => {
  const celebration = celebrationDe("defiReleve", "danse", hasardFixe(0));

  assertEquals(celebration?.univers, "danse");
  assertEquals(celebration?.moment, "defiReleve");
  assertEquals(celebration?.cri, "Bravo !");
  assertEquals(celebration?.musique, "grandeVictoire");
});

Deno.test("la variante de la célébration Danse est tirée par le hasard parmi jeté, ruban et sauts", () => {
  const variantes = [0, 0.5, 0.99].map((tirage) =>
    celebrationDe("defiReleve", "danse", hasardFixe(tirage))?.variante.cle
  );

  assertEquals(variantes, ["jete", "ruban", "sauts"]);
});

Deno.test("le domaine publie les clés de variante de chaque univers célébré", () => {
  assertEquals(VARIANTES_DES_UNIVERS, {
    sports: ["glissade", "avion", "danse"],
    danse: ["jete", "ruban", "sauts"],
  });
});

for (const univers of ["sports", "danse"] as const) {
  Deno.test(`la variante tirée dans l'univers ${univers} appartient aux clés publiées par le domaine`, () => {
    const cle = celebrationDe("defiReleve", univers, hasardFixe(0.5))?.variante.cle;

    assertEquals(cle !== undefined && VARIANTES_DES_UNIVERS[univers].includes(cle), true);
  });
}

for (const cle of ["animaux", "princesse", "police", "pompier"] as const) {
  Deno.test(`l'univers ${cle}, pas encore livré, n'a pas de célébration de l'univers : la fin garde la célébration commune`, () => {
    const celebration = celebrationDe("defiReleve", cle, hasardFixe(0));

    assertEquals(celebration, undefined);
  });
}
