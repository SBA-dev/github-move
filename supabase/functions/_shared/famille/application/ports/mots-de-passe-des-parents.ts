import type { ParentId } from "../../domain/parent-id.ts";

export interface MotsDePasseDesParents {
  changer(parent: ParentId, motDePasse: string): Promise<void>;
}
