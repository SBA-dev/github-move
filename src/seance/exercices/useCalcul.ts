import { type MutableRefObject, useCallback, useState } from "react";
import { type CalculEnCours, type FaitDeSeance, type Reponse, type Seance } from "@domain/apprentissage";
import type { PersonnageGuide } from "@domain/motivation";
import { cibleDeLaReponse, effetsApresUneBonneReponse, type SignalerUnRetour } from "../../retours/index.ts";
import type { ParoleADire } from "../usePersonnageQuiParle.ts";
import { aiderQuandOnNeSaitPas, encouragerApresUneErreurDeCalcul, feliciterUnCalcul } from "./paroles-du-calcul.ts";
import type { QuestionFigee } from "./useQuestionFigee.ts";

type Dependances = {
  readonly seance: Seance;
  readonly personnageGuide: PersonnageGuide;
  readonly dire: (parole: ParoleADire) => Promise<boolean>;
  readonly signaler: SignalerUnRetour;
  readonly faireSilence: () => void;
  readonly sequence: MutableRefObject<number>;
  readonly vivant: MutableRefObject<boolean>;
  readonly redessiner: () => void;
  readonly reussite: QuestionFigee;
};

export type SuiteDuCalcul = (numero: number, faits: FaitDeSeance[], nouvelExercice: boolean) => Promise<void>;

/** Le déroulé d'un exercice de calcul : la phrase est lue, la réponse est corrigée, une erreur encourage et aide. */
export function useCalcul(
  { seance, personnageGuide, dire, signaler, faireSilence, sequence, vivant, redessiner, reussite }: Dependances,
) {
  const { estFigee, figer, annoncerLAvancement, attendreLEcranSuivant } = reussite;
  /** Le calcul réussi, montré tel quel le temps de le féliciter. */
  const [calculFige, setCalculFige] = useState<CalculEnCours | undefined>();

  const presenter = useCallback(async () => {
    const calcul = seance.calculEnCours();
    if (calcul) await dire({ texte: calcul.phrase, nature: "question" });
  }, [seance, dire]);

  const repondre = useCallback(async (reponse: Reponse, suite: SuiteDuCalcul) => {
    const calcul = seance.calculEnCours();
    const exercice = seance.exerciceEnCours();
    if (!calcul || !exercice || estFigee.current) return;
    const questionsReussiesAvant = seance.avancement().questionsReussies;
    const resultat = seance.repondre(reponse);
    if (resultat === "dejaEcartee") return;
    sequence.current++;
    redessiner();
    if (resultat === "fausse") {
      signaler("fausse", cibleDeLaReponse(reponse));
      await dire(encouragerApresUneErreurDeCalcul(personnageGuide, seance.aideApresLaDerniereErreur()));
      return;
    }
    figer({ position: exercice.position, exercice, question: undefined });
    setCalculFige(calcul);
    annoncerLAvancement(seance.avancement());
    signaler("juste", cibleDeLaReponse(reponse));
    await dire(feliciterUnCalcul(personnageGuide, undefined, effetsApresUneBonneReponse(seance, questionsReussiesAvant)));
    if (!(await attendreLEcranSuivant()) || !vivant.current) return;
    figer(undefined);
    setCalculFige(undefined);
    const nouvelExercice = seance.exerciceEnCours()?.position !== exercice.position;
    await suite(++sequence.current, seance.retirerFaits(), nouvelExercice);
  }, [seance, personnageGuide, dire, signaler, sequence, redessiner, figer, annoncerLAvancement, vivant, estFigee, attendreLEcranSuivant]);

  const jeNeSaisPas = useCallback(async () => {
    const calcul = seance.calculEnCours();
    if (!calcul?.jeNeSaisPasPropose || estFigee.current) return;
    const { aide, bonneReponse } = seance.direJeNeSaisPas();
    sequence.current++;
    faireSilence();
    redessiner();
    await dire(aiderQuandOnNeSaitPas(calcul, aide, bonneReponse));
  }, [seance, sequence, faireSilence, redessiner, dire, estFigee]);

  return { calculFige, presenter, repondre, jeNeSaisPas };
}
