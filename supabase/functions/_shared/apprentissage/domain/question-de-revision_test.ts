import { assertEquals, assertInstanceOf } from "@std/assert";
import { type Lecon, lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import type { OrigineDeLaQuestion } from "./origine-de-la-question.ts";
import { QuestionDeBoite } from "./question-de-boite.ts";
import { QuestionDeDictee } from "./question-de-dictee.ts";
import { QuestionDeProblemeEnBarres } from "./question-de-probleme-en-barres.ts";
import { questionDeRevision } from "./question-de-revision.ts";
import { Reponse } from "./reponse.ts";
import { type Tireur, tireurAuHasard } from "./tireur.ts";

const CE1 = Niveau.de("CE1");
const tireurSansMelange: Tireur = tireurAuHasard(hasardSansMelange());

function leconAvec(exercice: Record<string, unknown>): Lecon {
  return lireLecon({
    id: "fr-ce1-revision",
    matiere: "francais",
    niveau: "CE1",
    titre: "Leçon de test",
    ordre: 1,
    programme: { section: "c2-test", citation: "Citation de test." },
    lecon: [],
    exercices: [
      { type: "bulles", questions: [{ question: "q", choix: ["a", "b"], reponse: "a" }] },
      exercice,
    ],
  });
}

function origineAuxPosition1(type: OrigineDeLaQuestion["type"], tirage?: string): OrigineDeLaQuestion {
  return { leconDOrigine: "fr-ce1-revision", position: 1, type, ...(tirage === undefined ? {} : { tirage }) };
}

Deno.test("une question de bulles retenue est retrouvée par sa clé dans l'exercice d'origine et posée telle quelle", () => {
  const lecon = leconAvec({
    type: "bulles",
    questions: [
      { question: "Combien de syllabes dans « bateau » ?", choix: ["1", "2", "3"], reponse: "2" },
      { question: "Quel son entends-tu dans « poule » ?", choix: ["ou", "on", "an"], reponse: "ou" },
    ],
  });
  const identite = CleDeQuestion.de("bulles", "Quel son entends-tu dans « poule » ?ou");

  const question = questionDeRevision(lecon, origineAuxPosition1("bulles"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.enonce, "Quel son entends-tu dans « poule » ?");
  assertEquals(question?.question?.repondre(Reponse.choix("ou")), "juste");
});

Deno.test("une question d'écoute retenue est retrouvée par sa clé et posée telle quelle", () => {
  const lecon = leconAvec({
    type: "ecoute",
    items: [
      { dire: "cat", choix: ["chat", "chien"], reponse: "chat" },
      { dire: "dog", choix: ["chat", "chien"], reponse: "chien" },
    ],
  });
  const identite = CleDeQuestion.de("ecoute", "dog");

  const question = questionDeRevision(lecon, origineAuxPosition1("ecoute"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.repondre(Reponse.choix("chien")), "juste");
});

Deno.test("un calcul écrit dans la leçon est retrouvé par sa clé et posé tel quel", () => {
  const lecon = leconAvec({ type: "calcul", operations: [{ q: "2 + 2", r: 4 }, { q: "3 + 3", r: 6 }] });
  const identite = CleDeQuestion.de("calcul", "3 + 3");

  const question = questionDeRevision(lecon, origineAuxPosition1("calcul"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.enonce, "3 + 3");
  assertEquals(question?.question?.repondre(Reponse.nombre(6)), "juste");
});

Deno.test("un calcul tiré est reposé depuis le tirage gardé dans l'origine", () => {
  const lecon = leconAvec({
    type: "calcul",
    generateur: { op: "+", a: [1, 5], b: [1, 5], combien: 3 },
  });
  const identite = CleDeQuestion.de("calcul", "3 + 4");

  const question = questionDeRevision(
    lecon,
    origineAuxPosition1("calcul", "3 + 4 = 7"),
    identite,
    tireurSansMelange,
    CE1,
  );

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.enonce, "3 + 4");
  assertEquals(question?.question?.repondre(Reponse.nombre(7)), "juste");
});

Deno.test("une question de lecture retenue est retrouvée par sa clé et posée telle quelle, avec son texte", () => {
  const lecon = leconAvec({
    type: "lecture",
    texte: "Plume est un petit oiseau. Il dort dans le lit et mange des graines.",
    questions: [
      { question: "Où dort Plume ?", choix: ["dans le lit", "sur le toit"], reponse: "dans le lit" },
      { question: "Que mange Plume ?", choix: ["des graines", "du pain"], reponse: "des graines" },
    ],
  });
  const identite = CleDeQuestion.de("lecture", "Que mange Plume ?des graines");

  const question = questionDeRevision(lecon, origineAuxPosition1("lecture"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.enonce, "Que mange Plume ?");
  assertEquals(question?.question?.repondre(Reponse.choix("des graines")), "juste");
});

Deno.test("une question de dictée retenue est retrouvée par son mot et posée avec le clavier des dictées", () => {
  const lecon = leconAvec({
    type: "dictee",
    consigne: "Écoute bien et écris le mot que tu entends.",
    mots: [{ mot: "chat" }, { mot: "lapin" }],
  });
  const identite = CleDeQuestion.de("dictee", "lapin");

  const question = questionDeRevision(lecon, origineAuxPosition1("dictee"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertInstanceOf(question?.dictee, QuestionDeDictee);
  assertEquals(question?.question, undefined);
});

Deno.test("une question de boîte à jetons retenue est rejouée en boîte à jetons", () => {
  const lecon = leconAvec({
    type: "boite",
    items: [{ a: 4, op: "+", b: 3 }, { a: 15, op: "+", b: 9 }],
  });
  const identite = CleDeQuestion.de("boite", "15 + 9");

  const question = questionDeRevision(lecon, origineAuxPosition1("boite"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question instanceof QuestionDeBoite, true);
});

Deno.test("une question de problème en barres retenue est rejouée en problème en barres", () => {
  const enonce = "Lina a 9 crayons, dont 6 rouges. Combien de bleus ?";
  const lecon = leconAvec({
    type: "barres",
    items: [
      { enonce: "J'achète 4 pommes rouges et 2 pommes vertes. Combien de pommes ?", parties: [4, 2], tout: null },
      { enonce, parties: [6, null], tout: 9 },
    ],
  });
  const identite = CleDeQuestion.de("barres", enonce);

  const question = questionDeRevision(lecon, origineAuxPosition1("barres"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question instanceof QuestionDeProblemeEnBarres, true);
});

Deno.test("une étiquette à classer retenue sous sa clé de séance est rejouée en question « dans quelle maison ? »", () => {
  const lecon = leconAvec({
    type: "classer",
    groupes: [{ id: "g-ou", nom: "ou" }, { id: "g-on", nom: "on" }],
    items: [{ texte: "loup", groupe: "g-ou" }, { texte: "pont", groupe: "g-on" }],
  });
  const identite = CleDeQuestion.de("classer", "pontou,on");

  const question = questionDeRevision(lecon, origineAuxPosition1("classer"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.enonce, "« pont » va dans quelle maison ?");
  assertEquals(question?.question?.repondre(Reponse.choix("on")), "juste");
});

Deno.test("une forme de conjugaison retenue est rejouée en question à choix", () => {
  const lecon = leconAvec({
    type: "conjugaison",
    verbe: "être",
    temps: "présent",
    formes: [{ pronom: "je", forme: "suis" }, { pronom: "tu", forme: "es" }, { pronom: "il", forme: "est" }],
  });
  const identite = CleDeQuestion.de("conjugaison", "être · présent · tu");

  const question = questionDeRevision(lecon, origineAuxPosition1("conjugaison"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.enonce, "Le verbe être au présent : tu …");
  assertEquals(question?.question?.repondre(Reponse.choix("es")), "juste");
});

Deno.test("un trou retenu est rejoué en question à choix : la phrase qui le contient", () => {
  const lecon = leconAvec({
    type: "trous",
    consigne: "Complète chaque phrase.",
    texte: "Je [suis] ici. Tu [es] là.",
    distracteurs: ["sont"],
  });
  const identite = CleDeQuestion.de("trous", "Tu … là.");

  const question = questionDeRevision(lecon, origineAuxPosition1("trous"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.enonce, "Tu … là.");
  assertEquals(question?.question?.repondre(Reponse.choix("es")), "juste");
});

Deno.test("une addition écrite dans la leçon, retenue sous son identité en ligne, est rejouée en calcul en ligne", () => {
  const lecon = leconAvec({ type: "addition", operations: [[12, 29, 8], [45, 37]], etapes: ["poser", "calculer"] });
  const identite = CleDeQuestion.de("calcul", "45 + 37");

  const question = questionDeRevision(lecon, origineAuxPosition1("calcul"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.enonce, "45 + 37");
  assertEquals(question?.question?.repondre(Reponse.nombre(82)), "juste");
});

Deno.test("une addition tirée retenue est rejouée en calcul en ligne depuis le tirage gardé dans l'origine", () => {
  const lecon = leconAvec({
    type: "addition",
    generateur: { nombres: 2, min: 15, max: 59, retenue: true, combien: 3 },
    etapes: ["calculer"],
  });
  const identite = CleDeQuestion.de("calcul", "59 + 59");

  const question = questionDeRevision(
    lecon,
    origineAuxPosition1("calcul", "59 + 59"),
    identite,
    tireurSansMelange,
    CE1,
  );

  assertEquals(question?.identite, identite);
  assertEquals(question?.question?.enonce, "59 + 59");
  assertEquals(question?.question?.repondre(Reponse.nombre(118)), "juste");
});
