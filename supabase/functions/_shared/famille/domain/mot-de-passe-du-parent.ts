import { MotDePasseNonConforme, MotDePasseTropLong } from "./erreurs.ts";
import { ReglesDuMotDePasse } from "./regles-du-mot-de-passe.ts";

export class MotDePasseDuParent {
  static readonly LONGUEUR_MAXIMALE = 64;

  private constructor(readonly valeur: string) {}

  static de(saisie: string): MotDePasseDuParent {
    const reglesManquantes = ReglesDuMotDePasse.verifier(saisie).filter((r) => !r.respectee);
    if (reglesManquantes.length > 0) {
      throw new MotDePasseNonConforme(reglesManquantes);
    }
    if ([...saisie].length > MotDePasseDuParent.LONGUEUR_MAXIMALE) {
      throw new MotDePasseTropLong(MotDePasseDuParent.LONGUEUR_MAXIMALE);
    }
    return new MotDePasseDuParent(saisie);
  }

  toString(): string {
    return "MotDePasseDuParent(masqué)";
  }

  toJSON(): string {
    return this.toString();
  }
}
