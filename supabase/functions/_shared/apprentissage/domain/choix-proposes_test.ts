import { assertEquals, assertThrows } from "@std/assert";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";
import { ChoixProposes } from "./choix-proposes.ts";
import { BonneReponseAbsenteDesChoix } from "./erreurs.ts";

// Un tirage proche de 1 laisse chaque choix à sa place (algorithme de Fisher-Yates du legacy).
const sansMelange = () => hasardFixe(0.99, 0.99, 0.99, 0.99, 0.99);

Deno.test("deux choix de même texte exact ne forment qu'un seul choix", () => {
  const choix = ChoixProposes.proposer(["2", "2", "3"], "2", sansMelange());

  assertEquals(choix.textes(), ["2", "3"]);
});

Deno.test("les choix « a » et « à » restent deux choix différents", () => {
  const choix = ChoixProposes.proposer(["a", "à", "a"], "a", sansMelange());

  assertEquals(choix.textes(), ["a", "à"]);
});

Deno.test("les choix sont mélangés par le hasard, du dernier au premier", () => {
  const choix = ChoixProposes.proposer(["1", "2", "3"], "1", hasardFixe(0, 0));

  assertEquals(choix.textes(), ["2", "3", "1"]);
});

Deno.test("un choix écarté reste dans la liste mais n'est plus possible", () => {
  const choix = ChoixProposes.proposer(["a", "b", "c"], "a", sansMelange()).ecarter("b");

  assertEquals(
    [choix.textes(), choix.ecartes(), choix.possibles()],
    [["a", "b", "c"], ["b"], ["a", "c"]],
  );
});

Deno.test("réduire à deux garde la bonne réponse et le premier autre choix non écarté", () => {
  const choix = ChoixProposes.proposer(["a", "b", "c", "d"], "c", sansMelange())
    .ecarter("a")
    .reduireADeux();

  assertEquals([choix.possibles(), choix.textes()], [["b", "c"], ["a", "b", "c", "d"]]);
});

Deno.test("réduire à deux garde la bonne réponse même placée en premier", () => {
  const choix = ChoixProposes.proposer(["a", "b", "c"], "a", sansMelange()).reduireADeux();

  assertEquals(choix.possibles(), ["a", "b"]);
});

Deno.test("des choix sans la bonne réponse sont refusés", () => {
  assertThrows(
    () => ChoixProposes.proposer(["a", "b"], "c", sansMelange()),
    BonneReponseAbsenteDesChoix,
  );
});
