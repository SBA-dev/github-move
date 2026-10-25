import type { LeconsPersonnelles } from "../application/ports/lecons-personnelles.ts";
import type { LeconPersonnelle } from "../domain/lecon-personnelle.ts";

export class LeconsPersonnellesEnMemoire implements LeconsPersonnelles {
  private readonly enregistrees = new Map<string, LeconPersonnelle>();

  enregistrer(leconPersonnelle: LeconPersonnelle): Promise<void> {
    this.enregistrees.set(leconPersonnelle.lecon.id, leconPersonnelle);
    return Promise.resolve();
  }

  parId(id: string): Promise<LeconPersonnelle | undefined> {
    return Promise.resolve(this.enregistrees.get(id));
  }

  supprimer(id: string): Promise<void> {
    this.enregistrees.delete(id);
    return Promise.resolve();
  }

  toutes(): LeconPersonnelle[] {
    return [...this.enregistrees.values()];
  }
}
