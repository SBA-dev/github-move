import type { Etoiles } from "./etoiles.ts";
import type { LeconId } from "./parcours.ts";

export function meilleuresEtoilesReunies(
  a: ReadonlyMap<LeconId, Etoiles>,
  b: ReadonlyMap<LeconId, Etoiles>,
): ReadonlyMap<LeconId, Etoiles> {
  const reunies = new Map(a);
  for (const [lecon, etoiles] of b) {
    reunies.set(lecon, etoiles.meilleureQue(reunies.get(lecon)));
  }
  return reunies;
}
