import type { CleUnivers } from "../../motivation/domain/index.ts";

export type ProfilEnCours = {
  readonly id: string;
  readonly prenom: string;
  readonly niveau: string;
  readonly univers: CleUnivers;
};

export interface ProfilEnCoursSurLAppareil {
  definir(profil: ProfilEnCours): void;
}
