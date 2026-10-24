import { assertEquals, assertThrows } from "@std/assert";
import { lireLecon } from "./lire-lecon.ts";
import type { Exercice, ExerciceGenerique } from "./exercice.ts";
import type { ExerciceBulles } from "./exercices/bulles.ts";
import type { ExerciceCalcul } from "./exercices/calcul.ts";
import type { ExerciceFluence } from "./exercices/fluence.ts";
import { LeconMalFormee } from "./erreurs.ts";
import { libelleDuType, TYPES_D_EXERCICE } from "./type-d-exercice.ts";

const bullesQuelSon = {
  type: "bulles",
  titre: "Quel son entends-tu ?",
  questions: [
    { question: "Dans le mot « poule », quel son entends-tu ?", choix: ["ou", "on", "an"], reponse: "ou" },
    { question: "Dans le mot « mouton », quel son entends-tu à la fin ?", choix: ["on", "ou", "an"], reponse: "on" },
    { question: "Dans le mot « enfant », quel son entends-tu ?", choix: ["an", "on", "ou"], reponse: "an" },
    { question: "Dans le mot « bonbon », quel son entends-tu deux fois ?", choix: ["on", "an", "ou"], reponse: "on" },
    { question: "Dans le mot « soupe », quel son entends-tu ?", choix: ["ou", "an", "on"], reponse: "ou" },
    { question: "Dans le mot « lampe », quel son entends-tu ?", choix: ["an", "ou", "on"], reponse: "an" },
  ],
};

const classerLesMaisonsDesSons = {
  type: "classer",
  titre: "Les maisons des sons",
  consigne: "Range chaque mot dans la maison de son son.",
  groupes: [{ id: "1", nom: "ou" }, { id: "2", nom: "on" }, { id: "3", nom: "an" }],
  items: [
    { texte: "loup", groupe: "1" },
    { texte: "roue", groupe: "1" },
    { texte: "chou", groupe: "1" },
    { texte: "pont", groupe: "2" },
    { texte: "lion", groupe: "2" },
    { texte: "savon", groupe: "2" },
    { texte: "banc", groupe: "3" },
    { texte: "vent", groupe: "3" },
    { texte: "dent", groupe: "3" },
  ],
};

function exerciceDeBulles(exercice: Exercice): ExerciceBulles {
  if (exercice.type !== "bulles") throw new Error(`« ${exercice.type} » n'est pas un exercice de bulles`);
  return exercice;
}

function exerciceDeCalcul(exercice: Exercice): ExerciceCalcul {
  if (exercice.type !== "calcul") throw new Error(`« ${exercice.type} » n'est pas un exercice de calcul`);
  return exercice;
}

function exerciceDeFluence(exercice: Exercice): ExerciceFluence {
  if (exercice.type !== "fluence") throw new Error(`« ${exercice.type} » n'est pas un exercice de fluence`);
  return exercice;
}

function exerciceAddition(exercice: Exercice) {
  if (exercice.type !== "addition") throw new Error(`« ${exercice.type} » n'est pas une addition posée`);
  return exercice;
}

function exerciceGenerique(exercice: Exercice): ExerciceGenerique {
  if (
    exercice.type === "bulles" || exercice.type === "lecture" || exercice.type === "ecoute" ||
    exercice.type === "classer" || exercice.type === "ordre" || exercice.type === "trous" ||
    exercice.type === "calcul" || exercice.type === "fluence" || exercice.type === "addition" ||
    exercice.type === "dictee" || exercice.type === "conjugaison" || exercice.type === "boite" ||
    exercice.type === "barres"
  ) {
    throw new Error(`« ${exercice.type} » n'est pas un exercice générique`);
  }
  return exercice;
}

function leconAvec(...exercices: unknown[]): Record<string, unknown> {
  return {
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
    exercices,
  };
}

