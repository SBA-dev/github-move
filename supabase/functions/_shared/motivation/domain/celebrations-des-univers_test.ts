import { assert, assertArrayIncludes, assertEquals } from "@std/assert";
import { celebrationDe, type UniversCelebre } from "./celebrations-des-univers.ts";
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

Deno.test("le défi relevé dans l'univers Animaux est fêté par le cri de victoire « Hourra ! » sur la grande victoire", () => {
  const celebration = celebrationDe("defiReleve", "animaux", hasardFixe(0));

  assertEquals(celebration?.univers, "animaux");
  assertEquals(celebration?.moment, "defiReleve");
  assertEquals(celebration?.cri, "Hourra !");
  assertEquals(celebration?.musique, "grandeVictoire");
});

Deno.test("la variante de la célébration Animaux est tirée par le hasard parmi jongle, mange et joues", () => {
  const variantes = [0, 0.5, 0.99].map((tirage) =>
    celebrationDe("defiReleve", "animaux", hasardFixe(tirage))?.variante.cle
  );

  assertEquals(variantes, ["jongle", "mange", "joues"]);
});

Deno.test("le défi relevé dans l'univers Princesses et fées est fêté par le cri de victoire « Magique ! » sur la grande victoire", () => {
  const celebration = celebrationDe("defiReleve", "princesse", hasardFixe(0));

  assertEquals(celebration?.univers, "princesse");
  assertEquals(celebration?.moment, "defiReleve");
  assertEquals(celebration?.cri, "Magique !");
  assertEquals(celebration?.musique, "grandeVictoire");
});

Deno.test("la variante de la célébration Princesses et fées est tirée par le hasard parmi arc, envol et signes", () => {
  const variantes = [0, 0.5, 0.99].map((tirage) =>
    celebrationDe("defiReleve", "princesse", hasardFixe(tirage))?.variante.cle
  );

  assertEquals(variantes, ["arc", "envol", "signes"]);
});

Deno.test("le défi relevé dans l'univers Police est fêté par le cri de victoire « Enquête résolue ! » sur la grande victoire", () => {
  const celebration = celebrationDe("defiReleve", "police", hasardFixe(0));

  assertEquals(celebration?.univers, "police");
  assertEquals(celebration?.moment, "defiReleve");
  assertEquals(celebration?.cri, "Enquête résolue !");
  assertEquals(celebration?.musique, "grandeVictoire");
});

Deno.test("la variante de la célébration Police est tirée par le hasard parmi orchestre, trottinette et danse", () => {
  const variantes = [0, 0.5, 0.99].map((tirage) =>
    celebrationDe("defiReleve", "police", hasardFixe(tirage))?.variante.cle
  );

  assertEquals(variantes, ["orchestre", "trottinette", "danse"]);
});

Deno.test("le domaine publie les clés de variante de chaque univers célébré", () => {
  assertEquals(VARIANTES_DES_UNIVERS, {
    sports: ["glissade", "avion", "danse"],
    danse: ["jete", "ruban", "sauts"],
    animaux: ["jongle", "mange", "joues"],
    princesse: ["arc", "envol", "signes"],
    police: ["orchestre", "trottinette", "danse"],
  });
});

for (const univers of ["sports", "danse", "animaux", "princesse", "police"] as const) {
  Deno.test(`la variante tirée dans l'univers ${univers} appartient aux clés publiées par le domaine`, () => {
    const cle = celebrationDe("defiReleve", univers, hasardFixe(0.5))?.variante.cle;
    const clesPubliees: readonly string[] = VARIANTES_DES_UNIVERS[univers];

    assert(cle !== undefined, `aucune célébration pour l'univers ${univers}`);
    assertArrayIncludes(clesPubliees, [cle], `la variante « ${cle} » n'est pas publiée pour l'univers ${univers}`);
  });
}

Deno.test("chaque univers publié par le domaine a une célébration, dont la première variante publiée est tirée par un hasard à 0", () => {
  for (const univers of Object.keys(VARIANTES_DES_UNIVERS) as UniversCelebre[]) {
    const celebration = celebrationDe("defiReleve", univers, hasardFixe(0));

    assertEquals(celebration?.univers, univers, `l'univers ${univers} n'a pas de célébration`);
    assertEquals(celebration?.variante.cle, VARIANTES_DES_UNIVERS[univers][0]);
  }
});

Deno.test("les clés de variante publiées pour Sports sont typées sur les seules variantes de Sports", () => {
  const clesDesSports: readonly ("glissade" | "avion" | "danse")[] = VARIANTES_DES_UNIVERS.sports;

  assertEquals(clesDesSports.length, 3);
});

for (const cle of ["pompier"] as const) {
  Deno.test(`l'univers ${cle}, pas encore livré, n'a pas de célébration de l'univers : la fin garde la célébration commune`, () => {
    const celebration = celebrationDe("defiReleve", cle, hasardFixe(0));

    assertEquals(celebration, undefined);
  });
}
