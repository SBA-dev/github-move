import { assertEquals } from "@std/assert";
import { feliciter } from "./paroles.ts";
import { type CleUnivers, universDe } from "./univers.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";

const felicitationsCommunes = [
  "Bravo !",
  "Super !",
  "Ouah, bien joué !",
  "Exactement !",
  "Génial !",
  "Tu gères !",
  "Parfait !",
  "Oui, c'est ça !",
];

const expressionsAttendues: [CleUnivers, string[]][] = [
  ["princesse", ["Abracadabra !", "Par ma baguette, bravo !", "Magique !"]],
  ["animaux", ["Youpi !", "Hop hop hop, bravo !", "Trop fort, ça !"]],
  ["sports", ["Allez, on y va !", "Et c'est le but !", "Quelle équipe !"]],
  ["police", ["Enquête résolue !", "Bien vu, détective !", "Affaire classée !"]],
  ["pompier", ["Mission accomplie !", "Pin-pon, bravo !", "Sauvetage réussi !"]],
  ["danse", ["Et hop, une pirouette !", "En rythme, bravo !", "Quelle grâce !"]],
];

const noisette = universDe("animaux").personnageGuide;

Deno.test("un premier tirage de 0,34 donne une expression du personnage guide", () => {
  const felicitation = feliciter(noisette, hasardFixe(0.34, 0));

  assertEquals(felicitation.texte, "Youpi !");
});

Deno.test("un premier tirage de 0,35 donne une félicitation commune", () => {
  const felicitation = feliciter(noisette, hasardFixe(0.35, 0));

  assertEquals(felicitation.texte, "Bravo !");
});

Deno.test("le second tirage choisit la dernière expression du personnage guide", () => {
  const felicitation = feliciter(noisette, hasardFixe(0, 0.99));

  assertEquals(felicitation.texte, "Trop fort, ça !");
});

Deno.test("le second tirage choisit la dernière félicitation commune", () => {
  const felicitation = feliciter(noisette, hasardFixe(0.9, 0.99));

  assertEquals(felicitation.texte, "Oui, c'est ça !");
});

for (const [cle, expressions] of expressionsAttendues) {
  const personnageGuide = universDe(cle).personnageGuide;

  Deno.test(`${personnageGuide.nom} a ses trois expressions, mot pour mot`, () => {
    const textes = [0, 0.4, 0.99].map((second) =>
      feliciter(personnageGuide, hasardFixe(0, second)).texte
    );

    assertEquals(textes, expressions);
  });

  Deno.test(`${personnageGuide.nom} ne dit jamais l'expression d'un autre personnage guide`, () => {
    const autres = expressionsAttendues
      .filter(([autreCle]) => autreCle !== cle)
      .flatMap(([, textes]) => textes);

    for (const second of [0, 0.4, 0.99]) {
      assertEquals(
        autres.includes(feliciter(personnageGuide, hasardFixe(0.1, second)).texte),
        false,
      );
    }
  });
}

Deno.test("les huit félicitations communes sont tirées mot pour mot", () => {
  const textes = felicitationsCommunes.map((_, i) =>
    feliciter(noisette, hasardFixe(0.5, (i + 0.5) / 8)).texte
  );

  assertEquals(textes, felicitationsCommunes);
});
