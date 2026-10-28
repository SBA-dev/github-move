import { type MutableRefObject, useCallback, useRef, useState } from "react";
import {
  type FaitDeSeance,
  INTRODUCTION_DE_LA_LECTURE,
  lectureDesChoix,
  type ParoleDue,
  type QuestionJouee,
  Reponse,
  type Seance,
} from "@domain/apprentissage";
import type { Lecon } from "@domain/catalogue";
import type { EffetSonore } from "@domain/voix";
import {
  direLeTexteComplet,
  type Humeur,
  paroleApresUneBonneReponse,
  type PersonnageGuide,
  reagirAJeNeSaisPas,
  type Reaction,
  reagirALaReponse,
} from "@domain/motivation";
import { hasardDuNavigateur } from "../../hasard-navigateur.ts";
import { effetsApresUneBonneReponse, type SignalerUnRetour } from "../../retours/index.ts";
import type { Voix } from "../../voix/index.ts";
import type { ParoleADire } from "../usePersonnageQuiParle.ts";
import { attendre } from "./attendre.ts";
import { paroleDueDeMotivation } from "./paroleDueDeMotivation.ts";
import type { QuestionFigee } from "./useQuestionFigee.ts";

type Dependances = {
  readonly seance: Seance;
  readonly lecon: Lecon;
  readonly personnageGuide: PersonnageGuide;
  /** Réglage du profil : les choix proposés sont lus après la question. */
  readonly toutLireAVoixHaute: boolean;
  readonly lire: Voix["lire"];
  readonly dire: (parole: ParoleADire) => Promise<boolean>;
  readonly jouer: Voix["jouer"];
  readonly signaler: SignalerUnRetour;
  readonly faireSilence: () => void;
  readonly montrerHumeur: (humeur: Humeur) => void;
  /** Numéro de la séquence en cours : une action plus récente interrompt les suites en attente. */
  readonly sequence: MutableRefObject<number>;
  /** Faux une fois la séance quittée. */
  readonly vivant: MutableRefObject<boolean>;
  readonly redessiner: () => void;
  readonly reussite: QuestionFigee;
};

const PAUSE_DES_APPLAUDISSEMENTS_MS = 700;

type SuiteDeLaReponse = (numero: number, faits: FaitDeSeance[], nouvelExercice: boolean) => Promise<void>;

