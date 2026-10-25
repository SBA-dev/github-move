import { type MutableRefObject, useCallback, useRef, useState } from "react";
import {
  type Avancement,
  attenteAvantLEcranSuivant,
  type ExerciceJoue,
  type QuestionDeDictee,
  type QuestionJouee,
  type Seance,
} from "@domain/apprentissage";
import { attendre } from "./attendre.ts";

/** L'exercice réussi (et sa question, pour les choix ou la dictée), montré tel quel le temps de le féliciter. */
export type ReussiteFigee = {
  readonly position: number;
  readonly exercice: ExerciceJoue;
  readonly question: QuestionJouee | undefined;
  readonly questionDeDictee?: QuestionDeDictee;
};

/** Ce que partagent les réponses par choix et par étiquette : la réussite figée le temps de la féliciter, et l'avancement annoncé. */
export function useQuestionFigee(seance: Seance, paroleEntendue: MutableRefObject<boolean>) {
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

  const [enfantAttendu, setEnfantAttendu] = useState(false);
  const continuerQuandLEnfantLeVeut = useRef<(() => void) | undefined>(undefined);

  /** Sans voix, la parole reste lisible : une durée fixe, ou le bouton « Continuer » quand la séance est finie. */
  const attendreLEcranSuivant = useCallback(async () => {
    const attente = attenteAvantLEcranSuivant({ entendue: paroleEntendue.current, seanceTerminee: seance.estFinie() });
    if (attente.genre === "dureeDAffichageSansVoix") return await attendre(attente.millisecondes);
    if (attente.genre === "aucune") return;
    setEnfantAttendu(true);
    await new Promise<void>((fin) => continuerQuandLEnfantLeVeut.current = fin);
    setEnfantAttendu(false);
  }, [seance, paroleEntendue]);

  const continuer = useCallback(() => continuerQuandLEnfantLeVeut.current?.(), []);

  return { figee, estFigee, figer, avancementAnnonce, annoncerLAvancement, attendreLEcranSuivant, enfantAttendu, continuer };
}

export type QuestionFigee = ReturnType<typeof useQuestionFigee>;
