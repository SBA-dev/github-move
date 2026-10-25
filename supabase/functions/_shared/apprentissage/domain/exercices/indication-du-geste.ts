import type { Exercice } from "../../../catalogue/domain/index.ts";

/** Ce que le personnage guide dit, après la consigne, pour montrer comment poser une étiquette. */
export function indicationDuGeste(type: Exercice["type"]): string | undefined {
  switch (type) {
    case "classer":
      return "Fais glisser chaque étiquette, ou touche-la puis touche une maison.";
    case "ordre":
    case "memoriser":
      return "Touche d'abord celle qui vient en premier.";
    default:
      return undefined;
  }
}
