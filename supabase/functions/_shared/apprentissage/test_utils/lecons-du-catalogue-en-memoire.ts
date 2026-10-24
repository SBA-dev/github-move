import type { Lecon } from "../../catalogue/domain/index.ts";
import type { LeconsDuCatalogue } from "../application/ports/lecons-du-catalogue.ts";

export class LeconsDuCatalogueEnMemoire implements LeconsDuCatalogue {
  private readonly lecons: ReadonlyMap<string, Lecon>;

  constructor(...lecons: readonly Lecon[]) {
    this.lecons = new Map(lecons.map((lecon) => [lecon.id, lecon]));
  }

  parId(id: string): Promise<Lecon | null> {
    return Promise.resolve(this.lecons.get(id) ?? null);
  }
}
