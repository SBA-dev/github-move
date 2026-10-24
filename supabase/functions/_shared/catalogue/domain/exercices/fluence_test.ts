import { assertEquals, assertThrows } from "@std/assert";
import { LeconMalFormee } from "../erreurs.ts";
import { lireLecon } from "../lire-lecon.ts";

function leconAvec(exercice: unknown): Record<string, unknown> {
  return {
    id: "ma-cp-doubles",
    matiere: "maths",
    niveau: "CP",
    titre: "Les doubles",
    ordre: 4,
    programme: {
      section: "c2-mathematiques-cp-calculer-avec-des-nombres-entiers",
      citation: "Calculer mentalement.",
    },
    lecon: [],
    exercices: [exercice],
  };
}

function exerciceFluence(exercice: unknown) {
  const lu = lireLecon(leconAvec(exercice)).exercices[0];
  if (lu.type !== "fluence") throw new Error("exercice « fluence » attendu");
  return lu;
}

const lesDoubles = {
  type: "fluence",
  titre: "Calcul rapide : les doubles",
  duree: 45,
  generateur: { op: "×", a: [1, 10], b: [2, 2] },
};

Deno.test("un exercice « fluence » donne sa durée en secondes et son générateur d'opérations", () => {
  const exercice = exerciceFluence(lesDoubles);

  assertEquals(exercice.duree, 45);
  assertEquals(exercice.generateur, { op: "×", a: [1, 10], b: [2, 2], cible: 10, combien: 5 });
});

Deno.test("un exercice « fluence » sans durée dure 60 secondes", () => {
  const { duree: _duree, ...sansDuree } = lesDoubles;

  assertEquals(exerciceFluence(sansDuree).duree, 60);
});

Deno.test("un exercice « fluence » sans générateur tire des additions de 1 à 10", () => {
  const { generateur: _generateur, ...sansGenerateur } = lesDoubles;

  const exercice = exerciceFluence(sansGenerateur);

  assertEquals(exercice.generateur, { op: "+", a: [1, 10], b: [1, 10], cible: 10, combien: 5 });
});

Deno.test("une durée nulle, négative ou non numérique rend la leçon mal formée", () => {
  for (const duree of [0, -30, "45", null]) {
    assertThrows(
      () => lireLecon(leconAvec({ ...lesDoubles, duree })),
      LeconMalFormee,
      undefined,
      JSON.stringify(duree),
    );
  }
});

Deno.test("un générateur mal formé rend la leçon « fluence » mal formée", () => {
  const exercice = { ...lesDoubles, generateur: { op: "*" } };

  assertThrows(() => lireLecon(leconAvec(exercice)), LeconMalFormee);
});
