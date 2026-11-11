export type PhraseEnregistreeDeTest = {
  readonly normale: string;
  readonly lente?: string;
};

export function repertoireDeTest(
  phrases: Readonly<Record<string, PhraseEnregistreeDeTest>> = {},
): {
  readonly voixEnregistree: string;
  readonly phrases: Readonly<Record<string, PhraseEnregistreeDeTest>>;
} {
  return { voixEnregistree: "voix-de-test", phrases };
}