/** Le déroulé des exercices à choix (bulles, lecture, écoute) : la question est lue, puis les choix apparaissent. */
export function useQuestionsAChoix(
  { seance, lecon, personnageGuide, toutLireAVoixHaute, lire, dire, jouer, signaler, faireSilence, montrerHumeur, sequence, vivant, redessiner, reussite }:
    Dependances,
) {
  const { estFigee, figer, annoncerLAvancement, attendreLEcranSuivant } = reussite;
  const [choixVisiblesPour, setChoixVisiblesPour] = useState<QuestionJouee | undefined>();
  const [positionDuTexteEcoute, setPositionDuTexteEcoute] = useState<number | undefined>();
  const [rangDuMotDuTexte, setRangDuMotDuTexte] = useState<number | undefined>();
  const [bulleEclatee, setBulleEclatee] = useState<string | undefined>();
  const numeroDePresentation = useRef(0);

  const laQuestionEnCours = useCallback(() => {
    const exercice = seance.exerciceEnCours();
    const question = exercice?.questionEnCours();
    return exercice && question ? { exercice, question } : undefined;
  }, [seance]);

  const direLeMotAEcouter = useCallback(async (numero: number, question: QuestionJouee) => {
    if (question.motAEcouter === undefined) return true;
    await lire(question.motAEcouter, { langue: question.langue });
    return numero === sequence.current;
  }, [lire, sequence]);

  const presenter = useCallback(async (numero: number) => {
    const courante = laQuestionEnCours();
    if (!courante) return;
    const presentation = ++numeroDePresentation.current;
    if (!(await dire({ texte: courante.question.enonce, nature: "question" }))) {
      // Une lecture coupée ne laisse jamais l'enfant sans choix, sauf si une présentation plus récente a pris le relais.
      if (presentation !== numeroDePresentation.current) return;
      if (vivant.current && !estFigee.current && laQuestionEnCours()?.question === courante.question) {
        setChoixVisiblesPour(courante.question);
      }
      return;
    }
    if (!(await direLeMotAEcouter(numero, courante.question))) return;
    setChoixVisiblesPour(courante.question);
    const lectureDesChoixProposes = toutLireAVoixHaute ? lectureDesChoix(courante.question.choix.possibles()) : undefined;
    if (lectureDesChoixProposes !== undefined) await lire(lectureDesChoixProposes);
  }, [laQuestionEnCours, dire, direLeMotAEcouter, toutLireAVoixHaute, lire, vivant, estFigee]);

  const lireLeTexte = useCallback(async (numero: number, texte: string) => {
    if (!(await dire({ texte: INTRODUCTION_DE_LA_LECTURE, nature: "introduction" }))) return;
    const estLaDerniere = () => numero === sequence.current;
    await lire(texte, {
      onMot: (rang) => estLaDerniere() && setRangDuMotDuTexte(rang),
      onFin: () => estLaDerniere() && setRangDuMotDuTexte(undefined),
    });
  }, [dire, lire, sequence]);

  const ouvrir = useCallback(async (numero: number) => {
    const position = seance.exerciceEnCours()?.position;
    const exercice = position === undefined ? undefined : lecon.exercices[position];
    if (exercice?.type === "lecture") await lireLeTexte(numero, exercice.texte);
    else await presenter(numero);
  }, [seance, lecon, lireLeTexte, presenter]);

  const jAiEcoute = useCallback(async () => {
    const numero = ++sequence.current;
    faireSilence();
    setRangDuMotDuTexte(undefined);
    setPositionDuTexteEcoute(seance.exerciceEnCours()?.position);
    await presenter(numero);
  }, [sequence, faireSilence, seance, presenter]);

  const ecouterLeMot = useCallback(async () => {
    const courante = laQuestionEnCours();
    if (!courante || estFigee.current) return;
    const numero = ++sequence.current;
    faireSilence();
    if (await direLeMotAEcouter(numero, courante.question)) setChoixVisiblesPour(courante.question);
  }, [laQuestionEnCours, sequence, faireSilence, direLeMotAEcouter]);

  /** Relit la question jusqu'au bout du déroulé de la présentation : l'enfant n'est jamais laissé devant une question sans choix. Rend `false` s'il n'y a rien à relire. */
  const relireLaQuestion = useCallback(() => {
    if (!laQuestionEnCours() || estFigee.current) return false;
    const numero = ++sequence.current;
    faireSilence();
    void presenter(numero);
    return true;
  }, [laQuestionEnCours, sequence, faireSilence, presenter]);

  const encourager = useCallback(async (numero: number, reaction: Reaction, question: QuestionJouee) => {
    const texte = `${reaction.parole.texte} ${question.aideApresErreur()}`;
    const jusquAuBout = await dire({ texte, nature: "encouragement", humeur: reaction.humeur, effetsAvant: [reaction.effetSonore] });
    if (jusquAuBout) await direLeMotAEcouter(numero, question);
  }, [dire, direLeMotAEcouter]);

  /** La bulle affiche la phrase entière ; l'explication est lue morceau par morceau, chacun dans sa langue, le reste avec la voix du personnage guide. */
  const feliciter = useCallback(async (numero: number, reaction: Reaction, question: QuestionJouee, effetsAvant: readonly EffetSonore[]) => {
    const explication = question.explication();
    if (explication === undefined) {
      await dire({ texte: reaction.parole.texte, nature: "felicitation", humeur: reaction.humeur, effetsAvant });
      return;
    }
    const texte = `${reaction.parole.texte} ${explication.texte}`;
    if (!(await dire({ texte, aLire: reaction.parole.texte, nature: "felicitation", humeur: reaction.humeur, effetsAvant }))) return;
    for (const morceau of explication.morceaux) {
      await lire(morceau.texte, { langue: morceau.langue });
      if (numero !== sequence.current) return;
    }
  }, [dire, lire, sequence]);

  /** Au dernier trou la félicitation annonce que le texte est complet ; à la dernière personne, que le verbe est su. */
  const avecLaFinDeLExercice = useCallback((reaction: Reaction, position: number, paroleDue: ParoleDue | undefined): Reaction => {
    const exercice = lecon.exercices[position];
    const verbe = exercice?.type === "conjugaison" ? exercice.verbe : undefined;
    const finDeLExercice = paroleDue === "tuSaisConjuguer"
      ? paroleApresUneBonneReponse(paroleDueDeMotivation(paroleDue, verbe), personnageGuide, hasardDuNavigateur)
      : seance.texteCompleteParLaDerniereReponse()
      ? direLeTexteComplet(personnageGuide, hasardDuNavigateur)
      : undefined;
    return finDeLExercice === undefined ? reaction : { ...reaction, parole: { ...reaction.parole, texte: finDeLExercice } };
  }, [lecon, seance, personnageGuide]);

  /** En conjugaison, une bonne forme fait applaudir le personnage guide sans qu'il félicite : seule la dernière personne est félicitée. */
  const applaudirEnSilence = useCallback(async (humeur: Humeur, effets: readonly EffetSonore[]) => {
    faireSilence();
    montrerHumeur(humeur);
    void jouer(effets);
    await attendre(PAUSE_DES_APPLAUDISSEMENTS_MS);
  }, [faireSilence, montrerHumeur, jouer]);

  const reagirALaBonneReponse = useCallback((
    numero: number,
    reaction: Reaction,
    question: QuestionJouee,
    position: number,
    effets: readonly EffetSonore[],
  ) => {
    const paroleDue = seance.paroleDueApresLaDerniereReponse();
    return paroleDue === "applaudir"
      ? applaudirEnSilence(reaction.humeur, effets)
      : feliciter(numero, avecLaFinDeLExercice(reaction, position, paroleDue), question, effets);
  }, [seance, applaudirEnSilence, feliciter, avecLaFinDeLExercice]);

  const repondre = useCallback(async (texte: string, suite: SuiteDeLaReponse) => {
    const courante = laQuestionEnCours();
    if (!courante || estFigee.current) return;
    const { exercice, question } = courante;
    const questionsReussiesAvant = seance.avancement().questionsReussies;
    const resultat = seance.repondre(Reponse.choix(texte));
    if (resultat === "dejaEcartee") return;
    const numero = ++sequence.current;
    redessiner();
    const reaction = reagirALaReponse(resultat === "juste", personnageGuide, hasardDuNavigateur);
    if (resultat === "fausse") {
      signaler("fausse", texte);
      return await encourager(numero, reaction, question);
    }
    figer({ position: exercice.position, exercice, question });
    setBulleEclatee(texte);
    annoncerLAvancement(seance.avancement());
    signaler("juste", texte, seance.exerciceCompleteParLaDerniereReponse());
    await reagirALaBonneReponse(numero, reaction, question, exercice.position, effetsApresUneBonneReponse(seance, questionsReussiesAvant));
    if (!(await attendreLEcranSuivant()) || !vivant.current) return;
    figer(undefined);
    setBulleEclatee(undefined);
    const nouvelExercice = seance.exerciceEnCours()?.position !== exercice.position;
    await suite(++sequence.current, seance.retirerFaits(), nouvelExercice);
  }, [laQuestionEnCours, seance, sequence, redessiner, personnageGuide, signaler, encourager, figer, reagirALaBonneReponse, vivant, estFigee, annoncerLAvancement, attendreLEcranSuivant]);

  const jeNeSaisPas = useCallback(async () => {
    const courante = laQuestionEnCours();
    if (!courante || estFigee.current || !courante.question.jeNeSaisPasPermis() || courante.question.bonneReponseMontree) return;
    const { aide } = seance.direJeNeSaisPas();
    const numero = ++sequence.current;
    faireSilence();
    redessiner();
    const reaction = reagirAJeNeSaisPas(aide);
    const jusquAuBout = await dire({ texte: reaction.parole, nature: "aide", humeur: reaction.humeur });
    if (jusquAuBout) await direLeMotAEcouter(numero, courante.question);
  }, [laQuestionEnCours, seance, sequence, faireSilence, redessiner, dire, direLeMotAEcouter]);

  return {
    jeNeSaisPas,
    choixVisiblesPour,
    positionDuTexteEcoute,
    rangDuMotDuTexte,
    bulleEclatee,
    ouvrir,
    presenter,
    repondre,
    jAiEcoute,
    relireLaQuestion,
    ecouterLeMot,
  };
}
