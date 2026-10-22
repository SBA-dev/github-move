import { CodeDeConnexionMalForme } from "./erreurs.ts";

const SIX_CHIFFRES = /^\d{6}$/;

export class CodeDeConnexion {
  private constructor(readonly valeur: string) {}

  static de(brut: string): CodeDeConnexion {
    if (!SIX_CHIFFRES.test(brut)) throw new CodeDeConnexionMalForme();
    return new CodeDeConnexion(brut);
  }
}
