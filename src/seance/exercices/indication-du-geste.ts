import type { Exercice } from "@domain/catalogue";

/** Ce que le personnage guide dit, après la consigne, pour montrer comment poser une étiquette. */
export function indicationDuGeste(exercice: Exercice): string | undefined {
  switch (exercice.type) {
    case "classer":
      return "Fais glisser chaque étiquette, ou touche-la puis touche une maison.";
    case "ordre":
      return "Touche d'abord celle qui vient en premier.";
    default:
      return undefined;
  }
}
