import type { CleDeLaPhrase } from "./cle-de-la-phrase.ts";
import type { SonDePhrase } from "./son-de-phrase.ts";

export interface RepertoireDesSons {
  sonDe(cle: CleDeLaPhrase): SonDePhrase | undefined;
}
