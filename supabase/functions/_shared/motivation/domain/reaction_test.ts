import { assertEquals } from "@std/assert";
import { direJeNeSaisPasAvecLesChoix } from "./paroles.ts";
import { reagirAJeNeSaisPas, reagirAJeNeSaisPasEnDictee, reagirALaReponse } from "./reaction.ts";
import { universDe } from "./univers.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";

const noisette = universDe("animaux").personnageGuide;

Deno.test("le personnage guide applaudit et félicite une réponse juste", () => {
  const reaction = reagirALaReponse(true, noisette, hasardFixe(0.9, 0));

  assertEquals(
    { humeur: reaction.humeur, parole: reaction.parole },
    { humeur: "applaudit", parole: { nature: "felicitation", texte: "Bravo !" } },
  );
});

Deno.test("une réponse juste fait jouer l'effet sonore de la réponse juste", () => {
  const reaction = reagirALaReponse(true, noisette, hasardFixe(0.9, 0));

  assertEquals(reaction.effetSonore, "reponseJuste");
});

Deno.test("une réponse fausse fait jouer l'effet sonore de la réponse fausse", () => {
  const reaction = reagirALaReponse(false, noisette, hasardFixe(0));

  assertEquals(reaction.effetSonore, "reponseFausse");
});

Deno.test("le personnage guide réfléchit et encourage une réponse fausse", () => {
  const reaction = reagirALaReponse(false, noisette, hasardFixe(0));

  assertEquals(
    { humeur: reaction.humeur, parole: reaction.parole },
    { humeur: "reflechit", parole: { nature: "encouragement", texte: "Oups, presque !" } },
  );
});

Deno.test("à « Je ne sais pas », le personnage guide réfléchit et rassure avec l'aide", () => {
  const aide = "Pense à l'animal qui miaule.";

  assertEquals(reagirAJeNeSaisPas(aide), {
    humeur: "reflechit",
    parole: direJeNeSaisPasAvecLesChoix(aide),
  });
});

Deno.test("à « Je ne sais pas » en dictée, quand une lettre s'écrit, le personnage guide réfléchit et invite à écrire la suite", () => {
  assertEquals(reagirAJeNeSaisPasEnDictee("ecrire"), {
    humeur: "reflechit",
    parole: "Pas de souci, on apprend ensemble ! Voici la lettre suivante. Écris la suite.",
  });
});

Deno.test("à « Je ne sais pas » en dictée, quand la bonne touche brille, le personnage guide réfléchit et invite à la toucher", () => {
  assertEquals(reagirAJeNeSaisPasEnDictee("briller"), {
    humeur: "reflechit",
    parole: "Pas de souci, on apprend ensemble ! La bonne lettre brille : touche-la.",
  });
});
