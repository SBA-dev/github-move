import { assert, assertArrayIncludes, assertEquals } from "@std/assert";
import { celebrationDe, type UniversCelebre } from "./celebrations-des-univers.ts";
import { UNIVERS } from "./univers.ts";
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

Deno.test("le défi relevé dans l'univers Danse est fêté par le cri de victoire « Bravo ! »", () => {
  const celebration = celebrationDe("defiReleve", "danse", hasardFixe(0));

  assertEquals(celebration?.univers, "danse");
  assertEquals(celebration?.moment, "defiReleve");
  assertEquals(celebration?.cri, "Bravo !");
});

Deno.test("la variante de la célébration Danse est tirée par le hasard parmi jeté, ruban et sauts", () => {
  const variantes = [0, 0.5, 0.99].map((tirage) =>
    celebrationDe("defiReleve", "danse", hasardFixe(tirage))?.variante.cle
  );

  assertEquals(variantes, ["jete", "ruban", "sauts"]);
});

Deno.test("le défi relevé dans l'univers Animaux est fêté par le cri de victoire « Hourra ! »", () => {
  const celebration = celebrationDe("defiReleve", "animaux", hasardFixe(0));

  assertEquals(celebration?.univers, "animaux");
  assertEquals(celebration?.moment, "defiReleve");
  assertEquals(celebration?.cri, "Hourra !");
});

Deno.test("la variante de la célébration Animaux est tirée par le hasard parmi jongle, mange et joues", () => {
  const variantes = [0, 0.5, 0.99].map((tirage) =>
    celebrationDe("defiReleve", "animaux", hasardFixe(tirage))?.variante.cle
  );

  assertEquals(variantes, ["jongle", "mange", "joues"]);
});

Deno.test("le défi relevé dans l'univers Princesses et fées est fêté par le cri de victoire « Magique ! »", () => {
  const celebration = celebrationDe("defiReleve", "princesse", hasardFixe(0));

  assertEquals(celebration?.univers, "princesse");
  assertEquals(celebration?.moment, "defiReleve");
  assertEquals(celebration?.cri, "Magique !");
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

Deno.test("le défi relevé dans l'univers Pompiers est fêté par le cri de victoire « Mission accomplie ! »", () => {
  const celebration = celebrationDe("defiReleve", "pompier", hasardFixe(0));

  assertEquals(celebration?.univers, "pompier");
  assertEquals(celebration?.moment, "defiReleve");
  assertEquals(celebration?.cri, "Mission accomplie !");
});

Deno.test("la variante de la célébration Pompiers est tirée par le hasard parmi cloche, arc et pluie", () => {
  const variantes = [0, 0.5, 0.99].map((tirage) =>
    celebrationDe("defiReleve", "pompier", hasardFixe(tirage))?.variante.cle
  );

  assertEquals(variantes, ["cloche", "arc", "pluie"]);
});

Deno.test("le domaine publie les clés de variante de chaque univers célébré", () => {
  assertEquals(VARIANTES_DES_UNIVERS, {
    sports: ["glissade", "avion", "danse"],
    danse: ["jete", "ruban", "sauts"],
    animaux: ["jongle", "mange", "joues"],
    princesse: ["arc", "envol", "signes"],
    police: ["orchestre", "trottinette", "danse"],
    pompier: ["cloche", "arc", "pluie"],
  });
});

for (const univers of ["sports", "danse", "animaux", "princesse", "police", "pompier"] as const) {
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

for (const { cle } of UNIVERS) {
  Deno.test(`l'univers ${cle} a une célébration de l'univers`, () => {
    const celebration = celebrationDe("defiReleve", cle, hasardFixe(0));

    assertEquals(celebration?.univers, cle);
  });
}

const EFFETS_SONORES_EXISTANTS: readonly string[] = [
  "reponseJuste",
  "reponseFausse",
  "pointDuRecipient",
  "texteComplet",
  "seanceTerminee",
  "grandeVictoire",
  "decouverte",
  "boutonTouche",
];

const MUSIQUES_ATTENDUES: readonly (readonly [UniversCelebre, string])[] = [
  ["danse", "airDeSaxophone"],
  ["animaux", "airDeCordesPincees"],
  ["princesse", "airDeSteelDrumCourt"],
  ["pompier", "airDeSteelDrumLong"],
  ["sports", "grandeVictoire"],
  ["police", "grandeVictoire"],
];

for (const [univers, attendue] of MUSIQUES_ATTENDUES) {
  Deno.test(`la célébration de l'univers ${univers} joue la musique « ${attendue} »`, () => {
    const musique: string | undefined = celebrationDe("defiReleve", univers, hasardFixe(0))?.musique;

    assertEquals(musique, attendue);
  });
}

Deno.test("les musiques propres aux univers sont distinctes entre elles et des effets sonores existants", () => {
  const musiques: string[] = UNIVERS.map(({ cle }) => celebrationDe("defiReleve", cle, hasardFixe(0)).musique);
  const propres = musiques.filter((musique) => musique !== "grandeVictoire");

  assertEquals(propres.length, 4);
  assertEquals(new Set(propres).size, propres.length);
  assertEquals(propres.filter((musique) => EFFETS_SONORES_EXISTANTS.includes(musique)), []);
});
