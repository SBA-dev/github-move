import type { ParoleDue } from "@domain/apprentissage";
import type { ParoleDueApresUneBonneReponse } from "@domain/motivation";

/** Traduit la parole due par l'Apprentissage dans le langage de la Motivation, qui a besoin du verbe conjugué. */
export function paroleDueDeMotivation(paroleDue: ParoleDue | undefined, verbe?: string): ParoleDueApresUneBonneReponse | undefined {
  if (paroleDue !== "tuSaisConjuguer") return paroleDue;
  return verbe === undefined ? undefined : { parole: paroleDue, verbe };
}
