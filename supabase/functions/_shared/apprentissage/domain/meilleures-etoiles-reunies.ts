import type { Etoiles } from "./etoiles.ts";
import type { LeconId } from "./parcours.ts";

export function meilleuresEtoilesReunies(
  connues: ReadonlyMap<LeconId, Etoiles>,
  nouvelles: ReadonlyMap<LeconId, Etoiles>,
): ReadonlyMap<LeconId, Etoiles> {
  const reunies = new Map(connues);
  for (const [lecon, etoiles] of nouvelles) {
    reunies.set(lecon, etoiles.meilleureQue(reunies.get(lecon)));
  }
  return reunies;
}
