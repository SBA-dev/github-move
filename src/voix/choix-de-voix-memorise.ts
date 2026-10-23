import { ChoixDeVoix, type ChoixDeVoixDeLAppareil } from "@domain/voix";

export const CLE_VOIX = "savanturier:voix";

export class ChoixDeVoixMemoriseSurLAppareil implements ChoixDeVoixDeLAppareil {
  private choixDeLaSession: ChoixDeVoix = ChoixDeVoix.automatique;

  lire(): ChoixDeVoix {
    try {
      return ChoixDeVoix.imposee(localStorage.getItem(CLE_VOIX) ?? "");
    } catch {
      return this.choixDeLaSession;
    }
  }

  memoriser(choix: ChoixDeVoix): void {
    this.choixDeLaSession = choix;
    try {
      if (choix.type === "automatique") localStorage.removeItem(CLE_VOIX);
      else localStorage.setItem(CLE_VOIX, choix.nomDeLaVoix);
    } catch {
      // Mémorisation impossible : le choix vaut jusqu'à la fermeture de l'application.
    }
  }
}
