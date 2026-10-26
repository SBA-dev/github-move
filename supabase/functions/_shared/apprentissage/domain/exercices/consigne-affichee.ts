import type { Exercice } from "../../../catalogue/domain/index.ts";
import { consigneLueAuDebut } from "./consigne-lue-au-debut.ts";

/** La consigne affichée est celle qui est lue au début : une dictée ou une poésie n'en affichent aucune. */
export function consigneAffichee(exercice: Exercice): string | undefined {
  return consigneLueAuDebut(exercice.type) ? exercice.consigne : undefined;
}
