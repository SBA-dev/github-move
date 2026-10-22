import type { Hasard } from "../domain/hasard.ts";

export function hasardFixe(valeur: number): Hasard {
  return { entre0et1: () => valeur };
}
