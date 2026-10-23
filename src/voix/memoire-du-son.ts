import type { EtatDuSon } from "@domain/voix";

export const CLE_SON = "savanturier:son";

export function lireLEtatDuSon(): EtatDuSon {
  try {
    return localStorage.getItem(CLE_SON) === "muet" ? "muet" : "son";
  } catch {
    return "son";
  }
}

export function memoriserLEtatDuSon(etat: EtatDuSon): void {
  try {
    localStorage.setItem(CLE_SON, etat);
  } catch {
    // Mémorisation impossible : le choix vaut jusqu'à la fermeture de l'application.
  }
}