const unExerciceDeChaqueType: Record<string, Record<string, unknown>> = {
  bulles: { type: "bulles", questions: [{ question: "1 + 1 ?", choix: ["2", "3"], reponse: "2" }] },
  classer: {
    type: "classer",
    consigne: "Range.",
    groupes: [{ id: "1", nom: "ou" }, { id: "2", nom: "on" }],
    items: [{ texte: "loup", groupe: "1" }],
  },
  dictee: { type: "dictee", mots: [{ mot: "loup" }] },
  ordre: { type: "ordre", consigne: "Dans l'ordre.", elements: ["un", "deux"] },
  trous: { type: "trous", consigne: "Complète.", texte: "Au clair de la [lune]", distracteurs: ["soleil"] },
  conjugaison: {
    type: "conjugaison",
    verbe: "chanter",
    temps: "présent",
    formes: [{ pronom: "je", forme: "chante" }, { pronom: "tu", forme: "chantes" }],
  },
  lecture: {
    type: "lecture",
    titre: "Le loup",
    texte: "Le loup dort.",
    questions: [{ question: "Qui dort ?", choix: ["le loup", "la poule"], reponse: "le loup" }],
  },
  memoriser: { type: "memoriser", titre: "Poème", vers: ["Un vers", "Deux vers"] },
  addition: { type: "addition", operations: [[12, 5]], etapes: ["poser", "calculer"] },
  calcul: { type: "calcul", operations: [{ q: "12 − 5", r: 7 }] },
  fluence: { type: "fluence", duree: 60, generateur: { op: "+", a: [1, 9], b: [1, 9], combien: 20 } },
  ecoute: {
    type: "ecoute",
    langue: "en-GB",
    items: [{ dire: "cat", question: "Que veut dire cat ?", choix: ["chat", "chien"], reponse: "chat" }],
  },
  boite: { type: "boite", items: [{ a: 4, op: "+", b: 3 }] },
  barres: { type: "barres", items: [{ enonce: "Combien en tout ?", parties: [3, 4], tout: null }] },
};

Deno.test("un exercice « bulles » lu garde son type, son titre et ses 6 questions", () => {
  const lecon = lireLecon(leconAvec(bullesQuelSon));

  assertEquals(lecon.exercices.length, 1);
  assertEquals(lecon.exercices[0].type, "bulles");
  assertEquals(lecon.exercices[0].titre, "Quel son entends-tu ?");
  assertEquals(exerciceDeBulles(lecon.exercices[0]).questions.length, 6);
});

Deno.test("un exercice « classer » lu garde sa consigne et ses 9 items", () => {
  const lecon = lireLecon(leconAvec(classerLesMaisonsDesSons));

  assertEquals(lecon.exercices[0].type, "classer");
  assertEquals(lecon.exercices[0].titre, "Les maisons des sons");
  const exercice = lecon.exercices[0];
  if (exercice.type !== "classer") throw new Error("exercice « classer » attendu");
  assertEquals(exercice.consigne, "Range chaque mot dans la maison de son son.");
  assertEquals(exercice.items.length, 9);
});

Deno.test("les exercices d'une leçon gardent l'ordre du JSON", () => {
  const lecon = lireLecon(leconAvec(bullesQuelSon, classerLesMaisonsDesSons));

  assertEquals(lecon.exercices.map((exercice) => exercice.type), ["bulles", "classer"]);
});

Deno.test("un exercice sans titre ni consigne les laisse absents", () => {
  const lecon = lireLecon(leconAvec(unExerciceDeChaqueType.bulles));

  assertEquals(lecon.exercices[0].titre, undefined);
  assertEquals(lecon.exercices[0].consigne, undefined);
});

Deno.test("les 14 types du format sont connus, chacun lu avec son type", () => {
  const lecon = lireLecon(leconAvec(...Object.values(unExerciceDeChaqueType)));

  assertEquals(lecon.exercices.map((exercice) => exercice.type), Object.keys(unExerciceDeChaqueType));
  assertEquals([...TYPES_D_EXERCICE], Object.keys(unExerciceDeChaqueType));
});

Deno.test("chaque type d'exercice a son libellé d'interface", () => {
  assertEquals(TYPES_D_EXERCICE.map(libelleDuType), [
    "Bulles-réponses",
    "Ranger dans les maisons",
    "Dictée",
    "Remettre dans l'ordre",
    "Texte à trous",
    "Conjugaison",
    "Écouter et comprendre",
    "Apprendre par cœur",
    "Addition posée",
    "Calcul",
    "Calcul rapide",
    "Écouter (langue)",
    "La boîte à jetons",
    "Problème en schéma",
  ]);
});

Deno.test("un exercice d'un type inconnu est écarté, la leçon garde ses autres exercices", () => {
  const lecon = lireLecon(leconAvec(bullesQuelSon, { type: "puzzle", pieces: 12 }, classerLesMaisonsDesSons));

  assertEquals(lecon.exercices.map((exercice) => exercice.type), ["bulles", "classer"]);
});

Deno.test("une leçon dont le seul exercice est d'un type inconnu est lue sans exercice", () => {
  const lecon = lireLecon(leconAvec({ type: "puzzle" }));

  assertEquals(lecon.exercices, []);
});

Deno.test("un exercice « bulles » sans questions est mal formé", () => {
  assertThrows(() => lireLecon(leconAvec({ type: "bulles", titre: "Quel son entends-tu ?" })), LeconMalFormee);
});

