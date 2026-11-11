import { type MutableRefObject, useCallback, useState } from "react";
import {
  type ExerciceJoue,
  HeureEcriteImpossible,
  type QuestionDHorloge,
  type Reponse,
  type Seance,
} from "@domain/apprentissage";
import type { HeureDeLHorloge, Lecon } from "@domain/catalogue";
import type { PersonnageGuide } from "@domain/motivation";
import type { Voix } from "../../../voix/index.ts";
import { cibleDeLaReponse, effetsApresUneBonneReponse, type SignalerUnRetour } from "../../../retours/index.ts";
import type { ParoleADire } from "../../usePersonnageQuiParle.ts";
import { aiderQuandOnNeSaitPas, encouragerApresUneErreurDeCalcul, feliciterUnCalcul } from "../paroles-du-calcul.ts";
import type { SuiteDuCalcul } from "../useCalcul.ts";
import type { QuestionFigee } from "../useQuestionFigee.ts";

type Dependances = {
  readonly seance: Seance;
  readonly lecon: Lecon;
  readonly personnageGuide: PersonnageGuide;
  /** Réglage du profil : les heures proposées sont lues après la consigne. */
  readonly toutLireAVoixHaute: boolean;
  readonly lire: Voix["lire"];
  readonly dire: (parole: ParoleADire) => Promise<boolean>;
  readonly signaler: SignalerUnRetour;
  readonly faireSilence: () => void;
  readonly sequence: MutableRefObject<number>;
  readonly vivant: MutableRefObject<boolean>;
  readonly redessiner: () => void;
  readonly reussite: QuestionFigee;
};

/** La question d'horloge réussie, montrée telle quelle (même heure sur le cadran) le temps de la féliciter. */
export type HorlogeReussie = Readonly<{ question: QuestionDHorloge; heure: HeureDeLHorloge }>;

/** L'heure que montre l'horloge de la question en cours de l'exercice joué. */
export function heureMontree(lecon: Lecon, exercice: ExerciceJoue | undefined): HeureDeLHorloge | undefined {
  if (exercice === undefined) return undefined;
  const exerciceDeLaLecon = lecon.exercices[exercice.position];
  return exerciceDeLaLecon?.type === "horloge" ? exerciceDeLaLecon.items[exercice.rangDeLaQuestionEnCours]?.heure : undefined;
}

/** La consigne (et le moment de la journée) : affichée dans la bulle et lue, jamais l'heure à lire. */
export function paroleDeLaConsigneDHorloge(question: QuestionDHorloge): ParoleADire {
  return { texte: question.texteDit(), nature: "consigne" };
}

/** Le déroulé d'une question d'horloge : la consigne est lue, la réponse est corrigée, une erreur encourage et aide. */
export function useHorloge(
  { seance, lecon, personnageGuide, toutLireAVoixHaute, lire, dire, signaler, faireSilence, sequence, vivant, redessiner, reussite }:
    Dependances,
) {
  const { estFigee, figer, annoncerLAvancement, attendreLEcranSuivant } = reussite;
  const [horlogeReussie, setHorlogeReussie] = useState<HorlogeReussie | undefined>();

  const presenter = useCallback(async () => {
    const question = seance.questionDHorlogeEnCours();
    if (!question || !(await dire(paroleDeLaConsigneDHorloge(question)))) return;
    const choix = toutLireAVoixHaute ? question.lectureDesChoix() : undefined;
    if (choix !== undefined) await lire(choix);
  }, [seance, dire, toutLireAVoixHaute, lire]);

  const apresLaReponse = useCallback(async (
    reponse: Reponse,
    resultat: "juste" | "fausse",
    exercice: ExerciceJoue,
    reussie: HorlogeReussie,
    questionsReussiesAvant: number,
    suite: SuiteDuCalcul,
  ) => {
    if (resultat === "fausse") {
      signaler("fausse", cibleDeLaReponse(reponse));
      await dire(encouragerApresUneErreurDeCalcul(personnageGuide, seance.aideApresLaDerniereErreur()));
      return;
    }
    figer({ position: exercice.position, exercice, question: undefined });
    setHorlogeReussie(reussie);
    annoncerLAvancement(seance.avancement());
    signaler("juste", cibleDeLaReponse(reponse));
    await dire(feliciterUnCalcul(personnageGuide, undefined, effetsApresUneBonneReponse(seance, questionsReussiesAvant)));
    if (!(await attendreLEcranSuivant()) || !vivant.current) return;
    figer(undefined);
    setHorlogeReussie(undefined);
    const nouvelExercice = seance.exerciceEnCours()?.position !== exercice.position;
    await suite(++sequence.current, seance.retirerFaits(), nouvelExercice);
  }, [seance, personnageGuide, dire, signaler, sequence, figer, annoncerLAvancement, vivant, attendreLEcranSuivant]);

  /** Rend `false` quand l'heure écrite est impossible : rien n'est corrigé ni compté, l'enfant la corrige. */
  const repondre = useCallback((reponse: Reponse, suite: SuiteDuCalcul): boolean => {
    const question = seance.questionDHorlogeEnCours();
    const exercice = seance.exerciceEnCours();
    const heure = heureMontree(lecon, exercice);
    if (!question || !exercice || !heure || estFigee.current) return true;
    const questionsReussiesAvant = seance.avancement().questionsReussies;
    let resultat;
    try {
      resultat = seance.repondre(reponse);
    } catch (erreur) {
      if (erreur instanceof HeureEcriteImpossible) return false;
      throw erreur;
    }
    if (resultat === "dejaEcartee") return true;
    sequence.current++;
    redessiner();
    void apresLaReponse(reponse, resultat, exercice, { question, heure }, questionsReussiesAvant, suite);
    return true;
  }, [seance, lecon, estFigee, sequence, redessiner, apresLaReponse]);

  const jeNeSaisPas = useCallback(async () => {
    const question = seance.questionDHorlogeEnCours();
    if (!question?.enCours().jeNeSaisPasPropose || estFigee.current) return;
    const { aide, bonneReponse } = seance.direJeNeSaisPas();
    sequence.current++;
    faireSilence();
    redessiner();
    const { mode, reponseATaperDite } = question.enCours();
    const parole = aiderQuandOnNeSaitPas({ mode }, aide, bonneReponse);
    await dire(
      reponseATaperDite === undefined ? parole : { ...parole, aLire: aiderQuandOnNeSaitPas({ mode }, aide, reponseATaperDite).texte },
    );
  }, [seance, sequence, faireSilence, redessiner, dire, estFigee]);

  return { horlogeReussie, presenter, repondre, jeNeSaisPas };
}
