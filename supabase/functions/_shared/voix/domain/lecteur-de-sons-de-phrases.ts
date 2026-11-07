import type { InstantsDesMots } from "./instants-des-mots.ts";
import type { SonDePhrase } from "./son-de-phrase.ts";

export interface LecteurDeSonsDePhrases {
  jouer(
    son: SonDePhrase,
    rythme: number,
    instantsDesMots?: InstantsDesMots,
    onMot?: (rang: number) => void,
  ): Promise<void>;
  arreter(): void;
}
