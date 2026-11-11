import type { Voix } from "./useVoix.ts";

/** Muet, lecture empêchée ou aucune voix : l'enfant lit seul. */
export function laVoixNeLitPas(voix: Voix): boolean {
  return voix.son === "muet" || !voix.voixPresente || voix.lectureEmpechee !== undefined;
}
