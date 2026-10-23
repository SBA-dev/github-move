import { assertEquals } from "@std/assert";
import { accueilDeLaLecon, annonceDeLExercice, finDesEtapes } from "./paroles-de-seance.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";

Deno.test("la page de la leçon accueille l'enfant par son prénom, sans promettre de durée", () => {
  const accueil = accueilDeLaLecon("Léa");

  assertEquals(
    accueil,
    "Coucou Léa ! Je t'explique la leçon, et après, on joue. Tu peux aussi choisir directement un jeu.",
  );
});

const phrasesDeFinDesEtapes: [number, string][] = [
  [0, "À toi de jouer maintenant !"],
  [0.5, "C'est parti, à toi !"],
  [0.99, "Prêt ? On joue !"],
];

for (const [tirage, phrase] of phrasesDeFinDesEtapes) {
  Deno.test(`à la fin des étapes de leçon, un tirage de ${tirage} donne « ${phrase} »`, () => {
    const parole = finDesEtapes(hasardFixe(tirage));

    assertEquals(parole.texte, phrase);
  });
}

Deno.test("à la fin des étapes de leçon, le personnage guide applaudit", () => {
  const parole = finDesEtapes(hasardFixe(0));

  assertEquals(parole.humeur, "applaudit");
});

const introductionsDeLExercice: [number, string][] = [
  [0, "Nouveau défi"],
  [0.5, "Jeu suivant"],
  [0.99, "Place au jeu"],
];

for (const [tirage, introduction] of introductionsDeLExercice) {
  Deno.test(`dans une séance de plusieurs exercices, un tirage de ${tirage} annonce l'exercice par « ${introduction} »`, () => {
    const annonce = annonceDeLExercice({ titre: "Les maisons des sons", nombreDExercices: 2 }, hasardFixe(tirage));

    assertEquals(annonce, `${introduction} : Les maisons des sons !`);
  });
}

Deno.test("la séance d'un seul exercice n'annonce pas l'exercice", () => {
  const annonce = annonceDeLExercice({ titre: "Les maisons des sons", nombreDExercices: 1 }, hasardFixe(0, 0));

  assertEquals(annonce, undefined);
});

Deno.test("un exercice sans titre n'est pas annoncé", () => {
  const annonce = annonceDeLExercice({ titre: undefined, nombreDExercices: 2 }, hasardFixe(0, 0));

  assertEquals(annonce, undefined);
});
