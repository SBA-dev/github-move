import type { Lecon } from "../../../catalogue/domain/index.ts";

export interface LeconsPersonnellesDuProfil {
  parId(id: string, profil: string): Promise<Lecon | null>;
}
