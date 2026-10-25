import type { RattachementsDuParent } from "../application/ports/rattachements-du-parent.ts";

export class RattachementsEnMemoire implements RattachementsDuParent {
  private readonly rattachements: ReadonlySet<string>;

  constructor(...rattachements: readonly [parent: string, profil: string][]) {
    this.rattachements = new Set(rattachements.map(([parent, profil]) => `${parent}/${profil}`));
  }

  estRattache(parent: string, profil: string): Promise<boolean> {
    return Promise.resolve(this.rattachements.has(`${parent}/${profil}`));
  }
}
