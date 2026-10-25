import type { Niveau } from "../../../catalogue/domain/index.ts";

export interface NiveauDuProfil {
  de(profil: string): Promise<Niveau>;
}
