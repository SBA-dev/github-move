import type { EtatDeLaVoix } from "@domain/apprentissage";
import type { Voix } from "../voix/index.ts";

export function etatDeLaVoix({ son, voixPresente }: Pick<Voix, "son" | "voixPresente">): EtatDeLaVoix {
  if (!voixPresente) return "lectureImpossible";
  return son === "muet" ? "muet" : "disponible";
}
