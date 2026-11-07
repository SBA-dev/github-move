import { assertEquals } from "@std/assert";
import {
  aiderQuandOnNeSaitPas,
  encouragerApresUneErreurDeCalcul,
  feliciterPuisExpliquer,
  feliciterUnCalcul,
} from "./paroles-du-calcul.ts";
import { universDe } from "./univers.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";

const noisette = universDe("animaux").personnageGuide;

Deno.test("après une erreur de calcul, le personnage guide encourage puis donne l'aide de l'opération", () => {
  const parole = encouragerApresUneErreurDeCalcul(noisette, "Compte les unités d'abord.", hasardFixe(0));

  assertEquals(parole, {
    texte: "Oups, presque ! Compte les unités d'abord.",
    nature: "encouragement",
    humeur: "reflechit",
    effetsAvant: ["reponseFausse"],
  });
});

Deno.test("après une erreur de calcul sans aide, le personnage guide encourage seulement", () => {
  const parole = encouragerApresUneErreurDeCalcul(noisette, undefined, hasardFixe(0));

  assertEquals(parole.texte, "Oups, presque !");
});

Deno.test("une réponse juste à un calcul est félicitée, sans effet sonore ajouté", () => {
  const parole = feliciterUnCalcul(noisette, hasardFixe(0.9, 0));

  assertEquals(parole, { texte: "Bravo !", nature: "felicitation", humeur: "applaudit" });
});

Deno.test("la suite d'un calcul juste est dite avant la félicitation, après les effets sonores donnés", () => {
  const parole = feliciterUnCalcul(noisette, hasardFixe(0.9, 0), "La boîte s'ouvre.", ["reponseJuste"]);

  assertEquals(parole, {
    texte: "La boîte s'ouvre. Bravo !",
    nature: "felicitation",
    humeur: "applaudit",
    effetsAvant: ["reponseJuste"],
  });
});

Deno.test("une réponse juste est félicitée puis expliquée", () => {
  const parole = feliciterPuisExpliquer(noisette, "Il y avait 3 billes de plus.", hasardFixe(0.9, 0), ["reponseJuste"]);

  assertEquals(parole, {
    texte: "Bravo ! Il y avait 3 billes de plus.",
    nature: "felicitation",
    humeur: "applaudit",
    effetsAvant: ["reponseJuste"],
  });
});

Deno.test("quand l'enfant ne sait pas et qu'il a des choix, la bonne réponse brille", () => {
  const parole = aiderQuandOnNeSaitPas({ mode: { genre: "choix" } }, "Regarde les dizaines.", "42");

  assertEquals(parole, {
    texte: "Pas de souci, on apprend ensemble ! Regarde les dizaines. La bonne réponse brille : touche-la.",
    nature: "aide",
    humeur: "reflechit",
  });
});

Deno.test("quand l'enfant ne sait pas au clavier de cristaux, le personnage guide dit la réponse", () => {
  const parole = aiderQuandOnNeSaitPas({ mode: { genre: "clavierDeCristaux" } }, undefined, "42");

  assertEquals(parole, {
    texte: "Pas de souci ! La réponse est 42. Tape-la sur les cristaux.",
    nature: "aide",
    humeur: "reflechit",
  });
});
