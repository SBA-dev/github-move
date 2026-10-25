import { assertEquals } from "@std/assert";
import type { GenerateurComplet } from "../../catalogue/domain/exercices/generateur-d-operations.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { tirerLesOperations } from "./tirage-d-operations.ts";

function generateur(partiel: Partial<GenerateurComplet>): GenerateurComplet {
  return { op: "+", a: [1, 10], b: [1, 10], cible: 10, combien: 1, ...partiel };
}

function questionsEtResultats(operations: readonly { q: string; r: number }[]) {
  return operations.map(({ q, r }) => ({ q, r }));
}

Deno.test("le tirage donne autant d'opérations que demandé, avec des nombres bornés inclus dans les intervalles", () => {
  const hasard = hasardFixe(0, 0, 0.999, 0.999);

  const operations = tirerLesOperations(generateur({ a: [2, 5], b: [3, 9], combien: 2 }), hasard);

  assertEquals(questionsEtResultats(operations), [
    { q: "2 + 3", r: 5 },
    { q: "5 + 9", r: 14 },
  ]);
});

Deno.test("une soustraction tirée ne donne jamais un résultat négatif", () => {
  const hasard = hasardFixe(0.25, 0.75);

  const operations = tirerLesOperations(generateur({ op: "-" }), hasard);

  assertEquals(questionsEtResultats(operations), [{ q: "8 − 3", r: 5 }]);
});

Deno.test("une division tirée a pour résultat le premier nombre tiré", () => {
  const hasard = hasardFixe(0.25, 0.5);

  const operations = tirerLesOperations(generateur({ op: ":", a: [2, 9], b: [2, 5] }), hasard);

  assertEquals(questionsEtResultats(operations), [{ q: "16 : 4", r: 4 }]);
});

Deno.test("un complément a pour résultat ce qui manque pour atteindre la cible", () => {
  const hasard = hasardFixe(0.25);

  const operations = tirerLesOperations(generateur({ op: "complement", a: [1, 10], cible: 10 }), hasard);

  assertEquals(questionsEtResultats(operations), [{ q: "3 + … = 10", r: 7 }]);
});

Deno.test("quand l'enfant se trompe souvent, les nombres tirés deviennent plus petits", () => {
  const hasard = hasardFixe(0.999, 0.999);

  const operations = tirerLesOperations(generateur({ a: [1, 20], b: [1, 20] }), hasard, 0.65);

  assertEquals(questionsEtResultats(operations), [{ q: "13 + 13", r: 26 }]);
});
