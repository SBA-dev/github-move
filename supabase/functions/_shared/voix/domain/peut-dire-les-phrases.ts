import type { Allure } from "./allure.ts";
import { phrasesAvecCle } from "./cle-de-phrase.ts";
import type { RepertoireDesPhrasesEnregistrees } from "./repertoire-des-phrases-enregistrees.ts";

export function peutDireLesPhrases(
  demande: {
    readonly textes: readonly string[];
    readonly allure: Allure;
    readonly repertoire: RepertoireDesPhrasesEnregistrees;
    readonly syntheseVocalePresente: boolean;
  },
): boolean {
  if (demande.syntheseVocalePresente) return true;
  return demande.textes
    .flatMap(phrasesAvecCle)
    .every(({ cle }) => demande.repertoire.phrases[cle] !== undefined);
}
