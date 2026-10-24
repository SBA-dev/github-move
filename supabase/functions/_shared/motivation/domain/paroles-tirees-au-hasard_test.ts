import { assertEquals } from "@std/assert";
import { feliciter, feliciterUneFoisSurDeux, relancer } from "./index.ts";
import { universDe } from "./univers.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";

const personnageGuide = universDe("animaux").personnageGuide;

Deno.test("la relance est tirée parmi trois phrases selon le tirage", () => {
  const relances = [0, 0.4, 0.99].map((tirage) => relancer(hasardFixe(tirage)));

  assertEquals(relances, ["Oui ! Et après ?", "Bien ! Et ensuite ?", "Super ! La suite ?"]);
});

Deno.test("un tirage inférieur à 0,5 donne la félicitation du personnage guide", () => {
  const attendue = feliciter(personnageGuide, hasardFixe(0, 0)).texte;

  const parole = feliciterUneFoisSurDeux(personnageGuide, hasardFixe(0.49, 0, 0));

  assertEquals(parole, attendue);
});

Deno.test("un tirage de 0,5 ou plus ne donne aucune félicitation", () => {
  const parole = feliciterUneFoisSurDeux(personnageGuide, hasardFixe(0.5));

  assertEquals(parole, undefined);
});
