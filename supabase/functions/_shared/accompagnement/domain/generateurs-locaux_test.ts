import { assertEquals, assertThrows } from "@std/assert";
import { LeconImpossibleAPreparer } from "./erreurs.ts";
import { leconDeMots, leconDePoesie, leconDeTexte, leconDeVerbes, leconDuTexte } from "./generateurs-locaux.ts";
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

const POESIE = "Au clair de la lune,\nMon ami Pierrot,\nPrête-moi ta plume\nPour écrire un mot.";

const TEXTE_DOCUMENTAIRE = [
  "Les abeilles construisent des ruches.",
  "Les abeilles fabriquent du miel.",
  "Une reine pond beaucoup d'oeufs.",
  "Les ouvrières butinent les fleurs.",
  "Le miel nourrit toute la colonie.",
  "Ainsi, la ruche vit tout l'été.",
].join(" ");

Deno.test("la leçon d'une poésie est titrée avec son premier vers sans ponctuation finale", () => {
  const { contenu } = leconDePoesie(TexteDuParent.de(POESIE));

  assertEquals(contenu.titre, "Poésie : Au clair de la lune");
});

Deno.test("la leçon d'une poésie a une étape pour apprendre un texte par cœur", () => {
  const { contenu } = leconDePoesie(TexteDuParent.de(POESIE));

  assertEquals(contenu.etapes, [{
    texte: "Pour apprendre un texte par cœur, on l'écoute vers par vers, puis on le redit sans regarder.",
    exemples: [],
  }]);
});

Deno.test("la leçon d'une poésie propose un seul exercice à mémoriser avec les vers", () => {
  const { contenu } = leconDePoesie(TexteDuParent.de(POESIE));
  const memoriser = contenu.exercices[0];

  assertEquals(contenu.exercices.length, 1);
  assertEquals(memoriser.type, "memoriser");
  assertEquals(memoriser.type === "memoriser" && memoriser.vers, [
    "Au clair de la lune,",
    "Mon ami Pierrot,",
    "Prête-moi ta plume",
    "Pour écrire un mot.",
  ]);
});

Deno.test("l'exercice à mémoriser d'une poésie garde 16 vers au plus", () => {
  const vingtVers = Array.from({ length: 20 }, (_, i) => `Vers numéro ${i + 1}`).join("\n");

  const { contenu } = leconDePoesie(TexteDuParent.de(vingtVers));

  assertEquals(contenu.exercices[0].type === "memoriser" && contenu.exercices[0].vers.length, 16);
});

Deno.test("la leçon d'un texte documentaire est titrée avec ses 40 premiers caractères suivis de « … »", () => {
  const { contenu } = leconDeTexte(TexteDuParent.de(TEXTE_DOCUMENTAIRE));

  assertEquals(contenu.titre, "Lecture : Les abeilles construisent des ruches. Le…");
});

Deno.test("la leçon d'un texte documentaire de 40 caractères ou moins est titrée sans « … »", () => {
  const { contenu } = leconDuTexte(TexteDuParent.de("Le chat dort sur le lit. Il est bien là."), "texteDocumentaire");

  assertEquals(contenu.titre, "Lecture : Le chat dort sur le lit. Il est bien là.");
});

Deno.test("la leçon d'un texte documentaire a une étape pour écouter, retrouver les mots et remettre les phrases dans l'ordre", () => {
  const { contenu } = leconDeTexte(TexteDuParent.de(TEXTE_DOCUMENTAIRE));

  assertEquals(contenu.etapes, [{
    texte: "Écoute bien le texte. Ensuite, retrouve les mots qui manquent et remets les phrases dans l'ordre.",
    exemples: [],
  }]);
});

Deno.test("« Les mots envolés » cache les 4 premiers mots distincts de 6 lettres ou plus, les 5e et 6e sont des distracteurs", () => {
  const { contenu } = leconDeTexte(TexteDuParent.de(TEXTE_DOCUMENTAIRE));
  const trous = contenu.exercices.find((exercice) => exercice.type === "trous");

  assertEquals(trous?.titre, "Les mots envolés");
  assertEquals(trous?.consigne, "Retrouve les mots qui manquent.");
  assertEquals(
    trous?.type === "trous" && [...new Set(trous.motsAttendus)],
    ["abeilles", "construisent", "ruches", "fabriquent"],
  );
  assertEquals(trous?.type === "trous" && trous.distracteurs, ["beaucoup", "ouvrières"]);
});

