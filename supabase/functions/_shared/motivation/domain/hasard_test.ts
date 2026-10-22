import { assertThrows } from "@std/assert";
import { TirageHorsIntervalle } from "./hasard.ts";
import { encourager, feliciter } from "./paroles.ts";
import { universDe } from "./univers.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";

const noisette = universDe("animaux").personnageGuide;

Deno.test("un tirage de 1 viole le contrat du hasard et est refusé pour une félicitation", () => {
  assertThrows(() => feliciter(noisette, hasardFixe(1)), TirageHorsIntervalle);
});

Deno.test("un tirage négatif viole le contrat du hasard et est refusé pour une félicitation", () => {
  assertThrows(() => feliciter(noisette, hasardFixe(-0.1)), TirageHorsIntervalle);
});

Deno.test("un tirage de 1 viole le contrat du hasard et est refusé pour un encouragement", () => {
  assertThrows(() => encourager(hasardFixe(1)), TirageHorsIntervalle);
});

Deno.test("un tirage négatif viole le contrat du hasard et est refusé pour un encouragement", () => {
  assertThrows(() => encourager(hasardFixe(-0.1)), TirageHorsIntervalle);
});
