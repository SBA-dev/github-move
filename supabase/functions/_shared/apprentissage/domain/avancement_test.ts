import { assertEquals } from "@std/assert";
import { Avancement } from "./avancement.ts";
import { seanceComplete, seanceDUnExercice } from "./choix-de-seance.ts";
import { planDeSeance } from "./plan-de-seance.ts";
import {
  laLeconDeLaChanson,
  laLeconDeLecture,
  laLeconDesSons,
  uneLeconAvecEtapes,
  uneLeconAvecExercices,
  unExerciceBrut,
} from "../test_utils/lecons-de-test.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";

function avancementDeLaSeanceComplete(lecon: Lecon): Avancement {
  return Avancement.initial(lecon, planDeSeance(lecon, seanceComplete()));
}

function troisQuestions(): ReadonlyArray<unknown> {
  return [{ question: "a", choix: ["x"], reponse: "x" }, { question: "b", choix: ["x"], reponse: "x" }, {
    question: "c",
    choix: ["x"],
    reponse: "x",
  }];
}

const totauxParType: ReadonlyArray<readonly [string, Record<string, unknown>, number]> = [
  ["bulles : une par question", { questions: troisQuestions() }, 3],
  ["lecture : une par question", { questions: troisQuestions() }, 3],
  ["ecoute : une par item", { items: [{ mot: "a" }, { mot: "b" }] }, 2],
  ["boite : une par item", { items: [{ a: 4, op: "+", b: 3 }, { a: 5, op: "+", b: 2 }] }, 2],
  ["barres : une par item", { items: [{ total: 8 }, { total: 9 }, { total: 7 }] }, 3],
  ["classer : une par étiquette", { items: [{ texte: "loup", groupe: "1" }, { texte: "pont", groupe: "2" }] }, 2],
  ["ordre : une par élément", { elements: ["ou", "on", "an"] }, 3],
  ["trous : une par trou", { texte: "Le [chat] dort sur le [lit] de [Léa]." }, 3],
  ["conjugaison : une par personne", { formes: [{ pronom: "je", forme: "suis" }, { pronom: "tu", forme: "es" }] }, 2],
  ["dictee : une par mot", { mots: [{ mot: "loup" }, { mot: "chat" }, { mot: "lit" }, { mot: "mur" }] }, 4],
  ["calcul : une par opération", { operations: [{ q: "2 + 1", r: 3 }, { q: "3 + 1", r: 4 }] }, 2],
  ["fluence : une pour tout l'exercice", { operations: [{ q: "2 + 1", r: 3 }, { q: "3 + 1", r: 4 }] }, 1],
  ["memoriser : deux par vers", { vers: ["Mon ami Pierrot,", "Prête-moi ta plume"] }, 4],
];

for (const [description, contenu, total] of totauxParType) {
  const type = description.split(" :")[0];
  Deno.test(`l'avancement d'un exercice ${description}`, () => {
    const lecon = uneLeconAvecExercices(unExerciceBrut(type, contenu));

    assertEquals(avancementDeLaSeanceComplete(lecon).total, total);
  });
}

Deno.test("l'avancement d'une séance complète compte les questions de tous les exercices : 15 pour « Les sons ou, on, an »", () => {
  const avancement = avancementDeLaSeanceComplete(laLeconDesSons());

  assertEquals([avancement.questionsReussies, avancement.total], [0, 15]);
});

Deno.test("l'avancement d'une séance d'un exercice ne compte que cet exercice : 6 pour « Quel son entends-tu ? »", () => {
  const lecon = laLeconDesSons();

  assertEquals(Avancement.initial(lecon, planDeSeance(lecon, seanceDUnExercice(lecon, 0))).total, 6);
});

Deno.test("l'avancement d'une séance d'un exercice ne compte que cet exercice : 9 pour « Les maisons des sons »", () => {
  const lecon = laLeconDesSons();

  assertEquals(Avancement.initial(lecon, planDeSeance(lecon, seanceDUnExercice(lecon, 1))).total, 9);
});

Deno.test("l'avancement de « Lecture : Le petit chat Plume » compte 4 questions", () => {
  assertEquals(avancementDeLaSeanceComplete(laLeconDeLecture()).total, 4);
});

Deno.test("l'avancement de « Chanson : Au clair de la lune » compte 16 questions, deux par vers", () => {
  assertEquals(avancementDeLaSeanceComplete(laLeconDeLaChanson()).total, 16);
});

Deno.test("les étapes de leçon ne comptent pas dans l'avancement", () => {
  const sansEtape = uneLeconAvecEtapes();
  const avecTroisEtapes = uneLeconAvecEtapes("Un.", "Deux.", "Trois.");

  assertEquals(avancementDeLaSeanceComplete(avecTroisEtapes).total, avancementDeLaSeanceComplete(sansEtape).total);
});

Deno.test("chaque question réussie fait avancer l'avancement d'un pas", () => {
  const avancement = avancementDeLaSeanceComplete(laLeconDesSons()).apresUneQuestionReussie();

  assertEquals([avancement.questionsReussies, avancement.total], [1, 15]);
});

Deno.test("l'avancement ne dépasse jamais le total", () => {
  let avancement = avancementDeLaSeanceComplete(laLeconDeLecture());

  for (let i = 0; i < 6; i++) avancement = avancement.apresUneQuestionReussie();

  assertEquals(avancement.questionsReussies, 4);
});

Deno.test("l'avancement n'est pas modifié par la question réussie : il reste une valeur", () => {
  const avant = avancementDeLaSeanceComplete(laLeconDesSons());

  avant.apresUneQuestionReussie();

  assertEquals(avant.questionsReussies, 0);
});

Deno.test("l'avancement n'est pas complet tant qu'une question reste à réussir", () => {
  let avancement = avancementDeLaSeanceComplete(laLeconDeLecture());

  for (let i = 0; i < 3; i++) avancement = avancement.apresUneQuestionReussie();

  assertEquals(avancement.estComplet(), false);
});

Deno.test("l'avancement est complet exactement quand la dernière question est réussie", () => {
  let avancement = avancementDeLaSeanceComplete(laLeconDeLecture());

  for (let i = 0; i < 4; i++) avancement = avancement.apresUneQuestionReussie();

  assertEquals(avancement.estComplet(), true);
});
