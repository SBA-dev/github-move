import { useCallback, useReducer, useRef, useState } from "react";
import {
  Avancement,
  lectureDesChoix,
  QuestionDeCalcul,
  QuestionJouee,
  type QuestionPosee,
  Reponse,
  type ReponseEnNombre,
  type ReponseParChoix,
  type TestDeDepart,
} from "@domain/apprentissage";
import { type PersonnageGuide, reagirAJeNeSaisPas } from "@domain/motivation";
import { useReducedMotion } from "motion/react";
import { attendre } from "../seance/exercices/attendre.ts";
import {
  aiderQuandOnNeSaitPas,
  encouragerApresUneErreurDeCalcul,
  feliciterUnCalcul,
} from "../seance/exercices/paroles-du-calcul.ts";
import type { usePersonnageQuiParle } from "../seance/usePersonnageQuiParle.ts";
import type { Voix } from "../voix/index.ts";
import { CONSIGNE_DU_TEST_DE_DEPART } from "./paroles-du-test-de-depart.ts";

export type Personnage = ReturnType<typeof usePersonnageQuiParle>;

const PAUSE_ENTRE_DEUX_PAROLES_MS = 400;
const PAUSE_AVEC_MOUVEMENTS_REDUITS_MS = 150;

type Parametres = {
  readonly test: TestDeDepart;
  /** Le nombre de questions prévues : le même avancement que la séance, sur ce total. */
  readonly nombreDeQuestions: number;
  readonly personnage: Personnage;
  readonly lire: Voix["lire"];
  readonly personnageGuide: PersonnageGuide;
  readonly toutLireAVoixHaute: boolean;
  readonly onFini: () => void;
};

function phraseDeLaQuestion(question: QuestionPosee): string {
  return question instanceof QuestionDeCalcul ? question.enCours().phrase : question.enonce;
}

function jeNeSaisPasPropose(question: QuestionPosee): boolean {
  if (question instanceof QuestionJouee) return question.jeNeSaisPasPermis() && !question.bonneReponseMontree;
  return question instanceof QuestionDeCalcul && question.enCours().jeNeSaisPasPropose;
}

/**
 * Fait vivre le test de départ dans le navigateur : appelle le domaine, puis fait dire au personnage guide ce qu'il décide.
 * Chaque action repart d'une nouvelle « séquence » : une parole ou un abandon plus récent interrompt les suites en attente.
 */
