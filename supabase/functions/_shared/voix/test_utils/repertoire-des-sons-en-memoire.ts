import { CleDeLaPhrase } from "../domain/cle-de-la-phrase.ts";
import type { RepertoireDesSons } from "../domain/repertoire-des-sons.ts";
import type { SonDePhrase } from "../domain/son-de-phrase.ts";

export function repertoireDesSonsEnMemoire(sons: readonly SonDePhrase[]): RepertoireDesSons {
  return {
    sonDe: (cle: CleDeLaPhrase) => sons.find((son) => son.cle.egale(cle)),
  };
}
