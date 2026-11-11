import type { RepertoireDesPhrasesEnregistrees } from "../domain/index.ts";
import type { PhraseAFabriquer } from "./phrases-a-fabriquer.ts";

export function phrasesNonCouvertes(
  phrases: readonly PhraseAFabriquer[],
  repertoire: RepertoireDesPhrasesEnregistrees,
): PhraseAFabriquer[] {
  return phrases.filter(({ cle, allures }) => {
    const entree = repertoire.phrases[cle];
    if (entree === undefined) return true;
    return allures?.includes("lente") === true && entree.lente === undefined;
  });
}
