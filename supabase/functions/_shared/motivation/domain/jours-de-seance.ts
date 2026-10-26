import type { Jour } from "../../apprentissage/domain/index.ts";

export class JoursDeSeance {
  private constructor(readonly jours: readonly Jour[]) {}

  static reunir(...sources: readonly (readonly Jour[])[]): JoursDeSeance {
    const sansDoublon: Jour[] = [];
    for (const jour of sources.flat()) {
      if (!sansDoublon.some((retenu) => retenu.estEgalA(jour))) sansDoublon.push(jour);
    }
    return new JoursDeSeance(sansDoublon);
  }

  contient(jour: Jour): boolean {
    return this.jours.some((retenu) => retenu.estEgalA(jour));
  }
}
