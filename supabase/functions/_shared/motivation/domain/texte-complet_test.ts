import { assertEquals } from "@std/assert";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { direLeTexteComplet } from "./paroles.ts";
import { universDe } from "./univers.ts";

Deno.test("la fin d'un texte à trous est une félicitation suivie de « Le texte est complet ! »", () => {
  const { personnageGuide } = universDe("princesse");

  const parole = direLeTexteComplet(personnageGuide, hasardFixe(0.99, 0));

  assertEquals(parole, "Bravo ! Le texte est complet !");
});
