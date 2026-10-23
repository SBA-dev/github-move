import { assertEquals } from "@std/assert";
import {
  accueillirSurLaPageDeLaLecon,
  annoncerExerciceSuivant,
  inviterAJouerApresLesEtapes,
} from "./paroles-de-seance.ts";
import { hasardFixe } from "../test_utils/hasard-fixe.ts";

Deno.test("le personnage guide accueille l'enfant par son prénom sur la page de la leçon", () => {
  const texte = accueillirSurLaPageDeLaLecon("Léa");

  assertEquals(
    texte,
    "Coucou Léa ! Je t'explique la leçon, et après, on joue. Tu peux aussi choisir directement un jeu.",
  );
});

Deno.test("à la fin des étapes de leçon, un premier tirage invite à jouer avec « À toi de jouer maintenant ! »", () => {
  const parole = inviterAJouerApresLesEtapes(hasardFixe(0));

  assertEquals(parole.texte, "À toi de jouer maintenant !");
});

Deno.test("à la fin des étapes de leçon, le dernier tirage invite à jouer avec « Prêt ? On joue ! »", () => {
  const parole = inviterAJouerApresLesEtapes(hasardFixe(0.99));

  assertEquals(parole.texte, "Prêt ? On joue !");
});

Deno.test("à la fin des étapes de leçon, un tirage du milieu donne « C'est parti, à toi ! »", () => {
  const parole = inviterAJouerApresLesEtapes(hasardFixe(0.5));

  assertEquals(parole.texte, "C'est parti, à toi !");
});

Deno.test("à la fin des étapes de leçon, le personnage guide applaudit", () => {
  const parole = inviterAJouerApresLesEtapes(hasardFixe(0));

  assertEquals(parole.humeur, "applaudit");
});

Deno.test("l'annonce de l'exercice suivant commence par « Nouveau défi » au premier tirage", () => {
  const texte = annoncerExerciceSuivant("Les maisons des sons", hasardFixe(0));

  assertEquals(texte, "Nouveau défi : Les maisons des sons !");
});

Deno.test("l'annonce de l'exercice suivant commence par « Jeu suivant » au tirage du milieu", () => {
  const texte = annoncerExerciceSuivant("Les maisons des sons", hasardFixe(0.5));

  assertEquals(texte, "Jeu suivant : Les maisons des sons !");
});

Deno.test("l'annonce de l'exercice suivant commence par « Place au jeu » au dernier tirage", () => {
  const texte = annoncerExerciceSuivant("Les maisons des sons", hasardFixe(0.99));

  assertEquals(texte, "Place au jeu : Les maisons des sons !");
});
