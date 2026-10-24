import { assertEquals } from "@std/assert";
import {
  direTuSaisConjuguer,
  feliciter,
  feliciterUneFoisSurDeux,
  paroleApresUneBonneReponse,
  relancer,
} from "./index.ts";
import { universDe } from "./univers.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";

const personnageGuide = universDe("animaux").personnageGuide;

Deno.test("une félicitation due se dit avec la félicitation du personnage guide", () => {
  const attendue = feliciter(personnageGuide, hasardFixe(0.5, 0)).texte;

  const parole = paroleApresUneBonneReponse("felicitation", personnageGuide, hasardFixe(0.5, 0));

  assertEquals(parole, attendue);
});

Deno.test("une félicitation due une fois sur deux se dit quand le tirage le permet", () => {
  const attendue = feliciterUneFoisSurDeux(personnageGuide, hasardFixe(0.1, 0, 0));

  const parole = paroleApresUneBonneReponse("felicitationUneFoisSurDeux", personnageGuide, hasardFixe(0.1, 0, 0));

  assertEquals(parole, attendue);
  assertEquals(typeof parole, "string");
});

Deno.test("une félicitation due une fois sur deux se tait quand le tirage ne le permet pas", () => {
  const parole = paroleApresUneBonneReponse("felicitationUneFoisSurDeux", personnageGuide, hasardFixe(0.9));

  assertEquals(parole, undefined);
});

Deno.test("une relance due se dit avec une relance", () => {
  const parole = paroleApresUneBonneReponse("relance", personnageGuide, hasardFixe(0.4));

  assertEquals(parole, relancer(hasardFixe(0.4)));
});

Deno.test("quand aucune parole n'est due, le personnage guide se tait", () => {
  const parole = paroleApresUneBonneReponse(undefined, personnageGuide, hasardFixe(0));

  assertEquals(parole, undefined);
});

Deno.test("quand l'enfant sait conjuguer le verbe, le personnage guide le dit avec le verbe", () => {
  const attendue = direTuSaisConjuguer("être", personnageGuide, hasardFixe(0.5, 0));

  const parole = paroleApresUneBonneReponse(
    { parole: "tuSaisConjuguer", verbe: "être" },
    personnageGuide,
    hasardFixe(0.5, 0),
  );

  assertEquals(parole, attendue);
});

Deno.test("quand le personnage guide applaudit, il se tait", () => {
  const parole = paroleApresUneBonneReponse("applaudir", personnageGuide, hasardFixe(0));

  assertEquals(parole, undefined);
});
