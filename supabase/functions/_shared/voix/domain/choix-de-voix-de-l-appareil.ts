import type { ChoixDeVoix } from "./choix-de-voix.ts";

export interface ChoixDeVoixDeLAppareil {
  lire(): ChoixDeVoix;
  memoriser(choix: ChoixDeVoix): void;
}
