import { assertEquals } from "@std/assert";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { direTuSaisConjuguer } from "./paroles.ts";
import { universDe } from "./univers.ts";

Deno.test("la fin d'une conjugaison est une félicitation suivie de « Tu sais conjuguer <verbe> ! »", () => {
  const { personnageGuide } = universDe("princesse");

  const parole = direTuSaisConjuguer("être", personnageGuide, hasardFixe(0.99, 0));

  assertEquals(parole, "Bravo ! Tu sais conjuguer être !");
});
