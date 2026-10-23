import type { CleUnivers } from "../../motivation/domain/index.ts";
import type { Reglages } from "./reglages.ts";

export type ProfilEnCours = {
  readonly id: string;
  readonly prenom: string;
  readonly niveau: string;
  readonly univers: CleUnivers;
  readonly reglages: Reglages;
};

export interface ProfilEnCoursSurLAppareil {
  definir(profil: ProfilEnCours): void;
}
