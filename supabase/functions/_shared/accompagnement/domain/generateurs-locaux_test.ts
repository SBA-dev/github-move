import { assertEquals } from "@std/assert";
import { leconDeMots, leconDeVerbes } from "./generateurs-locaux.ts";
import { presentDuPremierGroupe } from "./present-du-premier-groupe.ts";
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

Deno.test("la leçon d'une liste de plus de 3 verbes est titrée avec les 3 premiers verbes suivis de « … »", () => {
  const texte = TexteDuParent.de("chanter, finir, prendre, manger");

  const { contenu } = leconDeVerbes(texte);

  assertEquals(contenu.titre, "Les verbes : chanter, finir, prendre…");
});

Deno.test("la leçon d'une liste de 3 verbes ou moins est titrée sans « … »", () => {
  const texte = TexteDuParent.de("chanter, finir, prendre");

  const { contenu } = leconDeVerbes(texte);

  assertEquals(contenu.titre, "Les verbes : chanter, finir, prendre");
});

Deno.test("la leçon d'une liste de verbes a une étape qui présente les trois groupes avec chanter, finir, prendre", () => {
  const texte = TexteDuParent.de("chanter, finir, prendre, manger");

  const { contenu } = leconDeVerbes(texte);

  assertEquals(contenu.etapes, [{
    texte:
      "Premier groupe : les verbes en e - r. Deuxième groupe : les verbes en i - r qui font i - s - s - o - n - s avec nous. Troisième groupe : tous les autres.",
    exemples: ["chanter", "finir", "prendre"],
  }]);
});

Deno.test("la leçon d'une liste de verbes n'écarte aucun verbe", () => {
  const texte = TexteDuParent.de("chanter, finir, prendre, manger");

  const { ecartes } = leconDeVerbes(texte);

  assertEquals(ecartes, []);
});

Deno.test("la leçon d'une liste de verbes propose « Chaque verbe dans sa maison » avec les trois groupes", () => {
  const texte = TexteDuParent.de("chanter, finir, prendre");

  const { contenu } = leconDeVerbes(texte);
  const classer = contenu.exercices.find((exercice) => exercice.type === "classer");

  assertEquals(classer?.titre, "Chaque verbe dans sa maison");
  assertEquals(classer?.consigne, "Range chaque verbe dans la maison de son groupe.");
  assertEquals(classer?.type === "classer" && classer.groupes, [
    { id: "1", nom: "1er groupe" },
    { id: "2", nom: "2e groupe" },
    { id: "3", nom: "3e groupe" },
  ]);
});

Deno.test("chaque verbe est rangé en minuscules dans la maison de son groupe, voir et savoir au 3e groupe", () => {
  const texte = TexteDuParent.de("Chanter, finir, voir, savoir");

  const { contenu } = leconDeVerbes(texte);
  const classer = contenu.exercices.find((exercice) => exercice.type === "classer");

  assertEquals(classer?.type === "classer" && classer.items, [
    { texte: "chanter", groupe: "1" },
    { texte: "finir", groupe: "2" },
    { texte: "voir", groupe: "3" },
    { texte: "savoir", groupe: "3" },
  ]);
});

Deno.test("l'exercice « Chaque verbe dans sa maison » garde 12 verbes au plus", () => {
  const texte = TexteDuParent.de(
    "chanter, danser, jouer, manger, aimer, finir, grandir, voir, savoir, prendre, venir, dormir, partir, lire",
  );

  const { contenu } = leconDeVerbes(texte);
  const classer = contenu.exercices.find((exercice) => exercice.type === "classer");

  assertEquals(classer?.type === "classer" && classer.items.length, 12);
});

Deno.test("la leçon d'une liste de verbes propose le présent du premier verbe régulier du 1er groupe", () => {
  const texte = TexteDuParent.de("chanter, finir, prendre");

  const { contenu } = leconDeVerbes(texte);
  const conjugaison = contenu.exercices.find((exercice) => exercice.type === "conjugaison");

  assertEquals(conjugaison?.titre, "Le verbe chanter");
  assertEquals(conjugaison?.type === "conjugaison" && conjugaison.verbe, "chanter");
  assertEquals(conjugaison?.type === "conjugaison" && conjugaison.temps, "présent");
  assertEquals(conjugaison?.type === "conjugaison" && conjugaison.formes, presentDuPremierGroupe("chanter"));
});

Deno.test("le verbe conjugué est le premier verbe régulier du 1er groupe, pas un verbe irrégulier", () => {
  const texte = TexteDuParent.de("lever, payer, aimer, finir");

  const { contenu } = leconDeVerbes(texte);
  const conjugaison = contenu.exercices.find((exercice) => exercice.type === "conjugaison");

  assertEquals(conjugaison?.titre, "Le verbe aimer");
});

Deno.test("sans verbe régulier du 1er groupe, la leçon ne propose aucune conjugaison", () => {
  const texte = TexteDuParent.de("finir, prendre, venir");

  const { contenu } = leconDeVerbes(texte);

  assertEquals(contenu.exercices.some((exercice) => exercice.type === "conjugaison"), false);
});
