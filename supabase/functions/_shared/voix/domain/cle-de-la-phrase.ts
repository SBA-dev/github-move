const APOSTROPHE_TYPOGRAPHIQUE = /’/g;
const ESPACES_INSECABLES = /[  ]/g;
const ESPACES_REPETEES = /\s+/g;

function normaliser(phrase: string): string {
  return phrase
    .normalize("NFC")
    .replace(APOSTROPHE_TYPOGRAPHIQUE, "'")
    .replace(ESPACES_INSECABLES, " ")
    .replace(ESPACES_REPETEES, " ")
    .trim();
}

export class CleDeLaPhrase {
  private constructor(readonly valeur: string) {}

  static de(phrase: string): CleDeLaPhrase {
    return new CleDeLaPhrase(normaliser(phrase));
  }

  egale(autre: CleDeLaPhrase): boolean {
    return this.valeur === autre.valeur;
  }
}
