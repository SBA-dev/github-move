import { assertEquals, assertThrows } from "@std/assert";
import { LeconMalFormee } from "../erreurs.ts";
import { lireLecon } from "../lire-lecon.ts";

function leconAvec(exercice: unknown): Record<string, unknown> {
  return {
    id: "math-ce1-additions",
    matiere: "maths",
    niveau: "CE1",
    titre: "Les additions",
    ordre: 3,
    programme: {
      section: "c2-mathematiques-ce1-calculer-avec-des-nombres-entiers",
      citation: "Calculer mentalement.",
    },
    lecon: [],
    exercices: [exercice],
  };
}

const desAdditions = {
  type: "calcul",
  titre: "Calcul mental",
  operations: [
    { q: "3 + 4", r: 7 },
    { q: "Moitié de 10", r: 5, aide: "Partage en deux parts égales." },
    { q: "5 − 5", r: 0 },
  ],
};

function exerciceCalcul(exercice: unknown) {
  const lu = lireLecon(leconAvec(exercice)).exercices[0];
  if (lu.type !== "calcul") throw new Error("exercice « calcul » attendu");
  return lu;
}

Deno.test("un exercice « calcul » donne ses opérations avec énoncé, résultat et aide facultative", () => {
  const exercice = exerciceCalcul(desAdditions);

  assertEquals(exercice.operations, [
    { q: "3 + 4", r: 7, aide: undefined },
    { q: "Moitié de 10", r: 5, aide: "Partage en deux parts égales." },
    { q: "5 − 5", r: 0, aide: undefined },
  ]);
});

Deno.test("un exercice « calcul » sans opérations ni générateur tire cinq additions de 1 à 10", () => {
  const { operations: _operations, ...sansOperations } = desAdditions;

  const exercice = exerciceCalcul(sansOperations);

  assertEquals(exercice.operations, undefined);
  assertEquals(exercice.generateur, { op: "+", a: [1, 10], b: [1, 10], combien: 5 });
});

Deno.test("une opération mal formée rend la leçon mal formée", () => {
  const operationsMalFormees = [
    { q: "", r: 7 },
    { r: 7 },
    { q: "3 + 4" },
    { q: "3 + 4", r: "7" },
    { q: "3 + 4", r: -1 },
    { q: "3 + 4", r: 7.5 },
    { q: "3 + 4", r: 7, aide: 3 },
  ];
  for (const operation of operationsMalFormees) {
    const exercice = { ...desAdditions, operations: [operation] };
    assertThrows(() => lireLecon(leconAvec(exercice)), LeconMalFormee, undefined, JSON.stringify(operation));
  }
});
