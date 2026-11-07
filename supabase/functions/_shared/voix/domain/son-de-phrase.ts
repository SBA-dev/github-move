import type { CleDeLaPhrase } from "./cle-de-la-phrase.ts";

export type SonDePhrase = {
  readonly cle: CleDeLaPhrase;
  readonly fichier: string;
  readonly dureeMs: number;
};
