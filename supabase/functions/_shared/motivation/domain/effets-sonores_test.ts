import { assertEquals } from "@std/assert";
import { effetsSonoresApresUneBonneReponse } from "./effets-sonores.ts";

const sansPointGagne = {
  questionsReussiesAvant: 2,
  questionsReussiesApres: 2,
  exerciceComplete: false,
  pendantLeChronoDUneFluence: false,
};

Deno.test("une réponse juste sans point gagné fait jouer seulement l'effet de la réponse juste", () => {
  const effets = effetsSonoresApresUneBonneReponse(sansPointGagne);

  assertEquals(effets, ["reponseJuste"]);
});

Deno.test("un point entré dans le récipient fait jouer le point du récipient après la réponse juste", () => {
  const effets = effetsSonoresApresUneBonneReponse({
    ...sansPointGagne,
    questionsReussiesApres: 3,
  });

  assertEquals(effets, ["reponseJuste", "pointDuRecipient"]);
});

Deno.test("une réponse qui complète l'exercice fait jouer le texte complet à la place de la réponse juste", () => {
  const effets = effetsSonoresApresUneBonneReponse({
    ...sansPointGagne,
    exerciceComplete: true,
  });

  assertEquals(effets, ["texteComplet"]);
});

Deno.test("une réponse qui complète l'exercice et gagne un point fait jouer le texte complet puis le point du récipient", () => {
  const effets = effetsSonoresApresUneBonneReponse({
    ...sansPointGagne,
    questionsReussiesApres: 3,
    exerciceComplete: true,
  });

  assertEquals(effets, ["texteComplet", "pointDuRecipient"]);
});

Deno.test("pendant le chrono d'une fluence, un point gagné ne fait jamais jouer le point du récipient", () => {
  const effets = effetsSonoresApresUneBonneReponse({
    ...sansPointGagne,
    questionsReussiesApres: 3,
    pendantLeChronoDUneFluence: true,
  });

  assertEquals(effets, ["reponseJuste"]);
});
