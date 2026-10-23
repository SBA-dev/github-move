import { type MutableRefObject, useCallback, useRef, useState } from "react";
import {
  type FaitDeSeance,
  INTRODUCTION_DE_LA_LECTURE,
  lectureDesChoix,
  type QuestionJouee,
  Reponse,
  type Seance,
} from "@domain/apprentissage";
import type { Lecon } from "@domain/catalogue";
import { type PersonnageGuide, type Reaction, reagirALaReponse } from "@domain/motivation";
import { hasardDuNavigateur } from "../../hasard-navigateur.ts";
import type { Voix } from "../../voix/index.ts";
import type { ParoleADire } from "../usePersonnageQuiParle.ts";

type Dependances = {
  readonly seance: Seance;
  readonly lecon: Lecon;
  readonly personnageGuide: PersonnageGuide;
  /** Réglage du profil : les choix proposés sont lus après la question. */
  readonly toutLireAVoixHaute: boolean;
  readonly lire: Voix["lire"];
  readonly dire: (parole: ParoleADire) => Promise<boolean>;
  readonly faireSilence: () => void;
  /** Numéro de la séquence en cours : une action plus récente interrompt les suites en attente. */
  readonly sequence: MutableRefObject<number>;
  /** Faux une fois la séance quittée. */
  readonly vivant: MutableRefObject<boolean>;
  readonly redessiner: () => void;
};

/** La question réussie, montrée telle quelle le temps de la féliciter. */
type QuestionFigee = { readonly position: number; readonly question: QuestionJouee };

type SuiteDeLaReponse = (numero: number, faits: FaitDeSeance[], nouvelExercice: boolean) => Promise<void>;

/** Le déroulé des exercices à choix (bulles, lecture, écoute) : la question est lue, puis les choix apparaissent. */
export function useQuestionsAChoix(
  { seance, lecon, personnageGuide, toutLireAVoixHaute, lire, dire, faireSilence, sequence, vivant, redessiner }: Dependances,
) {
  const [figee, setFigee] = useState<QuestionFigee | undefined>();
  const estFigee = useRef(false);
  const [choixVisiblesPour, setChoixVisiblesPour] = useState<QuestionJouee | undefined>();
  const [positionDuTexteEcoute, setPositionDuTexteEcoute] = useState<number | undefined>();
  const [rangDuMotDuTexte, setRangDuMotDuTexte] = useState<number | undefined>();
  const [bulleEclatee, setBulleEclatee] = useState<string | undefined>();
  const [avancementAnnonce, setAvancementAnnonce] = useState("");

  const figer = useCallback((question: QuestionFigee | undefined) => {
    estFigee.current = question !== undefined;
    setFigee(question);
  }, []);

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
    if (!(await dire({ texte: courante.question.enonce, nature: "question" }))) return;
    if (!(await direLeMotAEcouter(numero, courante.question))) return;
    setChoixVisiblesPour(courante.question);
    const lectureDesChoixProposes = toutLireAVoixHaute ? lectureDesChoix(courante.question.choix.possibles()) : undefined;
    if (lectureDesChoixProposes !== undefined) await lire(lectureDesChoixProposes);
  }, [laQuestionEnCours, dire, direLeMotAEcouter, toutLireAVoixHaute, lire]);

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
    const texte = `${reaction.parole.texte} ${question.complementDeLEncouragement()}`;
    const jusquAuBout = await dire({ texte, nature: "encouragement", humeur: reaction.humeur });
    if (jusquAuBout) await direLeMotAEcouter(numero, question);
  }, [dire, direLeMotAEcouter]);

  /** La bulle affiche la phrase entière ; l'explication est lue morceau par morceau, chacun dans sa langue, le reste avec la voix du personnage guide. */
  const feliciter = useCallback(async (numero: number, reaction: Reaction, question: QuestionJouee) => {
    const explication = question.explication();
    if (explication === undefined) {
      await dire({ texte: reaction.parole.texte, nature: "felicitation", humeur: reaction.humeur });
      return;
    }
    const texte = `${reaction.parole.texte} ${explication.texte}`;
    if (!(await dire({ texte, aLire: reaction.parole.texte, nature: "felicitation", humeur: reaction.humeur }))) return;
    for (const morceau of explication.morceaux) {
      await lire(morceau.texte, { langue: morceau.langue });
      if (numero !== sequence.current) return;
    }
  }, [dire, lire, sequence]);

  const repondre = useCallback(async (texte: string, suite: SuiteDeLaReponse) => {
    const courante = laQuestionEnCours();
    if (!courante || estFigee.current) return;
    const { exercice, question } = courante;
    const resultat = seance.repondre(Reponse.choix(texte));
    if (resultat === "dejaEcartee") return;
    const numero = ++sequence.current;
    redessiner();
    const reaction = reagirALaReponse(resultat === "juste", personnageGuide, hasardDuNavigateur);
    if (resultat === "fausse") return await encourager(numero, reaction, question);
    figer({ position: exercice.position, question });
    setBulleEclatee(texte);
    const { questionsReussies, total } = seance.avancement();
    setAvancementAnnonce(`${questionsReussies} sur ${total}`);
    await feliciter(numero, reaction, question);
    if (!vivant.current) return;
    figer(undefined);
    setBulleEclatee(undefined);
    const nouvelExercice = seance.exerciceEnCours()?.position !== exercice.position;
    await suite(++sequence.current, seance.retirerFaits(), nouvelExercice);
  }, [laQuestionEnCours, seance, sequence, redessiner, personnageGuide, encourager, figer, feliciter, vivant]);

  return {
    figee,
    choixVisiblesPour,
    positionDuTexteEcoute,
    rangDuMotDuTexte,
    bulleEclatee,
    avancementAnnonce,
    ouvrir,
    presenter,
    repondre,
    jAiEcoute,
    relireLaQuestion,
    ecouterLeMot,
  };
}
