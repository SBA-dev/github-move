import { LangueDuParentInconnue } from "./erreurs.ts";

export type LangueProposee = { readonly code: string; readonly libelle: string };

const CODES = [
  "anglais",
  "arabe",
  "espagnol",
  "portugais",
  "turc",
  "roumain",
  "polonais",
  "italien",
  "allemand",
  "russe",
  "ukrainien",
  "chinois",
  "vietnamien",
  "tamoul",
  "wolof",
  "bambara",
  "lingala",
  "persan",
  "albanais",
  "serbe",
];

export const LANGUES_DU_PARENT_PROPOSEES: readonly LangueProposee[] = CODES.map((code) => ({
  code,
  libelle: code.charAt(0).toUpperCase() + code.slice(1),
}));

const AUCUNE = "aucune";

export class LangueDuParent {
  private constructor(readonly valeur: string) {}

  static aucune(): LangueDuParent {
    return new LangueDuParent(AUCUNE);
  }

  static de(brut: string): LangueDuParent {
    if (brut !== AUCUNE && !CODES.includes(brut)) throw new LangueDuParentInconnue(brut);
    return new LangueDuParent(brut);
  }
}
