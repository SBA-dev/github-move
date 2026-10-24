import { NiveauInconnu } from "./erreurs.ts";

const CODES_DE_NIVEAU = ["CP", "CE1", "CE2", "CM1", "CM2"] as const;

export type CodeDeNiveau = typeof CODES_DE_NIVEAU[number];

export class Niveau {
  private constructor(readonly valeur: CodeDeNiveau) {}

  static tous(): Niveau[] {
    return CODES_DE_NIVEAU.map((code) => new Niveau(code));
  }

  static de(brut: string): Niveau {
    const code = CODES_DE_NIVEAU.find((code) => code === brut);
    if (code === undefined) throw new NiveauInconnu(brut);
    return new Niveau(code);
  }

  estAuDessusDe(autre: Niveau): boolean {
    return CODES_DE_NIVEAU.indexOf(this.valeur) > CODES_DE_NIVEAU.indexOf(autre.valeur);
  }
}
