import { assertEquals } from "@std/assert";
import { lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { hasardFixe, hasardSansMelange } from "../test_utils/hasard-fixe.ts";
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
const identifiantsAuxIndices = (indices: number[]) => indices.map((i) => `fr-ce1-lecon-${String(i).padStart(2, "0")}`);

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

function leconAvecLesExercices(...exercices: unknown[]): Lecon {
  return lireLecon({
    id: "fr-ce1-lecon-00",
    matiere: "francais",
    niveau: "CE1",
    titre: "Leçon",
    ordre: 0,
    programme,
    exercices,
  });
}

const unChoix = { choix: ["ou", "on"], reponse: "ou" };
const bullesDe2Questions = {
  type: "bulles",
  questions: [{ question: "Quel son ?", ...unChoix }, { question: "Et celui-ci ?", ...unChoix }],
};
const ecouteDe3Items = {
  type: "ecoute",
  items: [{ dire: "cat", ...unChoix }, { dire: "dog", ...unChoix }, { dire: "fish", ...unChoix }],
};

Deno.test("la question d'une leçon est tirée parmi toutes les questions admissibles de ses exercices", () => {
  const lecon = leconAvecLesExercices(bullesDe2Questions, ecouteDe3Items);
  const questionTirée = (tirage: number) => planDuTestDeDepart([lecon], Niveau.de("CE1"), hasardFixe(tirage))[0];

  assertEquals(questionTirée(0), { leconId: "fr-ce1-lecon-00", exercice: 0, rang: 0 });
  assertEquals(questionTirée(0.5), { leconId: "fr-ce1-lecon-00", exercice: 1, rang: 0 });
  assertEquals(questionTirée(0.999), { leconId: "fr-ce1-lecon-00", exercice: 1, rang: 2 });
});

Deno.test("deux tirages différents du hasard désignent deux questions différentes d'une même leçon", () => {
  const lecon = leconAvecLesExercices(bullesDe2Questions, ecouteDe3Items);

  const [premiere] = planDuTestDeDepart([lecon], Niveau.de("CE1"), hasardFixe(0.1));
  const [seconde] = planDuTestDeDepart([lecon], Niveau.de("CE1"), hasardFixe(0.7));

  assertEquals(premiere.exercice === seconde.exercice && premiere.rang === seconde.rang, false);
});

Deno.test("une leçon qui mêle un exercice exclu et un exercice admissible pose la question de l'exercice admissible", () => {
  const lecon = leconAvecLesExercices({ type: "dictee", mots: [{ mot: "chat" }] }, ecouteDe3Items);

  const plan = planDuTestDeDepart([lecon], Niveau.de("CE1"), hasardSansMelange());

  assertEquals(plan, [{ leconId: "fr-ce1-lecon-00", exercice: 1, rang: 2 }]);
});

const exercicesAdmissibles: Record<string, { exercice: unknown; questions: number }> = {
  "bulles : une question": {
    exercice: { type: "bulles", questions: [{ question: "Quel son ?", ...unChoix }] },
    questions: 1,
  },
  "écoute : un item": { exercice: ecouteDe3Items, questions: 3 },
  "calcul en liste : une opération": {
    exercice: { type: "calcul", operations: [{ q: "2 + 3", r: 5 }, { q: "4 + 1", r: 5 }, { q: "6 + 2", r: 8 }] },
    questions: 3,
  },
  "calcul à générateur : une seule question admissible": {
    exercice: { type: "calcul", generateur: { op: "+", combien: 5 } },
    questions: 1,
  },
  "conjugaison : une forme": {
    exercice: {
      type: "conjugaison",
      verbe: "être",
      temps: "présent",
      formes: [{ pronom: "je", forme: "suis" }, { pronom: "tu", forme: "es" }, { pronom: "il", forme: "est" }],
    },
    questions: 3,
  },
  "trous : un trou": {
    exercice: { type: "trous", texte: "Le [chat] mange la [souris].", distracteurs: ["chien"] },
    questions: 2,
  },
  "classer : une étiquette": {
    exercice: {
      type: "classer",
      groupes: [{ id: "1", nom: "ou" }, { id: "2", nom: "on" }],
      items: [{ texte: "loup", groupe: "1" }, { texte: "pont", groupe: "2" }, { texte: "clou", groupe: "1" }],
    },
    questions: 3,
  },
  "addition en liste : une addition": {
    exercice: { type: "addition", operations: [[45, 37], [12, 29]] },
    questions: 2,
  },
  "addition à générateur : une seule question admissible": {
    exercice: { type: "addition", generateur: { nombres: 2, min: 15, max: 59, retenue: false, combien: 3 } },
    questions: 1,
  },
};

for (const [nom, { exercice, questions }] of Object.entries(exercicesAdmissibles)) {
  Deno.test(`une leçon dont l'exercice est de type ${nom} compte ${questions} question(s) admissible(s)`, () => {
    const lecon = leconAvecLesExercices(exercice);

    const dernierTirage = planDuTestDeDepart([lecon], Niveau.de("CE1"), hasardFixe(0.999));
    const premierTirage = planDuTestDeDepart([lecon], Niveau.de("CE1"), hasardFixe(0));

    assertEquals(dernierTirage, [{ leconId: "fr-ce1-lecon-00", exercice: 0, rang: questions - 1 }]);
    assertEquals(premierTirage, [{ leconId: "fr-ce1-lecon-00", exercice: 0, rang: 0 }]);
  });
}

const exercicesExclus: Record<string, unknown> = {
  dictee: { type: "dictee", mots: [{ mot: "chat" }] },
  lecture: { type: "lecture", texte: "Le chat dort.", questions: [{ question: "Qui dort ?", ...unChoix }] },
  ordre: { type: "ordre", elements: ["un", "deux", "trois"] },
  memoriser: { type: "memoriser", vers: ["Un vers", "Un autre vers"] },
  fluence: { type: "fluence", generateur: { op: "+", combien: 5 } },
  boite: { type: "boite", items: [{ a: 4, op: "+", b: 3 }] },
  barres: {
    type: "barres",
    items: [{
      enonce: "Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ?",
      parties: [4, 2],
      tout: null,
    }],
  },
};

for (const [type, exercice] of Object.entries(exercicesExclus)) {
  Deno.test(`une leçon dont le seul exercice est de type ${type} est sautée`, () => {
    const lecon = leconAvecLesExercices(exercice);

    const plan = planDuTestDeDepart([lecon], Niveau.de("CE1"), hasardSansMelange());

    assertEquals(plan, []);
  });
}
