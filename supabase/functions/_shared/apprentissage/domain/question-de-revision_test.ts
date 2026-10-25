import { assertEquals } from "@std/assert";
import { type Lecon, lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import type { OrigineDeLaQuestion } from "./origine-de-la-question.ts";
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
  assertEquals(question?.question.enonce, "Quel son entends-tu dans « poule » ?");
  assertEquals(question?.question.repondre(Reponse.choix("ou")), "juste");
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
  assertEquals(question?.question.repondre(Reponse.choix("chien")), "juste");
});

Deno.test("un calcul écrit dans la leçon est retrouvé par sa clé et posé tel quel", () => {
  const lecon = leconAvec({ type: "calcul", operations: [{ q: "2 + 2", r: 4 }, { q: "3 + 3", r: 6 }] });
  const identite = CleDeQuestion.de("calcul", "3 + 3");

  const question = questionDeRevision(lecon, origineAuxPosition1("calcul"), identite, tireurSansMelange, CE1);

  assertEquals(question?.identite, identite);
  assertEquals(question?.question.enonce, "3 + 3");
  assertEquals(question?.question.repondre(Reponse.nombre(6)), "juste");
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
  assertEquals(question?.question.enonce, "3 + 4");
  assertEquals(question?.question.repondre(Reponse.nombre(7)), "juste");
});
