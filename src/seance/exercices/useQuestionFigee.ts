import { type MutableRefObject, useCallback, useEffect, useRef, useState } from "react";
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
  const continuerQuandLEnfantLeVeut = useRef<((continuee: boolean) => void) | undefined>(undefined);

  /**
   * Sans voix, la parole reste lisible : une durée fixe, ou le bouton « Continuer » quand la séance est finie.
   * Rend `false` si une attente plus récente l'a remplacée : l'appelant ne doit alors pas enchaîner.
   */
  const attendreLEcranSuivant = useCallback(async (): Promise<boolean> => {
    const attente = attenteAvantLEcranSuivant({ entendue: paroleEntendue.current, seanceTerminee: seance.estFinie() });
    if (attente.genre === "aucune") return true;
    if (attente.genre === "dureeDAffichageSansVoix") {
      await attendre(attente.millisecondes);
      return true;
    }
    continuerQuandLEnfantLeVeut.current?.(false);
    setEnfantAttendu(true);
    const continuee = await new Promise<boolean>((fin) => continuerQuandLEnfantLeVeut.current = fin);
    if (continuee) setEnfantAttendu(false);
    return continuee;
  }, [seance, paroleEntendue]);

  const continuer = useCallback(() => {
    continuerQuandLEnfantLeVeut.current?.(true);
    continuerQuandLEnfantLeVeut.current = undefined;
  }, []);

  useEffect(() => continuer, [continuer]);

  return { figee, estFigee, figer, avancementAnnonce, annoncerLAvancement, attendreLEcranSuivant, enfantAttendu, continuer };
}

export type QuestionFigee = ReturnType<typeof useQuestionFigee>;
