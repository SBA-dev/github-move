import { assertEquals } from "@std/assert";
import { phraseDEssai } from "./phrase-d-essai.ts";

Deno.test("la phrase d'essai est dite par le personnage guide qui se présente", () => {
  assertEquals(phraseDEssai("Noisette"), "Coucou ! Je suis Noisette. On apprend en s'amusant ? Youpi !");
});
