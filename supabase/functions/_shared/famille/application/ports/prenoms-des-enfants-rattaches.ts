import type { ParentId } from "../../domain/parent-id.ts";
import type { Prenom } from "../../domain/prenom.ts";

export interface PrenomsDesEnfantsRattaches {
  duParent(parent: ParentId): Promise<Prenom[]>;
}
