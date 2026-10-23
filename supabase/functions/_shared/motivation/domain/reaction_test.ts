import { assertEquals } from "@std/assert";
import { reagirALaReponse } from "./reaction.ts";
import { universDe } from "./univers.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";

const noisette = universDe("animaux").personnageGuide;

Deno.test("le personnage guide applaudit et félicite une réponse juste", () => {
  const reaction = reagirALaReponse(true, noisette, hasardFixe(0.9, 0));

  assertEquals(reaction, {
    humeur: "applaudit",
    parole: { nature: "felicitation", texte: "Bravo !" },
  });
});

Deno.test("le personnage guide réfléchit et encourage une réponse fausse", () => {
  const reaction = reagirALaReponse(false, noisette, hasardFixe(0));

  assertEquals(reaction, {
    humeur: "reflechit",
    parole: { nature: "encouragement", texte: "Oups, presque !" },
  });
});
