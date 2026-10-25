import { assertEquals } from "@std/assert";
import { leconDeMots } from "./generateurs-locaux.ts";
import { TexteDuParent } from "./texte-du-parent.ts";

Deno.test("la leçon d'une liste de plus de 3 mots est titrée avec les 3 premiers mots suivis de « … »", () => {
  const texte = TexteDuParent.de("chaton, maison, poisson, garçon");

  const { contenu } = leconDeMots(texte);

  assertEquals(contenu.titre, "Dictée : chaton, maison, poisson…");
});

Deno.test("la leçon d'une liste de 3 mots ou moins est titrée sans « … »", () => {
  const texte = TexteDuParent.de("chaton, maison, poisson");

  const { contenu } = leconDeMots(texte);

  assertEquals(contenu.titre, "Dictée : chaton, maison, poisson");
});

Deno.test("la leçon d'une liste de mots a une étape sur les lettres muettes", () => {
  const texte = TexteDuParent.de("chaton, maison, poisson, garçon");

  const { contenu } = leconDeMots(texte);

  assertEquals(contenu.etapes, [{
    texte: "Pour écrire un mot, je le dis lentement et j'écoute chaque son. Attention aux lettres muettes !",
    exemples: [],
  }]);
});

Deno.test("la leçon d'une liste de mots propose une seule dictée « J'écris les mots », sans bulles", () => {
  const texte = TexteDuParent.de("chaton, maison, poisson, garçon");

  const { contenu } = leconDeMots(texte);

  assertEquals(contenu.exercices.length, 1);
  assertEquals(contenu.exercices[0].type, "dictee");
  assertEquals(contenu.exercices[0].titre, "J'écris les mots");
  assertEquals(
    contenu.exercices[0].type === "dictee" && contenu.exercices[0].mots.map((m) => m.mot),
    ["chaton", "maison", "poisson", "garçon"],
  );
});

Deno.test("la dictée garde 10 mots au plus", () => {
  const texte = TexteDuParent.de("un, deux, trois, quatre, cinq, six, sept, huit, neuf, dix, onze, douze");

  const { contenu } = leconDeMots(texte);

  assertEquals(contenu.exercices[0].type === "dictee" && contenu.exercices[0].mots.length, 10);
});

Deno.test("un mot de plus de 18 lettres ou avec une lettre hors du clavier est écarté et signalé", () => {
  const texte = TexteDuParent.de("chaton, anticonstitutionnellement, maison, zoo@, poisson");

  const { contenu, ecartes } = leconDeMots(texte);

  assertEquals(ecartes, ["anticonstitutionnellement", "zoo@"]);
  assertEquals(
    contenu.exercices[0].type === "dictee" && contenu.exercices[0].mots.map((m) => m.mot),
    ["chaton", "maison", "poisson"],
  );
});
