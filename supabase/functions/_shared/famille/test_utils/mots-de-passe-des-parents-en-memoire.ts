import type { MotsDePasseDesParents } from "../application/ports/mots-de-passe-des-parents.ts";
import type { ParentId } from "../domain/parent-id.ts";

export class MotsDePasseDesParentsEnMemoire implements MotsDePasseDesParents {
  readonly changements: Array<{ parent: ParentId; motDePasse: string }> = [];

  constructor(private readonly journal: string[] = []) {}

  changer(parent: ParentId, motDePasse: string): Promise<void> {
    this.journal.push("mot-de-passe.changer");
    this.changements.push({ parent, motDePasse });
    return Promise.resolve();
  }
}
