import { assert, assertAlmostEquals, assertEquals } from "@std/assert";
import { InstantsDesMots } from "./instants-des-mots.ts";

const RYTHME_NORMAL = 1;
const RYTHME_LENT = 0.65;

function assertDebutsProches(obtenus: readonly number[], attendus: number[]) {
  assertEquals(obtenus.length, attendus.length);
  attendus.forEach((attendu, i) => assertAlmostEquals(obtenus[i], attendu, 1));
}

Deno.test("une phrase d'un seul mot commence à 0", () => {
  const instants = InstantsDesMots.de("chat", 800, RYTHME_NORMAL);

  assertEquals(instants.debutsMs, [0]);
});

Deno.test("un mot de deux syllabes dure deux fois plus longtemps qu'un mot d'une syllabe", () => {
  const instants = InstantsDesMots.de("le papa lit", 4000, RYTHME_NORMAL);

  assertDebutsProches(instants.debutsMs, [0, 1000, 3000]);
});

Deno.test("la lecture lente étale les instants sur une durée plus longue", () => {
  const normal = InstantsDesMots.de("le papa", 1500, RYTHME_NORMAL);
  const lent = InstantsDesMots.de("le papa", 1500, RYTHME_LENT);

  assert(lent.debutsMs[1] > normal.debutsMs[1]);
});

Deno.test("le rythme divise la durée : à 0,5 la durée effective double", () => {
  const instants = InstantsDesMots.de("le papa", 1500, 0.5);

  assertDebutsProches(instants.debutsMs, [0, 1000]);
});

Deno.test("une ponctuation seule compte pour une syllabe", () => {
  const instants = InstantsDesMots.de("papa ! papa", 5000, RYTHME_NORMAL);

  assertDebutsProches(instants.debutsMs, [0, 2000, 3000]);
});

Deno.test("un nombre en chiffres compte pour une syllabe", () => {
  const instants = InstantsDesMots.de("le 2024 papa", 4000, RYTHME_NORMAL);

  assertDebutsProches(instants.debutsMs, [0, 1000, 2000]);
});

Deno.test("les instants sont croissants, le premier vaut 0 et tous sont avant la fin", () => {
  const dureeMs = 3200;
  const instants = InstantsDesMots.de("la petite maison est jolie", dureeMs, RYTHME_LENT);
  const dureeEffectiveMs = dureeMs / RYTHME_LENT;

  const debuts = instants.debutsMs;
  assertEquals(debuts.length, 5);
  assertEquals(debuts[0], 0);
  debuts.slice(1).forEach((debut, i) => assert(debut > debuts[i]));
  assert(debuts.every((debut) => debut < dureeEffectiveMs));
});
