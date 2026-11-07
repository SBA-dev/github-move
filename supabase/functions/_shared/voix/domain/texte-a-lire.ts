export type TexteALire = {
  readonly texte: string;
  readonly phrases: readonly string[];
};

export function textePrononce(brut: string): string {
  return brut
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\+/g, " plus ")
    .replace(/=/g, " égale ")
    .replace(/_{2,}/g, " ... ")
    .replace(/\s*»(?=[.,!?…])/g, "")
    .replace(/[«»]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function motsPrononces(textePrononceOuPhrase: string): string[] {
  return textePrononceOuPhrase.split(/\s+/).filter(Boolean);
}

export function texteALire(brut: string): TexteALire | undefined {
  const texte = textePrononce(brut);
  if (!contientUneLettreOuUnChiffre(texte)) return undefined;
  return { texte, phrases: rattacherLaPonctuationSeule(texte.split(/(?<=[.!?…:])\s+/)) };
}

const contientUneLettreOuUnChiffre = (phrase: string) => /[\p{L}\p{N}]/u.test(phrase);

function rattacherLaPonctuationSeule(phrases: readonly string[]): string[] {
  const rattachees: string[] = [];
  let enTete = "";
  for (const phrase of phrases) {
    if (contientUneLettreOuUnChiffre(phrase)) {
      rattachees.push(enTete ? `${enTete} ${phrase}` : phrase);
      enTete = "";
    } else if (rattachees.length > 0) {
      rattachees[rattachees.length - 1] += ` ${phrase}`;
    } else {
      enTete = phrase;
    }
  }
  return rattachees;
}
