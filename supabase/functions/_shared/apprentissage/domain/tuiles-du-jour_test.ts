import { assertEquals } from "@std/assert";
import { tuilesDuJour } from "./tuiles-du-jour.ts";

Deno.test("aucune tuile quand aucune question n'est due et que le test de départ est fait", () => {
  const tuiles = tuilesDuJour({ nombreDeQuestionsDues: 0, testDeDepartAProposer: false });

  assertEquals(tuiles, []);
});

Deno.test("pas de tuile révision quand la file de révision n'est pas connue", () => {
  const tuiles = tuilesDuJour({ nombreDeQuestionsDues: undefined, testDeDepartAProposer: false });

  assertEquals(tuiles, []);
});

Deno.test("la tuile révision compte toutes les questions dues, même au-delà de 10", () => {
  const tuiles = tuilesDuJour({ nombreDeQuestionsDues: 12, testDeDepartAProposer: false });

  assertEquals(tuiles, [{ genre: "revision", nombreDeQuestionsDues: 12 }]);
});

Deno.test("le test de départ à proposer donne une tuile test de départ", () => {
  const tuiles = tuilesDuJour({ nombreDeQuestionsDues: 0, testDeDepartAProposer: true });

  assertEquals(tuiles, [{ genre: "testDeDepart" }]);
});

Deno.test("la tuile révision vient avant la tuile test de départ", () => {
  const tuiles = tuilesDuJour({ nombreDeQuestionsDues: 3, testDeDepartAProposer: true });

  assertEquals(tuiles, [{ genre: "revision", nombreDeQuestionsDues: 3 }, { genre: "testDeDepart" }]);
});
