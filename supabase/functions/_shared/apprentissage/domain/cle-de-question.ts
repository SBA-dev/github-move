import type { TypeDeQuestion } from "./question-suivie.ts";

const PREFIXES: Record<TypeDeQuestion, string> = {
  bulles: "b:",
  lecture: "l:",
  ecoute: "e:",
  trous: "t:",
  classer: "k:",
  ordre: "o:",
};

export class CleDeQuestion {
  private constructor(readonly valeur: string) {}

  static de(type: TypeDeQuestion, texte: string): CleDeQuestion {
    return new CleDeQuestion(PREFIXES[type] + normaliser(texte));
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
