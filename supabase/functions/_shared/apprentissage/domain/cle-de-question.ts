import { CleDeQuestionInvalide } from "./erreurs.ts";
import type { TypeDeQuestion } from "./question-suivie.ts";

const PREFIXES: Record<TypeDeQuestion, string> = {
  bulles: "b:",
  lecture: "l:",
  ecoute: "e:",
  trous: "t:",
  conjugaison: "c:",
  classer: "k:",
  ordre: "o:",
  chiffre: "h:",
  calcul: "n:",
  boite: "n:",
  barres: "p:",
  colonne: "u:",
  fluence: "f:",
  dictee: "d:",
};

export function estUnTypeDeQuestion(valeur: string): valeur is TypeDeQuestion {
  return Object.hasOwn(PREFIXES, valeur);
}

export class CleDeQuestion {
  private constructor(readonly valeur: string) {}

  static de(type: TypeDeQuestion, texte: string): CleDeQuestion {
    return new CleDeQuestion(PREFIXES[type] + normaliser(texte));
  }

  static depuisLaValeur(valeur: string): CleDeQuestion {
    const prefixe = Object.values(PREFIXES).find((candidat) => valeur.startsWith(candidat));
    const texte = prefixe === undefined ? "" : valeur.slice(prefixe.length);
    if (texte === "" || normaliser(texte) !== texte) throw new CleDeQuestionInvalide(valeur);
    return new CleDeQuestion(valeur);
  }
}

function normaliser(texte: string): string {
  return texte
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}