export function useDeroulementDuTestDeDepart(
  { test, nombreDeQuestions, personnage, lire, personnageGuide, toutLireAVoixHaute, onFini }: Parametres,
) {
  const { dire, faireSilence, reecouter: relire } = personnage;
  const [, redessiner] = useReducer((compteur: number) => compteur + 1, 0);
  const sequence = useRef(0);
  const vivant = useRef(true);
  const estFigee = useRef(false);
  const quandFini = useRef(onFini);
  quandFini.current = onFini;
  const [figee, setFigee] = useState<QuestionPosee | undefined>();
  const [choixVisiblesPour, setChoixVisiblesPour] = useState<QuestionPosee | undefined>();
  const [bulleEclatee, setBulleEclatee] = useState<string | undefined>();
  const [questionsReussies, setQuestionsReussies] = useState(0);
  const [avancementAnnonce, setAvancementAnnonce] = useState("");
  const pause = useRef(PAUSE_ENTRE_DEUX_PAROLES_MS);
  pause.current = useReducedMotion() ? PAUSE_AVEC_MOUVEMENTS_REDUITS_MS : PAUSE_ENTRE_DEUX_PAROLES_MS;

  const figer = useCallback((question: QuestionPosee | undefined) => {
    estFigee.current = question !== undefined;
    setFigee(question);
  }, []);

  const direLeMotAEcouter = useCallback(async (numero: number, question: QuestionPosee) => {
    if (!(question instanceof QuestionJouee) || question.motAEcouter === undefined) return true;
    await lire(question.motAEcouter, { langue: question.langue });
    return numero === sequence.current;
  }, [lire]);

  const presenter = useCallback(async (numero: number) => {
    const question = test.questionEnCours();
    if (!question) return;
    if (!(await dire({ texte: phraseDeLaQuestion(question), nature: "question" }))) return;
    if (!(await direLeMotAEcouter(numero, question))) return;
    setChoixVisiblesPour(question);
    const choixLus = toutLireAVoixHaute && question instanceof QuestionJouee
      ? lectureDesChoix(question.choix.possibles())
      : undefined;
    if (choixLus !== undefined) await lire(choixLus);
  }, [test, dire, direLeMotAEcouter, toutLireAVoixHaute, lire]);

  const commencer = useCallback(async () => {
    vivant.current = true;
    const numero = ++sequence.current;
    if (!(await dire({ texte: CONSIGNE_DU_TEST_DE_DEPART, nature: "consigne" }))) return;
    await attendre(pause.current);
    if (numero === sequence.current) await presenter(numero);
  }, [dire, presenter]);

  const encourager = useCallback(async (numero: number, question: QuestionPosee) => {
    const jusquAuBout = await dire(encouragerApresUneErreurDeCalcul(personnageGuide, question.aideApresErreur()));
    if (jusquAuBout) await direLeMotAEcouter(numero, question);
  }, [dire, personnageGuide, direLeMotAEcouter]);

  const feliciterEtPasserALaSuite = useCallback(async (question: QuestionPosee, texte: string | undefined) => {
    figer(question);
    setBulleEclatee(texte);
    const reussies = questionsReussies + 1;
    setQuestionsReussies(reussies);
    setAvancementAnnonce(`${reussies} sur ${nombreDeQuestions}`);
    await dire(feliciterUnCalcul(personnageGuide));
    if (!vivant.current) return;
    figer(undefined);
    setBulleEclatee(undefined);
    if (test.estFini()) return quandFini.current();
    await presenter(++sequence.current);
  }, [figer, questionsReussies, nombreDeQuestions, dire, personnageGuide, test, presenter]);

  const repondre = useCallback(async (reponse: ReponseParChoix | ReponseEnNombre) => {
    const question = test.questionEnCours();
    if (!question || estFigee.current) return;
    const resultat = test.repondre(reponse);
    if (resultat === "dejaEcartee") return;
    const numero = ++sequence.current;
    redessiner();
    if (resultat === "fausse") return await encourager(numero, question);
    await feliciterEtPasserALaSuite(question, reponse.genre === "choix" ? reponse.texte : undefined);
  }, [test, encourager, feliciterEtPasserALaSuite]);

  const repondreParUnChoix = useCallback((texte: string) => repondre(Reponse.choix(texte)), [repondre]);
  const repondreParUnNombre = useCallback((nombre: number) => repondre(Reponse.nombre(nombre)), [repondre]);

  const jeNeSaisPas = useCallback(async () => {
    const question = test.questionEnCours();
    if (!question || estFigee.current || !jeNeSaisPasPropose(question)) return;
    const calcul = question instanceof QuestionDeCalcul ? question.enCours() : undefined;
    const { aide, bonneReponse } = test.direJeNeSaisPas();
    const numero = ++sequence.current;
    faireSilence();
    redessiner();
    const reaction = reagirAJeNeSaisPas(aide);
    const parole = calcul
      ? aiderQuandOnNeSaitPas(calcul, aide, bonneReponse)
      : { texte: reaction.parole, nature: "aide", humeur: reaction.humeur } as const;
    if (await dire(parole)) await direLeMotAEcouter(numero, question);
  }, [test, faireSilence, dire, direLeMotAEcouter]);

  /** Relit la question jusqu'au bout de sa présentation : l'enfant n'est jamais laissé devant une question sans choix. Rend `false` s'il n'y a rien à relire. */
  const relireLaQuestion = useCallback(() => {
    if (!test.questionEnCours() || estFigee.current) return false;
    const numero = ++sequence.current;
    faireSilence();
    void presenter(numero);
    return true;
  }, [test, faireSilence, presenter]);

  const ecouterLeMot = useCallback(async () => {
    const question = test.questionEnCours();
    if (!question || estFigee.current) return;
    const numero = ++sequence.current;
    faireSilence();
    if (await direLeMotAEcouter(numero, question)) setChoixVisiblesPour(question);
  }, [test, faireSilence, direLeMotAEcouter]);

  const reecouter = useCallback(() => {
    if (estFigee.current) return;
    if (personnage.parole?.nature === "question" && relireLaQuestion()) return;
    sequence.current++;
    relire();
  }, [personnage.parole, relireLaQuestion, relire]);

  const abandonner = useCallback(() => {
    vivant.current = false;
    sequence.current++;
    faireSilence();
  }, [faireSilence]);

  return {
    figee,
    choixVisiblesPour,
    bulleEclatee,
    avancement: new Avancement(questionsReussies, nombreDeQuestions),
    avancementAnnonce,
    commencer,
    abandonner,
    reecouter,
    relireLaQuestion,
    ecouterLeMot,
    repondreParUnChoix,
    repondreParUnNombre,
    jeNeSaisPas,
  };
}
