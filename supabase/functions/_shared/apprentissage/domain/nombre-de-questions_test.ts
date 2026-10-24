import { assertEquals } from "@std/assert";
import { type Exercice, lireLecon } from "../../catalogue/domain/index.ts";
import { nombreDeQuestions } from "./nombre-de-questions.ts";

const uneListeDe = (taille: number): readonly unknown[] => Array.from({ length: taille }, (_, i) => ({ rang: i }));

const desQuestionsAChoix = (taille: number) =>
  Array.from({ length: taille }, (_, i) => ({ question: `Question ${i}`, choix: ["a", "b"], reponse: "a" }));

const desItemsDEcoute = (taille: number) =>
  Array.from({ length: taille }, (_, i) => ({ dire: `mot ${i}`, choix: ["a", "b"], reponse: "a" }));

function exerciceLu(brut: unknown): Exercice {
  return lireLecon({
    id: "fr-cp-sons-ou-on-an",
    matiere: "francais",
    niveau: "CP",
    titre: "Les sons ou, on, an",
    ordre: 5,
    programme: {
      section: "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee",
      citation: "Décoder et encoder de 25 à 30 CGP.",
    },
    lecon: [],
    exercices: [brut],
  }).exercices[0];
}

const desGroupes = (taille: number) => Array.from({ length: taille }, (_, i) => ({ id: `${i}`, nom: `maison ${i}` }));

const desItemsAClasser = (taille: number) =>
  Array.from({ length: taille }, (_, i) => ({ texte: `mot ${i}`, groupe: "0" }));

Deno.test("un exercice de bulles compte une question par question", () => {
  const exercice: Exercice = { type: "bulles", titre: "Quel son entends-tu ?", questions: desQuestionsAChoix(6) };

  assertEquals(nombreDeQuestions(exercice), 6);
});

Deno.test("un exercice de lecture compte une question par question", () => {
  const exercice: Exercice = {
    type: "lecture",
    titre: "Le petit chat Plume",
    texte: "Plume dort.",
    questions: desQuestionsAChoix(4),
  };

  assertEquals(nombreDeQuestions(exercice), 4);
});

Deno.test("un exercice d'écoute compte une question par item", () => {
  const exercice: Exercice = { type: "ecoute", langue: "en", items: desItemsDEcoute(4) };

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
  const exercice = exerciceLu({ type: "classer", groupes: desGroupes(3), items: desItemsAClasser(9) });

  assertEquals(nombreDeQuestions(exercice), 9);
});

Deno.test("un exercice d'ordre compte une question par élément", () => {
  const exercice = exerciceLu({ type: "ordre", elements: ["do", "mi", "no"] });

  assertEquals(nombreDeQuestions(exercice), 3);
});

Deno.test("un exercice à trous compte une question par mot entre crochets du texte", () => {
  const exercice = exerciceLu({
    type: "trous",
    texte: "Le [chat] dort sur le [lit] de Léa, près de la [fenêtre].",
    distracteurs: ["pré", "mur"],
  });

  assertEquals(nombreDeQuestions(exercice), 3);
});

Deno.test("un exercice de conjugaison compte une question par personne", () => {
  const exercice = exerciceLu({
    type: "conjugaison",
    verbe: "être",
    temps: "présent",
    formes: ["je", "tu", "il", "nous", "vous", "ils"].map((pronom, rang) => ({ pronom, forme: `forme ${rang}` })),
  });

  assertEquals(nombreDeQuestions(exercice), 6);
});

Deno.test("une dictée compte une question par mot", () => {
  const exercice = exerciceLu({
    type: "dictee",
    mots: ["chat", "chien", "souris", "lapin", "loup"].map((mot) => ({ mot })),
  });

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
  const bulles: Exercice = { type: "bulles", questions: desQuestionsAChoix(6) };
  const classer = exerciceLu({ type: "classer", groupes: desGroupes(3), items: desItemsAClasser(9) });

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
