import { TexteTropCourt, TexteTropLong } from "./erreurs.ts";

const LONGUEUR_MINIMALE = 3;
const LONGUEUR_MAXIMALE = 3000;

export class TexteDuParent {
  private constructor(readonly valeur: string) {}

  static de(brut: string): TexteDuParent {
    const nettoye = brut.trim();
    const longueur = Array.from(nettoye).length;
    if (longueur < LONGUEUR_MINIMALE) throw new TexteTropCourt();
    if (longueur > LONGUEUR_MAXIMALE) throw new TexteTropLong();
    return new TexteDuParent(nettoye);
  }

  elements(): string[] {
    return nonVides(this.valeur.split(/[\n,;]/));
  }

  lignes(): string[] {
    return nonVides(this.valeur.split("\n"));
  }

  phrases(): string[] {
    return nonVides(this.valeur.split(/(?<=[.!?])\s+/));
  }
}

function nonVides(morceaux: string[]): string[] {
  return morceaux.map((morceau) => morceau.trim()).filter((morceau) => morceau !== "");
}
