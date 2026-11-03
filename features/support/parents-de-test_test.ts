import { assertEquals, assertThrows } from "@std/assert";
import { equipeDesTests, suffixeDesParentsDeTest } from "./parents-de-test.ts";

Deno.test("le suffixe des parents de test est composé de l'équipe, du projet et de l'index du worker", () => {
  const source = { equipe: "146", projet: "telephone", indexDuWorker: 0 };

  assertEquals(suffixeDesParentsDeTest(source), "146-telephone0");
});

Deno.test("le suffixe des parents de test est le même d'un appel à l'autre", () => {
  const source = { equipe: "146", projet: "tablette", indexDuWorker: 2 };

  assertEquals(suffixeDesParentsDeTest(source), suffixeDesParentsDeTest({ ...source }));
});

Deno.test("la variable E2E_EQUIPE donne l'équipe des tests", () => {
  assertEquals(equipeDesTests({ variable: "146", branche: "feature/131-boite-et-barres" }), "146");
  assertEquals(equipeDesTests({ variable: "nuit" }), "nuit");
});

Deno.test("une variable E2E_EQUIPE vide ou faite d'espaces est ignorée au profit de la branche", () => {
  assertEquals(equipeDesTests({ variable: "  ", branche: "feature/131-boite-et-barres" }), "131");
});

Deno.test("sans variable, l'équipe est le numéro de la story de la branche feature", () => {
  assertEquals(equipeDesTests({ branche: "feature/131-boite-et-barres" }), "131");
});

Deno.test("sans variable ni branche de story, l'équipe est local", () => {
  assertEquals(equipeDesTests({}), "local");
  assertEquals(equipeDesTests({ branche: "main" }), "local");
  assertEquals(equipeDesTests({ branche: "claude/xyz" }), "local");
});

Deno.test("une variable E2E_EQUIPE avec autre chose que minuscules, chiffres et tirets est refusée", () => {
  for (const variable of ["Équipe 1", "a+b", "x_y"]) {
    assertThrows(() => equipeDesTests({ variable }), Error, "E2E_EQUIPE");
  }
});
