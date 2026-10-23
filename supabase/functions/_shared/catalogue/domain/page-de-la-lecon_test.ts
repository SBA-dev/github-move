import { assertEquals } from "@std/assert";
import { lireLecon } from "./lire-lecon.ts";
import { pageDeLaLecon } from "./page-de-la-lecon.ts";
import { uneLeconBrute, unExerciceBrut, unGuideBrut } from "../test_utils/lecons-de-test.ts";

const exercicesDesSons = [
  unExerciceBrut("bulles", { titre: "Quel son entends-tu ?" }),
  unExerciceBrut("classer", { titre: "Les maisons des sons" }),
];

Deno.test("la page de la leçon donne le titre et la ligne « niveau · matière »", () => {
  const page = pageDeLaLecon(lireLecon(uneLeconBrute()));

  assertEquals(page.titre, "Les sons ou, on, an");
  assertEquals(page.niveauEtMatiere, "CP · Français");
});

Deno.test("la ligne « niveau · matière » utilise le libellé de la matière", () => {
  const page = pageDeLaLecon(lireLecon(uneLeconBrute({ matiere: "histoire", niveau: "CM1" })));

  assertEquals(page.niveauEtMatiere, "CM1 · Histoire et géographie");
});

Deno.test("la page de la leçon propose chaque exercice avec son titre, le libellé de son type et sa position", () => {
  const page = pageDeLaLecon(lireLecon(uneLeconBrute({ exercices: exercicesDesSons })));

  assertEquals(page.exercices, [
    { position: 0, titre: "Quel son entends-tu ?", libelleDuType: "Bulles-réponses" },
    { position: 1, titre: "Les maisons des sons", libelleDuType: "Ranger dans les maisons" },
  ]);
});

Deno.test("un exercice sans titre est proposé sous le libellé de son type", () => {
  const sansTitre = { type: "calcul", operations: [{ q: "2 + 1", r: 3 }] };

  const page = pageDeLaLecon(lireLecon(uneLeconBrute({ exercices: [sansTitre] })));

  assertEquals(page.exercices[0].titre, "Calcul");
});

Deno.test("la position d'un exercice écarté ne décale pas les exercices gardés", () => {
  const page = pageDeLaLecon(lireLecon(uneLeconBrute({
    exercices: [unExerciceBrut("puzzle"), unExerciceBrut("bulles", { titre: "Quel son entends-tu ?" })],
  })));

  assertEquals(page.exercices.map((exercice) => exercice.position), [0]);
});

Deno.test("le passage pour les adultes donne la citation du programme et la section", () => {
  const page = pageDeLaLecon(lireLecon(uneLeconBrute()));

  assertEquals(page.passagePourLesAdultes.programme, {
    citation: "Décoder et encoder de 25 à 30 CGP.",
    section: "c2-francais-cp-identifier-les-mots-de-maniere-de-plus-en-plus-aisee",
  });
});

Deno.test("le passage pour les adultes cite le guide fondamental avec son titre, sa page et son extrait", () => {
  const page = pageDeLaLecon(lireLecon(uneLeconBrute({ guide: unGuideBrut() })));

  assertEquals(page.passagePourLesAdultes.guideFondamental, {
    titre: "Pour enseigner les nombres, le calcul et la résolution de problèmes au CP",
    page: 53,
    extrait:
      "La situation de la boîte est une situation de référence pour enseigner ce passage du comptage au calcul dès la première période du CP.",
  });
});

Deno.test("une leçon sans guide fondamental n'en cite aucun", () => {
  const page = pageDeLaLecon(lireLecon(uneLeconBrute()));

  assertEquals(page.passagePourLesAdultes.guideFondamental, undefined);
});
