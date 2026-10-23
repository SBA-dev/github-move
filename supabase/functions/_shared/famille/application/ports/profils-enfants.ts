import type { ParentId } from "../../domain/parent-id.ts";
import type { ProfilEnfant } from "../../domain/profil-enfant.ts";
import type { ProfilEnfantId } from "../../domain/profil-enfant-id.ts";

export interface ProfilsEnfants {
  parId(id: ProfilEnfantId): Promise<ProfilEnfant | null>;
  duParent(parent: ParentId): Promise<ProfilEnfant[]>;
  enregistrer(profil: ProfilEnfant): Promise<void>;
}
