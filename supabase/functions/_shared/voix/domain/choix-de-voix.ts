import type { CaractereDeLaVoix } from "./caractere-de-la-voix.ts";
import { scoreDeLaVoix, type VoixDisponible, voixFrancaisesTriees } from "./voix-disponible.ts";

const ECART_DE_SCORE_TOLERE = 15;

const VOIX_FEMININE =
  /am[eé]lie|audrey|aur[eé]lie|marie|denise|eloise|vivienne|brigitte|c[eé]line|julie|hortense|l[eé]a\b|virginie|sylvie|jos[eé]phine|coralie|jacqueline|yvette|charlotte|ariane|juliette|chantal|female|femme/i;
const VOIX_MASCULINE =
  /thomas|henri|r[eé]my|paul|nicolas|daniel|j[eé]r[oô]me|antoine|claude|alain|fabrice|jean|maurice|yves|guillaume|mathieu|\bmale\b|homme/i;

export function choisirVoix(
  voix: readonly VoixDisponible[],
  caractere: CaractereDeLaVoix,
): VoixDisponible | undefined {
  const [meilleure, ...autres] = voixFrancaisesTriees(voix);
  if (!meilleure) return undefined;
  const motif = caractere.sexe === "masculine" ? VOIX_MASCULINE : VOIX_FEMININE;
  const scoreMinimal = scoreDeLaVoix(meilleure) - ECART_DE_SCORE_TOLERE;
  return [meilleure, ...autres].find((v) => motif.test(v.nom) && scoreDeLaVoix(v) >= scoreMinimal) ?? meilleure;
}
