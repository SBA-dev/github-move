import { useCallback, useRef, useState } from "react";
import type { Avancement, ExerciceJoue, QuestionDeDictee, QuestionJouee } from "@domain/apprentissage";

/** L'exercice réussi (et sa question, pour les choix ou la dictée), montré tel quel le temps de le féliciter. */
export type ReussiteFigee = {
  readonly position: number;
  readonly exercice: ExerciceJoue;
  readonly question: QuestionJouee | undefined;
  readonly questionDeDictee?: QuestionDeDictee;
};

/** Ce que partagent les réponses par choix et par étiquette : la réussite figée le temps de la féliciter, et l'avancement annoncé. */
export function useQuestionFigee() {
  const [figee, setFigee] = useState<ReussiteFigee | undefined>();
  const estFigee = useRef(false);
  const [avancementAnnonce, setAvancementAnnonce] = useState("");

  const figer = useCallback((reussite: ReussiteFigee | undefined) => {
    estFigee.current = reussite !== undefined;
    setFigee(reussite);
  }, []);

  const annoncerLAvancement = useCallback(({ questionsReussies, total }: Avancement) => {
    setAvancementAnnonce(`${questionsReussies} sur ${total}`);
  }, []);

  return { figee, estFigee, figer, avancementAnnonce, annoncerLAvancement };
}

export type QuestionFigee = ReturnType<typeof useQuestionFigee>;
