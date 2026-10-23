import { LienDeConnexionMalForme } from "./erreurs.ts";

const ADRESSE_WEB_ABSOLUE_SANS_ESPACE = /^https?:\/\/[^\s/]+\S*$/;

export class LienDeConnexion {
  private constructor(readonly valeur: string) {}

  static de(brut: string): LienDeConnexion {
    if (!ADRESSE_WEB_ABSOLUE_SANS_ESPACE.test(brut)) throw new LienDeConnexionMalForme();
    return new LienDeConnexion(brut);
  }
}
