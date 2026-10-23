import { assertEquals } from "@std/assert";
import type { Exercice } from "../../catalogue/domain/index.ts";
import { nombreDeQuestions } from "./nombre-de-questions.ts";

const uneListeDe = (taille: number): readonly unknown[] => Array.from({ length: taille }, (_, i) => ({ rang: i }));

Deno.test("un exercice de bulles compte une question par question", () => {
  const exercice: Exercice = { type: "bulles", titre: "Quel son entends-tu ?", questions: uneListeDe(6) };

  assertEquals(nombreDeQuestions(exercice), 6);
});

Deno.test("un exercice de lecture compte une question par question", () => {
  const exercice: Exercice = { type: "lecture", titre: "Le petit chat Plume", questions: uneListeDe(4) };

  assertEquals(nombreDeQuestions(exercice), 4);
});

Deno.test("un exercice d'écoute compte une question par item", () => {
  const exercice: Exercice = { type: "ecoute", langue: "en", items: uneListeDe(4) };

  assertEquals(nombreDeQuestions(exercice), 4);
});

Deno.test("un exercice de boîte compte une question par item", () => {
  const exercice: Exercice = { type: "boite", items: uneListeDe(5) };

  assertEquals(nombreDeQuestions(exercice), 5);
});

Deno.test("un exercice de barres compte une question par item", () => {
  const exercice: Exercice = { type: "barres", items: uneListeDe(4) };

  assertEquals(nombreDeQuestions(exercice), 4);
});

Deno.test("un exercice pour classer compte une question par étiquette, pas par groupe", () => {
  const exercice: Exercice = { type: "classer", groupes: uneListeDe(3), items: uneListeDe(9) };

  assertEquals(nombreDeQuestions(exercice), 9);
});

Deno.test("un exercice d'ordre compte une question par élément", () => {
  const exercice: Exercice = { type: "ordre", elements: uneListeDe(3) };

  assertEquals(nombreDeQuestions(exercice), 3);
});

Deno.test("un exercice à trous compte une question par mot entre crochets du texte", () => {
  const exercice: Exercice = {
    type: "trous",
    texte: "Le [chat] dort sur le [lit] de Léa, près de la [fenêtre].",
    distracteurs: uneListeDe(5),
  };

  assertEquals(nombreDeQuestions(exercice), 3);
});

Deno.test("un exercice à trous sans crochet n'a aucune question", () => {
  const exercice: Exercice = { type: "trous", texte: "Le chat dort." };

  assertEquals(nombreDeQuestions(exercice), 0);
});

Deno.test("un exercice de conjugaison compte une question par personne", () => {
  const exercice: Exercice = { type: "conjugaison", verbe: "être", temps: "présent", formes: uneListeDe(6) };

  assertEquals(nombreDeQuestions(exercice), 6);
});

Deno.test("une dictée compte une question par mot", () => {
  const exercice: Exercice = { type: "dictee", mots: uneListeDe(5) };

  assertEquals(nombreDeQuestions(exercice), 5);
});

Deno.test("un exercice de calcul à opérations fixes compte une question par opération", () => {
  const exercice: Exercice = { type: "calcul", operations: uneListeDe(6) };

  assertEquals(nombreDeQuestions(exercice), 6);
});

Deno.test("un exercice de calcul généré compte autant de questions que le générateur en demande", () => {
  const exercice: Exercice = { type: "calcul", generateur: { op: "+", a: [1, 10], b: [1, 10], combien: 8 } };

  assertEquals(nombreDeQuestions(exercice), 8);
});

Deno.test("un exercice de calcul généré sans nombre demandé compte 5 questions", () => {
  const exercice: Exercice = { type: "calcul", generateur: { op: "+", a: [1, 10], b: [1, 10] } };

  assertEquals(nombreDeQuestions(exercice), 5);
});

Deno.test("un exercice de calcul sans opération ni générateur compte 5 questions", () => {
  const exercice: Exercice = { type: "calcul" };

  assertEquals(nombreDeQuestions(exercice), 5);
});

Deno.test("un exercice de fluence compte une seule question pour tout l'exercice", () => {
  const exercice: Exercice = { type: "fluence", duree: 45, generateur: { op: "+", a: [1, 28], b: [1, 2] } };

  assertEquals(nombreDeQuestions(exercice), 1);
});

Deno.test("un exercice pour mémoriser compte deux questions par vers", () => {
  const exercice: Exercice = { type: "memoriser", vers: uneListeDe(8) };

  assertEquals(nombreDeQuestions(exercice), 16);
});

Deno.test("une addition posée compte une question par opération et par étape", () => {
  const exercice: Exercice = { type: "addition", operations: uneListeDe(1), etapes: ["poser", "calculer"] };

  assertEquals(nombreDeQuestions(exercice), 2);
});

Deno.test("une addition posée sans étapes compte poser et calculer pour chaque opération", () => {
  const exercice: Exercice = { type: "addition", operations: uneListeDe(4) };

  assertEquals(nombreDeQuestions(exercice), 8);
});

Deno.test("une addition posée générée compte 3 opérations quand le générateur n'en demande pas", () => {
  const exercice: Exercice = { type: "addition", generateur: { nombres: 2, min: 12, max: 59 } };

  assertEquals(nombreDeQuestions(exercice), 6);
});

Deno.test("une addition posée générée compte les opérations demandées par le générateur", () => {
  const exercice: Exercice = { type: "addition", generateur: { combien: 4 }, etapes: ["poser"] };

  assertEquals(nombreDeQuestions(exercice), 4);
});

Deno.test("la leçon « Les sons ou, on, an » compte 6 questions de bulles puis 9 de classement", () => {
  const bulles: Exercice = { type: "bulles", questions: uneListeDe(6) };
  const classer: Exercice = { type: "classer", groupes: uneListeDe(3), items: uneListeDe(9) };

  assertEquals([bulles, classer].map(nombreDeQuestions), [6, 9]);
});

Deno.test("la séance « Chanson : Au clair de la lune » compte 16 questions", () => {
  const vers = [
    "Au clair de la lune,",
    "Mon ami Pierrot,",
    "Prête-moi ta plume",
    "Pour écrire un mot.",
    "Ma chandelle est morte,",
    "Je n'ai plus de feu.",
    "Ouvre-moi ta porte",
    "Pour l'amour de Dieu.",
  ];
  const exercices: readonly Exercice[] = [{ type: "memoriser", titre: "Au clair de la lune", vers }];

  assertEquals(exercices.reduce((total, exercice) => total + nombreDeQuestions(exercice), 0), 16);
});
