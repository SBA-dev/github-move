import type { Voix } from "./useVoix.ts";

/** Muet, voix du personnage guide bloquée ou synthèse absente : l'enfant lit seul. */
export function laVoixNeLitPas(voix: Voix): boolean {
  return voix.son === "muet" || !voix.syntheseVocalePresente || voix.nomDuPersonnageGuideDeLaVoixBloquee !== undefined;
}
