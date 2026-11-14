import type { Allure } from "./allure.ts";
import type { RepertoireDesPhrasesEnregistrees } from "./repertoire-des-phrases-enregistrees.ts";

export function peutDireLesPhrases(
  demande: {
    readonly textes: readonly string[];
    readonly allure: Allure;
    readonly repertoire: RepertoireDesPhrasesEnregistrees;
    readonly syntheseVocalePresente: boolean;
  },
): boolean {
  return demande.syntheseVocalePresente;
}
