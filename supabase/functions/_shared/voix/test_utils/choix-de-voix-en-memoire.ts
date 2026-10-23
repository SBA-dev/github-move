import { ChoixDeVoix } from "../domain/choix-de-voix.ts";
import type { ChoixDeVoixDeLAppareil } from "../domain/choix-de-voix-de-l-appareil.ts";

export class ChoixDeVoixEnMemoire implements ChoixDeVoixDeLAppareil {
  constructor(private choix: ChoixDeVoix = ChoixDeVoix.automatique) {}

  lire(): ChoixDeVoix {
    return this.choix;
  }

  memoriser(choix: ChoixDeVoix): void {
    this.choix = choix;
  }
}
