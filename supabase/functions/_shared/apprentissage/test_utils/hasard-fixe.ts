import type { Hasard } from "../domain/hasard.ts";

export function hasardFixe(...tirages: number[]): Hasard {
  let prochain = 0;
  return {
    entre0et1() {
      const tirage = tirages[prochain];
      if (tirage === undefined) {
        throw new Error("Plus aucun tirage fixé");
      }
      prochain += 1;
      return tirage;
    },
  };
}

/** Un hasard pour les tests où le tirage n'a pas d'importance. */
export function hasardIndifferent(): Hasard {
  return { entre0et1: () => 0 };
}
