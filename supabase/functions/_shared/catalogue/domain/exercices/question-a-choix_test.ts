import { assertEquals, assertThrows } from "@std/assert";
import { LeconMalFormee } from "../erreurs.ts";
import { lireLecon } from "../lire-lecon.ts";

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

function bullesAvec(...questions: unknown[]): unknown {
  return { type: "bulles", questions };
}

function lectureAvec(...questions: unknown[]): unknown {
  return { type: "lecture", texte: "Le loup dort.", questions };
}

function ecouteAvec(...items: unknown[]): unknown {
  return { type: "ecoute", items };
}

const questionPoule = {
  question: "Dans le mot « poule », quel son entends-tu ?",
  choix: ["ou", "on", "an"],
  reponse: "ou",
};

function premierExercice(exercice: unknown) {
  return lireLecon(leconAvec(exercice)).exercices[0];
}

Deno.test("un exercice « bulles » donne ses questions à choix avec la question, les choix et la réponse", () => {
  const exercice = premierExercice(bullesAvec({ ...questionPoule, aide: "Écoute le milieu du mot." }));

  if (exercice.type !== "bulles") throw new Error("exercice « bulles » attendu");
  const [question] = exercice.questions;
  assertEquals(question.question, "Dans le mot « poule », quel son entends-tu ?");
  assertEquals(question.choix, ["ou", "on", "an"]);
  assertEquals(question.reponse, "ou");
  assertEquals(question.aide, "Écoute le milieu du mot.");
});

Deno.test("une question à choix sans aide n'a pas d'aide", () => {
  const exercice = premierExercice(bullesAvec(questionPoule));

  if (exercice.type !== "bulles") throw new Error("exercice « bulles » attendu");
  assertEquals(exercice.questions[0].aide, undefined);
});

Deno.test("les choix en double (même texte exact) ne sont gardés qu'une fois, dans l'ordre", () => {
  const exercice = premierExercice(bullesAvec({ ...questionPoule, choix: ["ou", "on", "ou", "an", "on"] }));

  if (exercice.type !== "bulles") throw new Error("exercice « bulles » attendu");
  assertEquals(exercice.questions[0].choix, ["ou", "on", "an"]);
});

Deno.test("« a » et « à » sont deux choix différents", () => {
  const exercice = premierExercice(
    bullesAvec({ question: "Il ... un chat.", choix: ["a", "à"], reponse: "a" }),
  );

  if (exercice.type !== "bulles") throw new Error("exercice « bulles » attendu");
  assertEquals(exercice.questions[0].choix, ["a", "à"]);
});

Deno.test("une question à choix mal formée rend la leçon mal formée", () => {
  const malFormees = [
    { ...questionPoule, question: "" },
    { ...questionPoule, choix: ["ou"] },
    { ...questionPoule, choix: ["ou", "ou"] },
    { ...questionPoule, reponse: "eu" },
    { ...questionPoule, reponse: "OU" },
    { ...questionPoule, reponse: undefined },
    { ...questionPoule, choix: ["ou", 3] },
    { ...questionPoule, aide: 3 },
  ];
  for (const question of malFormees) {
    assertThrows(
      () => lireLecon(leconAvec(bullesAvec(question))),
      LeconMalFormee,
      undefined,
      JSON.stringify(question),
    );
  }
});

Deno.test("un exercice « lecture » donne son titre, son texte et ses questions à choix", () => {
  const exercice = premierExercice({
    type: "lecture",
    titre: "Le petit chat",
    texte: "Le petit chat dort.",
    questions: [{ question: "Qui dort ?", choix: ["le chat", "le chien", "le chat"], reponse: "le chat" }],
  });

  if (exercice.type !== "lecture") throw new Error("exercice « lecture » attendu");
  assertEquals(exercice.titre, "Le petit chat");
  assertEquals(exercice.texte, "Le petit chat dort.");
  assertEquals(exercice.questions[0].choix, ["le chat", "le chien"]);
});

Deno.test("un exercice « lecture » sans texte ou avec une réponse hors des choix est mal formé", () => {
  const malFormes = [
    {
      type: "lecture",
      texte: "",
      questions: [{ question: "Qui dort ?", choix: ["le chat", "le chien"], reponse: "le chat" }],
    },
    lectureAvec({ question: "Qui dort ?", choix: ["le chat", "le chien"], reponse: "la poule" }),
  ];
  for (const exercice of malFormes) {
    assertThrows(() => lireLecon(leconAvec(exercice)), LeconMalFormee, undefined, JSON.stringify(exercice));
  }
});

const itemChat = {
  dire: "a cat",
  question: "Que veut dire « a cat » ?",
  choix: ["un chat", "un chien"],
  reponse: "un chat",
};

Deno.test("un exercice « ecoute » parle en anglais britannique quand aucune langue n'est donnée", () => {
  const exercice = premierExercice(ecouteAvec(itemChat));

  if (exercice.type !== "ecoute") throw new Error("exercice « ecoute » attendu");
  assertEquals(exercice.langue, "en-GB");
});

Deno.test("un exercice « ecoute » garde la langue donnée", () => {
  const exercice = premierExercice({ type: "ecoute", langue: "en-US", items: [itemChat] });

  if (exercice.type !== "ecoute") throw new Error("exercice « ecoute » attendu");
  assertEquals(exercice.langue, "en-US");
});

Deno.test("un item d'écoute donne le mot à écouter, la question, les choix dédoublonnés et la réponse", () => {
  const exercice = premierExercice(
    ecouteAvec({ ...itemChat, choix: ["un chat", "un chien", "un chat"], aide: "C'est un animal." }),
  );

  if (exercice.type !== "ecoute") throw new Error("exercice « ecoute » attendu");
  const [item] = exercice.items;
  assertEquals(item.dire, "a cat");
  assertEquals(item.question, "Que veut dire « a cat » ?");
  assertEquals(item.choix, ["un chat", "un chien"]);
  assertEquals(item.reponse, "un chat");
  assertEquals(item.aide, "C'est un animal.");
});

Deno.test("un item d'écoute n'a pas besoin de question", () => {
  const { question: _question, ...sansQuestion } = itemChat;
  const exercice = premierExercice(ecouteAvec(sansQuestion));

  if (exercice.type !== "ecoute") throw new Error("exercice « ecoute » attendu");
  assertEquals(exercice.items[0].question, undefined);
});

Deno.test("un item d'écoute mal formé rend la leçon mal formée", () => {
  const malFormes = [
    { ...itemChat, dire: "" },
    { ...itemChat, dire: undefined },
    { ...itemChat, choix: ["un chat"] },
    { ...itemChat, reponse: "un lapin" },
  ];
  for (const item of malFormes) {
    assertThrows(() => lireLecon(leconAvec(ecouteAvec(item))), LeconMalFormee, undefined, JSON.stringify(item));
  }
});
