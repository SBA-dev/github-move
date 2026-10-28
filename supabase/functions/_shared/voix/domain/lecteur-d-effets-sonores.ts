import type { EffetSonore } from "./effet-sonore.ts";

export interface LecteurDEffetsSonores {
  jouer(effet: EffetSonore): Promise<void>;
  arreter(): void;
}
