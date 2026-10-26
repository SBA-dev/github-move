import type { LeconId } from "./parcours.ts";
import { SEUIL_DE_LECON_ACQUISE } from "./resultat-de-la-lecon.ts";

export function leconsAcquises(meilleures: ReadonlyMap<LeconId, number>): ReadonlySet<LeconId> {
  const acquises = new Set<LeconId>();
  for (const [lecon, etoiles] of meilleures) {
    if (etoiles >= SEUIL_DE_LECON_ACQUISE) acquises.add(lecon);
  }
  return acquises;
}

export function leconAcquiseParLaSeance(
  meilleuresAvant: ReadonlyMap<LeconId, number>,
  lecon: LeconId,
  etoilesDeLaSeance: number | undefined,
): LeconId | undefined {
  if (etoilesDeLaSeance === undefined || etoilesDeLaSeance < SEUIL_DE_LECON_ACQUISE) return undefined;
  return leconsAcquises(meilleuresAvant).has(lecon) ? undefined : lecon;
}
