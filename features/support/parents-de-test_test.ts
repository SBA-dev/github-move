import { assertEquals } from "@std/assert";
import { suffixeDesParentsDeTest } from "./parents-de-test.ts";

Deno.test("le suffixe des parents de test est composé de l'équipe, du projet et de l'index du worker", () => {
  const source = { equipe: "146", projet: "telephone", indexDuWorker: 0 };

  assertEquals(suffixeDesParentsDeTest(source), "146-telephone0");
});

Deno.test("le suffixe des parents de test est le même d'un appel à l'autre", () => {
  const source = { equipe: "146", projet: "tablette", indexDuWorker: 2 };

  assertEquals(suffixeDesParentsDeTest(source), suffixeDesParentsDeTest({ ...source }));
});
