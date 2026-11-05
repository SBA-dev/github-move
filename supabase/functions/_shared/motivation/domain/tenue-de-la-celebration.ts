import type { FaitsDeLaFinPourLaCelebration } from "./moment-de-celebration.ts";
import type { TenueDuPersonnageGuide } from "./tenues.ts";
import { tenueAMontrer, type TenuePortee } from "./tenue-portee.ts";

export function tenueDeLaCelebrationDeLUnivers(
  faits: FaitsDeLaFinPourLaCelebration,
  tenuePortee: TenuePortee,
): TenueDuPersonnageGuide | undefined {
  return faits.tenueRecue ?? tenueAMontrer(tenuePortee);
}
