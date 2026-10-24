import { assertEquals } from "@std/assert";
import { type Lecon, lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import { hasardFixe, hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import type { QuestionPrevue } from "./plan-du-test-de-depart.ts";
import { questionDuTestDeDepart } from "./question-du-test-de-depart.ts";
import { Reponse } from "./reponse.ts";
import { type Tireur, tireurAuHasard } from "./tireur.ts";

const CP = Niveau.de("CP");
const CE1 = Niveau.de("CE1");

function leconAvec(exercice: Record<string, unknown>): Lecon {
  return lireLecon({
    id: "fr-ce1-test",
    matiere: "francais",
    niveau: "CE1",
    titre: "Leçon de test",
    ordre: 1,
    programme: { section: "c2-test", citation: "Citation de test." },
    lecon: [],
    exercices: [{ type: "bulles", questions: [] }, exercice],
  });
}

function questionPrevue(rang: number): QuestionPrevue {
  return { leconId: "fr-ce1-test", exercice: 1, rang };
}

const tireurSansMelange: Tireur = tireurAuHasard(hasardSansMelange());

function choixTries(choix: string[]): string[] {
  return [...choix].sort();
}

Deno.test("la question de bulles du test de départ est la question de la leçon, telle quelle", () => {
  const lecon = leconAvec({
    type: "bulles",
    questions: [
      { question: "Combien de syllabes dans « bateau » ?", choix: ["1", "2", "3"], reponse: "2" },
      { question: "Quel son entends-tu dans « poule » ?", choix: ["ou", "on", "an"], reponse: "ou" },
    ],
  });

  const question = questionDuTestDeDepart(lecon, questionPrevue(1), tireurSansMelange, CE1);

  assertEquals(question.enonce, "Quel son entends-tu dans « poule » ?");
  assertEquals(choixTries(question.tirage()), ["an", "on", "ou"]);
  assertEquals(question.repondre(Reponse.choix("ou")), "juste");
});

Deno.test("la question d'écoute du test de départ est l'item de la leçon, tel quel", () => {
  const lecon = leconAvec({
    type: "ecoute",
    items: [
      { dire: "cat", choix: ["chat", "chien"], reponse: "chat" },
      { dire: "dog", choix: ["chat", "chien"], reponse: "chien" },
    ],
  });

  const question = questionDuTestDeDepart(lecon, questionPrevue(1), tireurSansMelange, CE1);

  assertEquals(choixTries(question.tirage()), ["chat", "chien"]);
  assertEquals(question.repondre(Reponse.choix("chien")), "juste");
});

Deno.test("une opération d'un calcul en liste se pose avec les choix au CP", () => {
  const lecon = leconAvec({ type: "calcul", operations: [{ q: "2 + 2", r: 4 }, { q: "3 + 3", r: 6 }] });

  const question = questionDuTestDeDepart(lecon, questionPrevue(1), tireurSansMelange, CP);

  assertEquals(question.enonce, "3 + 3");
  assertEquals(choixTries(question.tirage()), ["5", "6", "7", "8"]);
  assertEquals(question.repondre(Reponse.choix("6")), "juste");
});

Deno.test("l'opération tirée d'un calcul à générateur se pose au clavier de cristaux dès le CE1", () => {
  const lecon = leconAvec({ type: "calcul", generateur: { op: "+", a: [1, 20], b: [1, 20], combien: 1 } });
  const tireur = tireurAuHasard(hasardFixe(0.2, 0.5));

  const question = questionDuTestDeDepart(lecon, questionPrevue(0), tireur, CE1);

  assertEquals(question.enonce, "5 + 11");
  assertEquals(question.tirage(), []);
  assertEquals(question.repondre(Reponse.nombre(16)), "juste");
});

Deno.test("une forme de conjugaison se pose en question à choix avec deux autres formes du tableau", () => {
  const lecon = leconAvec({
    type: "conjugaison",
    verbe: "être",
    temps: "présent",
    formes: [
      { pronom: "je", forme: "suis" },
      { pronom: "tu", forme: "es" },
      { pronom: "il", forme: "est" },
    ],
  });

  const question = questionDuTestDeDepart(lecon, questionPrevue(1), tireurSansMelange, CE1);

  assertEquals(question.enonce, "Le verbe être au présent : tu …");
  assertEquals(choixTries(question.tirage()), ["es", "est", "suis"]);
  assertEquals(question.repondre(Reponse.choix("es")), "juste");
});

Deno.test("un trou se pose en question à choix : la phrase qui le contient, le mot attendu et deux candidats", () => {
  const lecon = leconAvec({
    type: "trous",
    consigne: "Complète chaque phrase.",
    texte: "Je [suis] ici. Tu [es] là.",
    distracteurs: ["sont"],
  });

  const question = questionDuTestDeDepart(lecon, questionPrevue(0), tireurSansMelange, CE1);

  assertEquals(question.enonce, "Je … ici.");
  assertEquals(choixTries(question.tirage()), ["es", "sont", "suis"]);
  assertEquals(question.repondre(Reponse.choix("suis")), "juste");
});

Deno.test("une étiquette à classer se pose en question « dans quelle maison ? » avec les groupes pour choix", () => {
  const lecon = leconAvec({
    type: "classer",
    groupes: [{ id: "g-ou", nom: "ou" }, { id: "g-on", nom: "on" }],
    items: [{ texte: "loup", groupe: "g-ou" }, { texte: "pont", groupe: "g-on" }],
  });

  const question = questionDuTestDeDepart(lecon, questionPrevue(1), tireurSansMelange, CE1);

  assertEquals(question.enonce, "« pont » va dans quelle maison ?");
  assertEquals(choixTries(question.tirage()), ["on", "ou"]);
  assertEquals(question.repondre(Reponse.choix("on")), "juste");
});

Deno.test("une addition tirée se pose en ligne comme un calcul", () => {
  const lecon = leconAvec({
    type: "addition",
    generateur: { nombres: 2, min: 15, max: 59, retenue: false, combien: 1 },
    etapes: ["calculer"],
  });
  const tireur = tireurAuHasard(hasardFixe(0, 0.5));

  const question = questionDuTestDeDepart(lecon, questionPrevue(0), tireur, CE1);

  assertEquals(question.enonce, "15 + 37");
  assertEquals(question.repondre(Reponse.nombre(52)), "juste");
});
