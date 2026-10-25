import type { LeconId } from "./parcours.ts";

export function leconsNouvellementReussies(
  reussiesAuTest: ReadonlySet<LeconId>,
  dejaReussies: ReadonlySet<LeconId>,
): ReadonlySet<LeconId> {
  return new Set([...reussiesAuTest].filter((lecon) => !dejaReussies.has(lecon)));
}
