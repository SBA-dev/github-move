import { assertEquals } from "@std/assert";
import { type Exercice, lireLecon } from "../../../catalogue/domain/index.ts";
import { consigneAffichee } from "./consigne-affichee.ts";

function exerciceDe(brut: Record<string, unknown>): Exercice {
  const lecon = lireLecon({
    id: "fr-cp-consigne",
    matiere: "francais",
    niveau: "CP",
    titre: "Leçon de test",
    ordre: 1,
    programme: { section: "c2-test", citation: "Citation de test." },
    lecon: [],
    exercices: [brut],
  });
  return lecon.exercices[0];
}

Deno.test("en classer, la consigne affichée est celle de l'exercice", () => {
  const exercice = exerciceDe({
    type: "classer",
    consigne: "Trouve la bonne maison.",
    groupes: [{ id: "g-ou", nom: "ou" }, { id: "g-on", nom: "on" }],
    items: [{ texte: "loup", groupe: "g-ou" }, { texte: "pont", groupe: "g-on" }],
  });

  assertEquals(consigneAffichee(exercice), "Trouve la bonne maison.");
});

Deno.test("en classer sans consigne propre, la consigne affichée est la consigne par défaut", () => {
  const exercice = exerciceDe({
    type: "classer",
    groupes: [{ id: "g-ou", nom: "ou" }, { id: "g-on", nom: "on" }],
    items: [{ texte: "loup", groupe: "g-ou" }, { texte: "pont", groupe: "g-on" }],
  });

  assertEquals(consigneAffichee(exercice), "Range chaque étiquette dans la bonne maison.");
});

Deno.test("en ordre, la consigne affichée est celle de l'exercice", () => {
  const exercice = exerciceDe({ type: "ordre", consigne: "Mets dans l'ordre.", elements: ["a", "b", "c"] });

  assertEquals(consigneAffichee(exercice), "Mets dans l'ordre.");
});

Deno.test("en bulles, la consigne affichée est celle de l'exercice", () => {
  const exercice = exerciceDe({
    type: "bulles",
    consigne: "Choisis la bonne bulle.",
    questions: [{ question: "Combien font 2 + 1 ?", choix: ["2", "3"], reponse: "3" }],
  });

  assertEquals(consigneAffichee(exercice), "Choisis la bonne bulle.");
});

Deno.test("en texte à trous, la consigne affichée est celle de l'exercice", () => {
  const exercice = exerciceDe({ type: "trous", consigne: "Complète chaque phrase.", texte: "Je [suis] ici." });

  assertEquals(consigneAffichee(exercice), "Complète chaque phrase.");
});

Deno.test("en dictée, aucune consigne n'est affichée", () => {
  const exercice = exerciceDe({ type: "dictee", mots: [{ mot: "chat" }] });

  assertEquals(consigneAffichee(exercice), undefined);
});

Deno.test("en poésie à mémoriser, aucune consigne n'est affichée", () => {
  const exercice = exerciceDe({
    type: "memoriser",
    consigne: "Écoute, puis remets les vers dans l'ordre.",
    vers: ["Un", "Deux"],
  });

  assertEquals(consigneAffichee(exercice), undefined);
});

Deno.test("un exercice sans consigne n'affiche aucune consigne", () => {
  const exercice = exerciceDe({
    type: "bulles",
    questions: [{ question: "Combien font 2 + 1 ?", choix: ["2", "3"], reponse: "3" }],
  });

  assertEquals(consigneAffichee(exercice), undefined);
});