Deno.test("« Dans l'ordre » propose les 5 premières phrases du texte", () => {
  const { contenu } = leconDeTexte(TexteDuParent.de(TEXTE_DOCUMENTAIRE));
  const ordre = contenu.exercices.find((exercice) => exercice.type === "ordre");

  assertEquals(ordre?.titre, "Dans l'ordre");
  assertEquals(ordre?.consigne, "Remets les phrases du texte dans l'ordre.");
  assertEquals(ordre?.type === "ordre" && ordre.elements, [
    "Les abeilles construisent des ruches.",
    "Les abeilles fabriquent du miel.",
    "Une reine pond beaucoup d'oeufs.",
    "Les ouvrières butinent les fleurs.",
    "Le miel nourrit toute la colonie.",
  ]);
});

Deno.test("une phrase de 8 caractères ou moins n'est pas retenue dans « Dans l'ordre »", () => {
  const texte = TexteDuParent.de(
    "Les abeilles construisent des ruches. Il dort. Les abeilles fabriquent du miel. Une reine pond beaucoup d'oeufs.",
  );

  const { contenu } = leconDeTexte(texte);
  const ordre = contenu.exercices.find((exercice) => exercice.type === "ordre");

  assertEquals(ordre?.type === "ordre" && ordre.elements.includes("Il dort."), false);
});

Deno.test("avec moins de 3 phrases, la leçon d'un texte ne propose pas « Dans l'ordre »", () => {
  const texte = TexteDuParent.de("Les abeilles construisent des ruches. Les abeilles fabriquent du miel.");

  const { contenu } = leconDeTexte(texte);

  assertEquals(contenu.exercices.some((exercice) => exercice.type === "ordre"), false);
});

Deno.test("un texte dont les mots longs n'offrent pas deux choix par trou ne propose pas « Les mots envolés »", () => {
  const texte = TexteDuParent.de("Le chat dort sur le tapis. Il mange du pain. Elle joue dehors. Il rit et il sort.");

  const { contenu } = leconDeTexte(texte);

  assertEquals(contenu.exercices.some((exercice) => exercice.type === "trous"), false);
});

Deno.test("sans exercice possible, un texte documentaire de 2 phrases courtes se replie sur « Mon texte » à mémoriser", () => {
  const texte = TexteDuParent.de("Le chat dort sur le lit. Il est bien là.");

  const { contenu } = leconDuTexte(texte, "texteDocumentaire");

  assertEquals(contenu.exercices.length, 1);
  assertEquals(contenu.exercices[0].type, "memoriser");
  assertEquals(contenu.exercices[0].titre, "Mon texte");
  assertEquals(
    contenu.exercices[0].type === "memoriser" && contenu.exercices[0].vers,
    ["Le chat dort sur le lit.", "Il est bien là."],
  );
});

Deno.test("une liste de mots dont tous les mots sont écartés se replie sur « Mon texte » et signale les mots écartés", () => {
  const texte = TexteDuParent.de("zoo@\nchat@\nlion@");

  const { contenu, ecartes } = leconDuTexte(texte, "listeDeMots");

  assertEquals(contenu.exercices[0].titre, "Mon texte");
  assertEquals(contenu.exercices[0].type === "memoriser" && contenu.exercices[0].vers, ["zoo@", "chat@", "lion@"]);
  assertEquals(ecartes, ["zoo@", "chat@", "lion@"]);
});

Deno.test("le repli « Mon texte » garde 12 lignes au plus", () => {
  const texte = TexteDuParent.de(Array.from({ length: 15 }, (_, i) => `zoo${i}@`).join("\n"));

  const { contenu } = leconDuTexte(texte, "listeDeMots");

  assertEquals(contenu.exercices[0].type === "memoriser" && contenu.exercices[0].vers.length, 12);
});

Deno.test("un texte d'une seule phrase courte ne permet pas de préparer une leçon", () => {
  const erreur = assertThrows(
    () => leconDuTexte(TexteDuParent.de("Le chat dort."), "texteDocumentaire"),
    LeconImpossibleAPreparer,
  );

  assertEquals(erreur.message, "Ce texte ne permet pas de préparer une leçon.");
});

Deno.test("leconDuTexte aiguille une poésie vers sa leçon de poésie", () => {
  const { contenu } = leconDuTexte(TexteDuParent.de(POESIE), "poesie");

  assertEquals(contenu.titre, "Poésie : Au clair de la lune");
});
