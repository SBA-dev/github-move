import type { PrenomsDesEnfantsRattaches } from "../application/ports/prenoms-des-enfants-rattaches.ts";
import type { ParentId } from "../domain/parent-id.ts";
import type { Prenom } from "../domain/prenom.ts";

export class PrenomsDesEnfantsRattachesEnMemoire implements PrenomsDesEnfantsRattaches {
  private readonly prenomsParParent = new Map<string, Prenom[]>();
  lectures = 0;

  rattacher(parent: ParentId, prenom: Prenom): void {
    this.prenomsParParent.set(parent.valeur, [...(this.prenomsParParent.get(parent.valeur) ?? []), prenom]);
  }

  duParent(parent: ParentId): Promise<Prenom[]> {
    this.lectures += 1;
    return Promise.resolve([...(this.prenomsParParent.get(parent.valeur) ?? [])]);
  }
}