Deno.test("un exercice qui n'est pas un objet est mal formé", () => {
  for (const exercice of [null, "bulles", 42, []]) {
    assertThrows(() => lireLecon(leconAvec(exercice)), LeconMalFormee);
  }
});

Deno.test("un exercice sans type est mal formé", () => {
  assertThrows(() => lireLecon(leconAvec({ questions: [] })), LeconMalFormee);
});

Deno.test("un exercice connu dont une donnée attendue en tableau n'en est pas un est mal formé", () => {
  const malFormes = [
    { type: "classer", items: "loup" },
    { type: "ordre", elements: "un deux" },
    { type: "dictee", mots: "loup" },
    { type: "memoriser", vers: "Un vers" },
    { type: "ecoute", items: {} },
    { type: "boite", items: 3 },
    { type: "barres", items: "?" },
    { type: "conjugaison", formes: "je chante" },
    { type: "lecture", texte: "Le loup dort.", questions: "Qui dort ?" },
  ];
  for (const exercice of malFormes) {
    assertThrows(() => lireLecon(leconAvec(exercice)), LeconMalFormee, undefined, exercice.type);
  }
});

Deno.test("un exercice « trous » sans texte est mal formé", () => {
  assertThrows(() => lireLecon(leconAvec({ type: "trous", consigne: "Complète." })), LeconMalFormee);
});

Deno.test("un exercice « calcul » garde ses opérations ou le nombre de questions de son générateur", () => {
  const lecon = lireLecon(leconAvec(
    unExerciceDeChaqueType.calcul,
    { type: "calcul", generateur: { op: "+", a: [1, 9], b: [1, 9], combien: 8 } },
  ));

  assertEquals(exerciceDeCalcul(lecon.exercices[0]).operations?.length, 1);
  assertEquals(exerciceDeCalcul(lecon.exercices[1]).generateur?.combien, 8);
});

Deno.test("un exercice « addition » garde ses opérations, ou le nombre d'opérations de son générateur, et ses étapes", () => {
  const lecon = lireLecon(leconAvec(
    unExerciceDeChaqueType.addition,
    { type: "addition", generateur: { nombres: 3, min: 10, max: 99, retenue: true }, etapes: ["poser"] },
  ));

  assertEquals(exerciceAddition(lecon.exercices[0]).operations?.length, 1);
  assertEquals(exerciceAddition(lecon.exercices[0]).etapes, ["poser", "calculer"]);
  assertEquals(exerciceAddition(lecon.exercices[1]).generateur?.nombres, 3);
});

Deno.test("un exercice « fluence » garde sa durée et n'a ni question ni item", () => {
  const lecon = lireLecon(leconAvec(unExerciceDeChaqueType.fluence));

  const fluence = exerciceDeFluence(lecon.exercices[0]);
  assertEquals(fluence.duree, 60);
  assertEquals("questions" in fluence, false);
  assertEquals("items" in fluence, false);
});

Deno.test("le contenu d'un exercice des autres types est gardé tel quel", () => {
  const lecon = lireLecon(leconAvec(
    unExerciceDeChaqueType.memoriser,
  ));

  assertEquals(exerciceGenerique(lecon.exercices[0]).vers, ["Un vers", "Deux vers"]);
});

Deno.test("les exercices d'une leçon lue sont en lecture seule", () => {
  const lecon = lireLecon(leconAvec(bullesQuelSon));

  assertEquals(Object.isFrozen(lecon.exercices), true);
  assertEquals(Object.isFrozen(lecon.exercices[0]), true);
});

Deno.test("un exercice dont aucune question ne peut être posée est mal formé", () => {
  const sansQuestion = [
    { type: "bulles", questions: [] },
    { type: "lecture", texte: "Le loup dort.", questions: [] },
    { type: "trous", texte: "Au clair de la lune" },
    { type: "classer", groupes: [{ id: "1", nom: "ou" }], items: [] },
    { type: "ordre", elements: [] },
    { type: "dictee", mots: [] },
    { type: "conjugaison", verbe: "chanter", formes: [] },
    { type: "memoriser", vers: [] },
    { type: "ecoute", items: [] },
    { type: "boite", items: [] },
    { type: "barres", items: [] },
  ];
  for (const exercice of sansQuestion) {
    assertThrows(() => lireLecon(leconAvec(exercice)), LeconMalFormee, undefined, exercice.type);
  }
});

Deno.test("« fluence », « calcul » et « addition » sans donnée explicite restent lisibles (comptés par défaut)", () => {
  const lecon = lireLecon(leconAvec({ type: "fluence" }, { type: "calcul" }, { type: "addition" }));

  assertEquals(lecon.exercices.length, 3);
});
