import { ProfilEnfantIdVide } from "./erreurs.ts";

export class ProfilEnfantId {
  private constructor(readonly valeur: string) {}

  static de(valeur: string): ProfilEnfantId {
    if (valeur === "") throw new ProfilEnfantIdVide();
    return new ProfilEnfantId(valeur);
  }
}
