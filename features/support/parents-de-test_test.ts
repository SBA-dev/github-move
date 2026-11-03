import { assertEquals, assertThrows } from "@std/assert";
import {
  ADRESSES_DES_SCENARIOS,
  equipeDesTests,
  PLAFOND_DES_PARENTS_DE_TEST,
  suffixeDesParentsDeTest,
} from "./parents-de-test.ts";

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

Deno.test("le plafond total des parents de test est le produit des équipes actives, des projets, des workers et des adresses", () => {
  const { equipesActivesParMois, projets, workers, adresses, total } = PLAFOND_DES_PARENTS_DE_TEST;

  assertEquals(total, equipesActivesParMois * projets * workers * adresses);
});

Deno.test("le plafond compte autant d'adresses que d'adresses de scénario", () => {
  assertEquals(PLAFOND_DES_PARENTS_DE_TEST.adresses, ADRESSES_DES_SCENARIOS.length);
});

Deno.test("le plafond des parents de test reste de l'ordre de quelques centaines", () => {
  assertEquals(PLAFOND_DES_PARENTS_DE_TEST.total < 500, true);
});

Deno.test("chaque adresse de scénario est une adresse de test en exemple.test", () => {
  for (const adresse of ADRESSES_DES_SCENARIOS) {
    assertEquals(adresse.endsWith("@exemple.test"), true);
  }
});
