import { assertEquals } from "@std/assert";
import type { FaitsDuJour } from "./objectif-du-jour.ts";
import { queteDuJour } from "./quete-du-jour.ts";

const faitsDUnJourSansSeance: FaitsDuJour = {
  leconsDesSeancesTermineesDuJour: [],
  nombreDeSeancesDeRevisionTermineesDuJour: 0,
};

Deno.test("sans quête tant que la leçon du jour est inconnue", () => {
  const quete = queteDuJour(
    { leconDuJour: { genre: "inconnue" }, nombreDeQuestionsDues: 3 },
    faitsDUnJourSansSeance,
  );

  assertEquals(quete, { genre: "sansQuete" });
});

Deno.test("sans quête tant que le nombre de questions dues est inconnu", () => {
  const quete = queteDuJour(
    {
      leconDuJour: { genre: "aJouer", lecon: "lecon-a", titre: "Le son ou" },
      nombreDeQuestionsDues: undefined,
    },
    faitsDUnJourSansSeance,
  );

  assertEquals(quete, { genre: "sansQuete" });
});
