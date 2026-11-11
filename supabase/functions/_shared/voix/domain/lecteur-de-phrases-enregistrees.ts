import type { MorceauDeLecture } from "./plan-de-lecture.ts";

export type SuiviDUnMorceau = {
  readonly onDebut: (dureeMs: number) => void;
  readonly onProgression: (ecouleMs: number) => void;
};

export interface LecteurDePhrasesEnregistrees {
  jouer(morceau: MorceauDeLecture, suivi: SuiviDUnMorceau): Promise<void>;
  arreter(): void;
}
