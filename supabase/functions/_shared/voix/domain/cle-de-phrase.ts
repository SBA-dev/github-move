import { texteALire } from "./texte-a-lire.ts";

export type PhraseAvecCle = {
  readonly texte: string;
  readonly cle: string;
};

const BASE_FNV_1A_64 = 0xcbf29ce484222325n;
const MULTIPLICATEUR_FNV_1A_64 = 0x100000001b3n;
const MODULO_64_BITS = 1n << 64n;

export function empreinteFnv1a64(texte: string): string {
  let empreinte = BASE_FNV_1A_64;
  for (const octet of new TextEncoder().encode(texte)) {
    empreinte = ((empreinte ^ BigInt(octet)) * MULTIPLICATEUR_FNV_1A_64) % MODULO_64_BITS;
  }
  return empreinte.toString(16).padStart(16, "0");
}

function normalisee(phrase: string): string {
  return phrase.normalize("NFC").replaceAll("’", "'");
}

export function cleDePhrase(phrase: string): string {
  return empreinteFnv1a64(normalisee(phrase));
}

export function phrasesAvecCle(brut: string): PhraseAvecCle[] {
  const phrases = texteALire(brut)?.phrases ?? [];
  return phrases
    .map(normalisee)
    .filter((phrase) => /[\p{L}\p{N}]/u.test(phrase))
    .map((texte) => ({ texte, cle: empreinteFnv1a64(texte) }));
}
