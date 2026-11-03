import { celebrationDe, type CelebrationDeLUnivers } from "./celebrations-des-univers.ts";
import type { Hasard } from "./hasard.ts";
import { type FaitsDeLaFinPourLaCelebration, momentDeCelebrationDeLaFin } from "./moment-de-celebration.ts";
import type { CleUnivers } from "./univers.ts";

export type CelebrationDeLaFin =
  | { readonly sorte: "univers"; readonly celebration: CelebrationDeLUnivers }
  | { readonly sorte: "commune" };

export function celebrationDeLaFin(
  faits: FaitsDeLaFinPourLaCelebration,
  cle: CleUnivers,
  hasard: Hasard,
): CelebrationDeLaFin {
  const moment = momentDeCelebrationDeLaFin(faits);
  const celebration = moment && celebrationDe(moment, cle, hasard);
  return celebration ? { sorte: "univers", celebration } : { sorte: "commune" };
}
