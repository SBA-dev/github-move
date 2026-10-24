import { assertEquals } from "@std/assert";
import { lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { planDuTestDeDepart } from "./plan-du-test-de-depart.ts";

const programme = { section: "section", citation: "citation" };

function leconAvecUneQuestion(ordre: number): Lecon {
  return lireLecon({
    id: `fr-ce1-lecon-${String(ordre).padStart(2, "0")}`,
    matiere: "francais",
    niveau: "CE1",
    titre: `Leçon ${ordre}`,
    ordre,
    programme,
    exercices: [{
      type: "bulles",
      questions: [{ question: "Quel son ?", choix: ["ou", "on"], reponse: "ou" }],
    }],
  });
}

function leconDeDicteeSeule(ordre: number): Lecon {
  return lireLecon({
    id: `fr-ce1-lecon-${String(ordre).padStart(2, "0")}`,
    matiere: "francais",
    niveau: "CE1",
    titre: `Leçon ${ordre}`,
    ordre,
    programme,
    exercices: [{ type: "dictee", mots: [{ mot: "chat" }] }],
  });
}

const lesLecons = (nombre: number) => Array.from({ length: nombre }, (_, i) => leconAvecUneQuestion(i));
const leconsDuPlan = (plan: ReturnType<typeof planDuTestDeDepart>) => plan.map(({ leconId }) => leconId);
const identifiantsAuxIndices = (indices: number[]) =>
  indices.map((i) => `fr-ce1-lecon-${String(i).padStart(2, "0")}`);

Deno.test("un CE1 avec une réserve de 19 leçons reçoit 12 questions, prises à pas réguliers dans l'ordre de la réserve", () => {
  const plan = planDuTestDeDepart(lesLecons(19), Niveau.de("CE1"), hasardSansMelange());

  assertEquals(leconsDuPlan(plan), identifiantsAuxIndices([0, 1, 3, 4, 6, 7, 9, 11, 12, 14, 15, 17]));
});

Deno.test("avec 12 leçons ou moins en réserve, le test de départ en pose une question chacune", () => {
  const plan = planDuTestDeDepart(lesLecons(5), Niveau.de("CE1"), hasardSansMelange());

  assertEquals(leconsDuPlan(plan), identifiantsAuxIndices([0, 1, 2, 3, 4]));
});

Deno.test("chaque question prévue indique sa leçon, l'exercice et le rang de la question choisie", () => {
  const plan = planDuTestDeDepart(lesLecons(1), Niveau.de("CE1"), hasardSansMelange());

  assertEquals(plan, [{ leconId: "fr-ce1-lecon-00", exercice: 0, rang: 0 }]);
});

Deno.test("une leçon sans question admissible est sautée, sans être remplacée", () => {
  const lecons = [...lesLecons(11).slice(0, 5), leconDeDicteeSeule(5), ...lesLecons(12).slice(6)];

  const plan = planDuTestDeDepart(lecons, Niveau.de("CE1"), hasardSansMelange());

  assertEquals(plan.length, 11);
  assertEquals(leconsDuPlan(plan).includes("fr-ce1-lecon-05"), false);
});

Deno.test("sans leçon en réserve, le plan du test de départ est vide", () => {
  const plan = planDuTestDeDepart([], Niveau.de("CE1"), hasardSansMelange());

  assertEquals(plan, []);
});
