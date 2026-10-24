import { assertEquals, assertThrows } from "@std/assert";
import { LeconMalFormee } from "../erreurs.ts";
import { lireLecon } from "../lire-lecon.ts";

function leconAvec(exercice: unknown): Record<string, unknown> {
  return {
    id: "ma-cp-addition-posee",
    matiere: "maths",
    niveau: "CP",
    titre: "L'addition posée",
    ordre: 9,
    programme: {
      section: "c2-mathematiques-cp-calculer-avec-des-nombres-entiers",
      citation: "Calculer en ligne.",
    },
    lecon: [],
    exercices: [exercice],
  };
}

function exerciceAddition(exercice: unknown) {
  const lu = lireLecon(leconAvec(exercice)).exercices[0];
  if (lu.type !== "addition") throw new Error("exercice « addition » attendu");
  return lu;
}

const uneAdditionPosee = { type: "addition", titre: "La leçon en action : 45 + 37", operations: [[45, 37]] };

Deno.test("un exercice « addition » donne ses opérations et pose puis calcule par défaut", () => {
  const exercice = exerciceAddition(uneAdditionPosee);

  assertEquals(exercice.operations, [[45, 37]]);
  assertEquals(exercice.generateur, undefined);
  assertEquals(exercice.etapes, ["poser", "calculer"]);
});

Deno.test("un exercice « addition » garde les étapes demandées", () => {
  const exercice = exerciceAddition({ ...uneAdditionPosee, etapes: ["calculer"] });

  assertEquals(exercice.etapes, ["calculer"]);
});

Deno.test("une étape inconnue rend la leçon mal formée", () => {
  const exercice = { ...uneAdditionPosee, etapes: ["poser", "verifier"] };

  assertThrows(() => lireLecon(leconAvec(exercice)), LeconMalFormee);
});

Deno.test("une opération de moins de deux nombres entiers positifs rend la leçon mal formée", () => {
  const operationsMalFormees = [[], [[45]], [[45, -3]], [[45, 3.5]], [[45, "37"]], [45, 37], [[45, 37], [12]]];
  for (const operations of operationsMalFormees) {
    const exercice = { ...uneAdditionPosee, operations };
    assertThrows(() => lireLecon(leconAvec(exercice)), LeconMalFormee, undefined, JSON.stringify(operations));
  }
});

Deno.test("une opération à trois nombres est acceptée", () => {
  const exercice = exerciceAddition({ ...uneAdditionPosee, operations: [[120, 45, 8]] });

  assertEquals(exercice.operations, [[120, 45, 8]]);
});

Deno.test("une opération dont la somme atteint 1 000 rend la leçon mal formée", () => {
  const exercice = { ...uneAdditionPosee, operations: [[500, 500]] };

  assertThrows(() => lireLecon(leconAvec(exercice)), LeconMalFormee);
});

Deno.test("une opération dont la somme est 999 est acceptée", () => {
  const exercice = exerciceAddition({ ...uneAdditionPosee, operations: [[489, 510]] });

  assertEquals(exercice.operations, [[489, 510]]);
});

function uneAdditionGeneree(generateur: unknown) {
  return { type: "addition", titre: "Calculer avec la retenue", etapes: ["calculer"], generateur };
}

Deno.test("un générateur d'additions complet est gardé tel quel", () => {
  const exercice = exerciceAddition(uneAdditionGeneree({ nombres: 2, min: 15, max: 59, retenue: true, combien: 3 }));

  assertEquals(exercice.generateur, { nombres: 2, min: 15, max: 59, retenue: true, combien: 3 });
  assertEquals(exercice.operations, undefined);
});

Deno.test("un générateur d'additions sans bornes est complété : deux nombres de 10 à 99, sans retenue, trois opérations", () => {
  const exercice = exerciceAddition(uneAdditionGeneree({}));

  assertEquals(exercice.generateur, { nombres: 2, min: 10, max: 99, retenue: false, combien: 3 });
});

Deno.test("sans opérations ni générateur, l'addition tire trois additions de 12 à 59 avec retenue", () => {
  const exercice = exerciceAddition({ type: "addition" });

  assertEquals(exercice.operations, undefined);
  assertEquals(exercice.generateur, { nombres: 2, min: 12, max: 59, retenue: true, combien: 3 });
});

Deno.test("un générateur d'additions mal formé rend la leçon mal formée", () => {
  const generateursMalFormes = [
    { min: 5.5 },
    { min: 60, max: 59 },
    { nombres: 1 },
    { combien: 0 },
    { retenue: "oui" },
    { nombres: 2, max: 500 },
    { nombres: 3, min: 100, max: 400 },
  ];
  for (const generateur of generateursMalFormes) {
    assertThrows(
      () => lireLecon(leconAvec(uneAdditionGeneree(generateur))),
      LeconMalFormee,
      undefined,
      JSON.stringify(generateur),
    );
  }
});

Deno.test("un générateur dont la plus grande somme possible est 999 est accepté", () => {
  const exercice = exerciceAddition(uneAdditionGeneree({ nombres: 3, min: 100, max: 333 }));

  assertEquals(exercice.generateur?.max, 333);
});

Deno.test("un générateur d'additions avec retenue qui ne permet aucune retenue rend la leçon mal formée", () => {
  const generateur = { nombres: 2, min: 0, max: 4, retenue: true };

  assertThrows(() => lireLecon(leconAvec(uneAdditionGeneree(generateur))), LeconMalFormee);
});
