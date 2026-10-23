import { ChoixDeVoix, type ChoixDeVoixDeLAppareil } from "@domain/voix";

export const CLE_VOIX = "savanturier:voix";

export class ChoixDeVoixMemoriseSurLAppareil implements ChoixDeVoixDeLAppareil {
  private choixJusquAFermetureDeLApplication: ChoixDeVoix = ChoixDeVoix.automatique;
  private memorisationSurLAppareilImpossible = false;

  lire(): ChoixDeVoix {
    if (this.memorisationSurLAppareilImpossible) return this.choixJusquAFermetureDeLApplication;
    try {
      return ChoixDeVoix.imposee(localStorage.getItem(CLE_VOIX) ?? "");
    } catch {
      return this.choixJusquAFermetureDeLApplication;
    }
  }

  memoriser(choix: ChoixDeVoix): void {
    this.choixJusquAFermetureDeLApplication = choix;
    try {
      if (choix.type === "automatique") localStorage.removeItem(CLE_VOIX);
      else localStorage.setItem(CLE_VOIX, choix.nomDeLaVoix);
      this.memorisationSurLAppareilImpossible = false;
    } catch {
      this.memorisationSurLAppareilImpossible = true;
    }
  }
}
