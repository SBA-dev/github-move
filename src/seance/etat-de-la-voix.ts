import type { EtatDeLaVoix } from "@domain/apprentissage";
import type { Voix } from "../voix/index.ts";

export function etatDeLaVoix({ son, syntheseVocalePresente }: Pick<Voix, "son" | "syntheseVocalePresente">): EtatDeLaVoix {
  if (!syntheseVocalePresente) return "lectureImpossible";
  return son === "muet" ? "muet" : "disponible";
}
