import { assertEquals, assertThrows } from "@std/assert";
import type { GenerateurComplet } from "../../catalogue/domain/exercices/generateur-d-operations.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { TirageHorsDuGenerateur } from "./erreurs.ts";
import { enonceTire, relireLesOperations, tirerLesOperations } from "./tirage-d-operations.ts";

function generateur(partiel: Partial<GenerateurComplet>): GenerateurComplet {
  return { op: "+", a: [1, 10], b: [1, 10], cible: 10, combien: 1, ...partiel };
}

function assertTirageRelu(g: GenerateurComplet, ...tirages: number[]) {
  const tirees = tirerLesOperations(g, hasardFixe(...tirages));

  const relues = relireLesOperations(g, tirees.map(enonceTire));

  assertEquals(relues, tirees);
}

function assertRefuse(g: GenerateurComplet, ligne: string) {
  assertThrows(() => relireLesOperations(g, [ligne]), TirageHorsDuGenerateur);
}

Deno.test("une soustraction tirée est relue telle quelle", () => {
  assertTirageRelu(generateur({ op: "-" }), 0.25, 0.75);
});

Deno.test("une soustraction dont le résultat serait négatif est refusée", () => {
  assertRefuse(generateur({ op: "-" }), "2 − 9 = -7");
});

Deno.test("une soustraction au résultat faux est refusée", () => {
  assertRefuse(generateur({ op: "-" }), "8 − 3 = 4");
});

Deno.test("une soustraction hors des intervalles du générateur est refusée", () => {
  assertRefuse(generateur({ op: "-" }), "50 − 3 = 47");
});

Deno.test("une multiplication tirée est relue telle quelle", () => {
  assertTirageRelu(generateur({ op: "×", a: [2, 9], b: [2, 5] }), 0.25, 0.5);
});

Deno.test("une multiplication au résultat faux est refusée", () => {
  assertRefuse(generateur({ op: "×", a: [2, 9], b: [2, 5] }), "3 × 4 = 13");
});

Deno.test("une multiplication hors des intervalles du générateur est refusée", () => {
  assertRefuse(generateur({ op: "×", a: [2, 9], b: [2, 5] }), "9 × 7 = 63");
});

Deno.test("une division tirée est relue telle quelle", () => {
  assertTirageRelu(generateur({ op: ":", a: [2, 9], b: [2, 5] }), 0.25, 0.5);
});

Deno.test("une division qui ne tombe pas juste est refusée", () => {
  assertRefuse(generateur({ op: ":", a: [2, 9], b: [2, 5] }), "12 : 5 = 2");
});

Deno.test("une division hors des intervalles du générateur est refusée", () => {
  assertRefuse(generateur({ op: ":", a: [2, 9], b: [2, 5] }), "60 : 6 = 10");
});

Deno.test("un complément tiré est relu tel quel", () => {
  assertTirageRelu(generateur({ op: "complement", a: [1, 10], cible: 10 }), 0.25);
});

Deno.test("un complément vers une autre cible est refusé", () => {
  assertRefuse(generateur({ op: "complement", a: [1, 10], cible: 10 }), "3 + … = 9 = 6");
});

Deno.test("un complément au résultat faux est refusé", () => {
  assertRefuse(generateur({ op: "complement", a: [1, 10], cible: 10 }), "3 + … = 10 = 6");
});

Deno.test("un complément dont le premier nombre est hors de l'intervalle est refusé", () => {
  assertRefuse(generateur({ op: "complement", a: [1, 5], cible: 10 }), "7 + … = 10 = 3");
});
