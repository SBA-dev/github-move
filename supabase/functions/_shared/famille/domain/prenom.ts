import { PrenomObligatoire } from "./erreurs.ts";

const LONGUEUR_MAXIMALE = 20;

export class Prenom {
  private constructor(readonly valeur: string) {}

  static de(brut: string): Prenom {
    const nettoye = brut.trim();
    if (nettoye === "") throw new PrenomObligatoire();
    return new Prenom(Array.from(nettoye).slice(0, LONGUEUR_MAXIMALE).join(""));
  }

  correspondA(autre: Prenom): boolean {
    return versLaForme(this.valeur) === versLaForme(autre.valeur);
  }
}

function versLaForme(valeur: string): string {
  return valeur.normalize("NFD").replace(/\p{M}/gu, "").toLowerCase();
}
