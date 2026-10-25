import { LeconMalFormee, lireLecon } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import type { LeconsDuCatalogue } from "../application/ports/lecons-du-catalogue.ts";

/** Lit les leçons dans le JSON de la bibliothèque. Une leçon illisible est traitée comme absente. */
export class LeconsDuCatalogueJson implements LeconsDuCatalogue {
  private readonly brutes = new Map<string, unknown>();

  constructor(bibliotheque: readonly unknown[]) {
    for (const brute of bibliotheque) {
      if (typeof brute === "object" && brute !== null && "id" in brute && typeof brute.id === "string") {
        this.brutes.set(brute.id, brute);
      }
    }
  }

  async toutes(): Promise<readonly Lecon[]> {
    const lecons = await Promise.all([...this.brutes.keys()].map((id) => this.parId(id)));
    return lecons.filter((lecon): lecon is Lecon => lecon !== null);
  }

  parId(id: string): Promise<Lecon | null> {
    const brute = this.brutes.get(id);
    if (brute === undefined) return Promise.resolve(null);
    try {
      return Promise.resolve(lireLecon(brute));
    } catch (cause) {
      if (cause instanceof LeconMalFormee) return Promise.resolve(null);
      throw cause;
    }
  }
}
