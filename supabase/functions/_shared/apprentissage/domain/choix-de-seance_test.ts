import { assertEquals, assertThrows } from "@std/assert";
import { seanceComplete, seanceDUnExercice } from "./choix-de-seance.ts";
import { ExerciceIntrouvable } from "./erreurs.ts";
import { laLeconDesSons } from "../test_utils/lecons-de-test.ts";

Deno.test("une séance complète est un choix de la leçon entière", () => {
  assertEquals(seanceComplete(), { genre: "complete" });
});

Deno.test("une séance d'un exercice retient la position d'un exercice qui existe dans la leçon", () => {
  const choix = seanceDUnExercice(laLeconDesSons(), 1);

  assertEquals(choix, { genre: "unExercice", position: 1 });
});

Deno.test("une séance d'un exercice dont la position dépasse le dernier exercice est refusée", () => {
  assertThrows(() => seanceDUnExercice(laLeconDesSons(), 2), ExerciceIntrouvable);
});

Deno.test("une séance d'un exercice à une position négative est refusée", () => {
  assertThrows(() => seanceDUnExercice(laLeconDesSons(), -1), ExerciceIntrouvable);
});
