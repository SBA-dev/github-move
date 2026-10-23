import { assertEquals, assertThrows } from "@std/assert";
import { seanceComplete, seanceDUnExercice } from "./choix-de-seance.ts";
import { LeconSansExercice } from "./erreurs.ts";
import { planDeSeance } from "./plan-de-seance.ts";
import { laLeconDesSons, uneLeconAvecExercices } from "../test_utils/lecons-de-test.ts";

Deno.test("une séance complète lit toutes les étapes de leçon dans l'ordre, puis joue tous les exercices dans l'ordre", () => {
  const lecon = laLeconDesSons();

  const plan = planDeSeance(lecon, seanceComplete());

  assertEquals(plan.etapes, lecon.etapes);
  assertEquals(plan.positionsDesExercices, [0, 1]);
});

Deno.test("une séance d'un exercice joue cet exercice seul, sans étape de leçon", () => {
  const lecon = laLeconDesSons();

  const plan = planDeSeance(lecon, seanceDUnExercice(lecon, 1));

  assertEquals(plan.etapes, []);
  assertEquals(plan.positionsDesExercices, [1]);
});

Deno.test("une séance complète d'une leçon sans exercice est refusée", () => {
  const lecon = uneLeconAvecExercices();

  assertThrows(() => planDeSeance(lecon, seanceComplete()), LeconSansExercice);
});
