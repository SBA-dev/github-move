import type { Lieu } from "../navigation.ts";

/** Comment un écran de l'enfant arrive : en glissant dans le sens où l'on avance ou où l'on revient, en fondu, ou sans effet. */
export type Transition = "avancer" | "revenir" | "fondu" | "aucune";

export function transitionVers(lieu: Lieu, viaRetour: boolean): Transition {
  switch (lieu.ecran) {
    case "medailles":
    case "episode":
      return "fondu";
    case "accueil":
    case "espace-parent":
      return "aucune";
    default:
      return viaRetour ? "revenir" : "avancer";
  }
}

/** Deux lieux ont la même clé quand ils sont le même écran : la leçon ouverte compte, pas la question de la séance. */
export function cleDeLEcran(lieu: Lieu): string {
  switch (lieu.ecran) {
    case "lecon":
    case "seance":
      return `${lieu.ecran}/${lieu.leconId}`;
    case "episode":
      return `${lieu.ecran}/${lieu.numero}`;
    default:
      return lieu.ecran;
  }
}
