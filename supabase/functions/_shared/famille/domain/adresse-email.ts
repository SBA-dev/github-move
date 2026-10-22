import { AdresseEmailInvalide } from "./erreurs.ts";

const FORME_D_UNE_ADRESSE = /^[^@\s]+@[^@\s.]+(\.[^@\s.]+)+$/;

export class AdresseEmail {
  private constructor(readonly valeur: string) {}

  static de(brut: string): AdresseEmail {
    const adresse = brut.trim();
    if (!FORME_D_UNE_ADRESSE.test(adresse)) throw new AdresseEmailInvalide();
    return new AdresseEmail(adresse);
  }

  estLaMemeQue(autre: AdresseEmail): boolean {
    return this.valeur.toLowerCase() === autre.valeur.toLowerCase();
  }
}
