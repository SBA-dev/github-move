import { assertEquals, assertThrows } from "@std/assert";
import { LeconMalFormee } from "./erreurs.ts";
import { enonceDeLaQuestion } from "./enonce-de-la-question.ts";
import { lireLecon } from "./lire-lecon.ts";

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

const bulles = {
  type: "bulles",
  titre: "Quel son entends-tu ?",
  questions: [
    { question: "Dans le mot « poule », quel son entends-tu ?", choix: ["ou", "on", "an"], reponse: "ou" },
    { question: "Dans le mot « mouton », quel son entends-tu à la fin ?", choix: ["on", "ou", "an"], reponse: "on" },
  ],
};

const lecture = {
  type: "lecture",
  texte: "Le loup dort.",
  questions: [{ question: "Qui dort ?", choix: ["le loup", "la poule"], reponse: "le loup" }],
};

Deno.test("l'énoncé de la première question d'un exercice « bulles » est le texte de la question", () => {
  const [exercice] = lireLecon(leconAvec(bulles)).exercices;

  assertEquals(enonceDeLaQuestion(exercice, 0), "Dans le mot « poule », quel son entends-tu ?");
});

Deno.test("l'énoncé suit le rang de la question demandée", () => {
  const [exercice] = lireLecon(leconAvec(bulles)).exercices;

  assertEquals(enonceDeLaQuestion(exercice, 1), "Dans le mot « mouton », quel son entends-tu à la fin ?");
});

Deno.test("l'énoncé d'une question d'un exercice « lecture » est le texte de la question", () => {
  const [exercice] = lireLecon(leconAvec(lecture)).exercices;

  assertEquals(enonceDeLaQuestion(exercice, 0), "Qui dort ?");
});

Deno.test("un rang hors limites n'a pas d'énoncé", () => {
  const [exercice] = lireLecon(leconAvec(bulles)).exercices;

  assertEquals(enonceDeLaQuestion(exercice, 2), undefined);
  assertEquals(enonceDeLaQuestion(exercice, -1), undefined);
});

Deno.test("un exercice d'un autre type que « bulles » ou « lecture » n'a pas d'énoncé de question", () => {
  const [exercice] = lireLecon(leconAvec({
    type: "ecoute",
    items: [{ dire: "cat", question: "Que veut dire cat ?", choix: ["chat", "chien"], reponse: "chat" }],
  })).exercices;

  assertEquals(enonceDeLaQuestion(exercice, 0), undefined);
});

Deno.test("une question de « bulles » ou de « lecture » sans texte est mal formée à la lecture de la leçon", () => {
  const sansTexte = [
    { type: "bulles", questions: [{ choix: ["ou"], reponse: "ou" }] },
    { type: "bulles", questions: [{ question: 42, choix: ["ou"], reponse: "ou" }] },
    { type: "bulles", questions: ["Quel son ?"] },
    { type: "lecture", texte: "Le loup dort.", questions: [{ choix: ["le loup"], reponse: "le loup" }] },
  ];
  for (const exercice of sansTexte) {
    assertThrows(() => lireLecon(leconAvec(exercice)), LeconMalFormee, undefined, JSON.stringify(exercice));
  }
});
