import { assertEquals } from "@std/assert";
import {
  accueillirSurLaPageDeLaLecon,
  annoncerExerciceSuivant,
  inviterAJouerApresLesEtapes,
  parolesDeFinDeSeance,
} from "./paroles-de-seance.ts";
import { universDe } from "./univers.ts";
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

const noisette = universDe("animaux").personnageGuide;

Deno.test("avec 3 étoiles, le personnage guide dit une de ses expressions puis « Trois étoiles »", () => {
  const texte = parolesDeFinDeSeance(3, "Léa", noisette, hasardFixe(0.99));

  assertEquals(texte, "Trop fort, ça ! Trois étoiles, Léa ! Tu es incroyable !");
});

Deno.test("avec 2 étoiles, le personnage guide félicite puis propose de rejouer", () => {
  const texte = parolesDeFinDeSeance(2, "Léa", noisette, hasardFixe(0.5, 0));

  assertEquals(texte, "Bravo ! Tu gagnes 2 étoiles, Léa. Tu rejoues pour aller chercher les autres ?");
});

Deno.test("avec 1 étoile, « étoile » reste au singulier", () => {
  const texte = parolesDeFinDeSeance(1, "Léa", noisette, hasardFixe(0.5, 0.99));

  assertEquals(texte, "Oui, c'est ça ! Tu gagnes 1 étoile, Léa. Tu rejoues pour aller chercher les autres ?");
});
