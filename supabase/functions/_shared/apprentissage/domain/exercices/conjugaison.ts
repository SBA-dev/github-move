import type { ExerciceConjugaison } from "../../../catalogue/domain/index.ts";
import { type QuestionDeTrou, sansDoublonsNiReponse } from "./trous.ts";

export type QuestionDeConjugaison = QuestionDeTrou & Readonly<{ pronom: string; cle: string; aide: string }>;

export function questionsDeConjugaison(exercice: ExerciceConjugaison): QuestionDeConjugaison[] {
  return exercice.formes.map(({ pronom, forme }) => ({
    enonce: `${pronom} … ?`,
    motAttendu: forme,
    candidats: sansDoublonsNiReponse(
      [...exercice.formes.map((autre) => autre.forme), ...exercice.distracteurs],
      forme,
    ),
    pronom,
    cle: `${exercice.verbe} · ${exercice.temps} · ${pronom}`,
    aide: `Avec « ${pronom} », quelle forme va ?`,
  }));
}
