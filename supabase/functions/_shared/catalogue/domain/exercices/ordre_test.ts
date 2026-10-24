import { assertEquals, assertThrows } from "@std/assert";
import { LeconMalFormee } from "../erreurs.ts";
import { lireLecon } from "../lire-lecon.ts";

function leconAvec(exercice: unknown): Record<string, unknown> {
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
    exercices: [exercice],
  };
}

const lesSyllabes = {
  type: "ordre",
  titre: "Le mot en morceaux",
  consigne: "Remets les syllabes dans l'ordre pour écrire « domino ».",
  elements: ["do", "mi", "no"],
};

function exerciceOrdre(exercice: unknown) {
  const lu = lireLecon(leconAvec(exercice)).exercices[0];
  if (lu.type !== "ordre") throw new Error("exercice « ordre » attendu");
  return lu;
}

Deno.test("un exercice « ordre » donne ses éléments dans l'ordre correct", () => {
  const exercice = exerciceOrdre(lesSyllabes);

  assertEquals(exercice.consigne, "Remets les syllabes dans l'ordre pour écrire « domino ».");
  assertEquals(exercice.elements, ["do", "mi", "no"]);
});

Deno.test("deux éléments au même texte sont permis dans un exercice « ordre »", () => {
  const exercice = exerciceOrdre({ type: "ordre", elements: ["Avancer de 1 case", "Avancer de 1 case", "Tourner"] });

  assertEquals(exercice.elements, ["Avancer de 1 case", "Avancer de 1 case", "Tourner"]);
});

Deno.test("un exercice « ordre » sans consigne a la consigne par défaut", () => {
  const exercice = exerciceOrdre({ type: "ordre", elements: ["do", "mi"] });

  assertEquals(exercice.consigne, "Remets les étiquettes dans le bon ordre.");
});

Deno.test("un exercice « ordre » mal formé rend la leçon mal formée", () => {
  const malFormes = [
    { ...lesSyllabes, elements: ["do"] },
    { ...lesSyllabes, elements: [] },
    { ...lesSyllabes, elements: ["do", ""] },
    { ...lesSyllabes, elements: ["do", 3] },
    { ...lesSyllabes, elements: undefined },
  ];
  for (const exercice of malFormes) {
    assertThrows(() => lireLecon(leconAvec(exercice)), LeconMalFormee, undefined, JSON.stringify(exercice));
  }
});

function elementsNumerotes(nombre: number): string[] {
  return Array.from({ length: nombre }, (_, rang) => `étape ${rang}`);
}

Deno.test("un exercice « ordre » de 20 éléments est accepté", () => {
  const exercice = exerciceOrdre({ ...lesSyllabes, elements: elementsNumerotes(20) });

  assertEquals(exercice.elements.length, 20);
});

Deno.test("un exercice « ordre » de 21 éléments rend la leçon mal formée", () => {
  const exercice = { ...lesSyllabes, elements: elementsNumerotes(21) };

  assertThrows(() => lireLecon(leconAvec(exercice)), LeconMalFormee);
});
