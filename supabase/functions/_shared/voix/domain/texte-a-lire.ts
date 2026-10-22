export type TexteALire = {
  readonly texte: string;
  readonly phrases: readonly string[];
};

export function texteALire(brut: string): TexteALire | undefined {
  const texte = brut
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/g, " ")
    .replace(/\+/g, " plus ")
    .replace(/=/g, " égale ")
    .replace(/_{2,}/g, " ... ")
    .replace(/[«»]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (texte === "") return undefined;
  return { texte, phrases: texte.split(/(?<=[.!?…:])\s+/) };
}
