import { useCallback, useReducer, useRef, useState } from "react";
import {
  type BoiteOuverte,
  type CorrectionDuMot,
  INTRODUCTION_DE_LA_LECTURE,
  lectureDesChoix,
  QuestionDeBoite,
  QuestionDeProblemeEnBarres,
  type QuestionDeRevision,
  QuestionJouee,
  type QuestionPosee,
  Reponse,
  type ReponseEnNombre,
  type ReponseParChoix,
  type ResultatDeReponse,
  type SchemaResolu,
} from "@domain/apprentissage";
import {
  effetsSonoresApresUneBonneReponse,
  type PersonnageGuide,
  reagirAJeNeSaisPas,
  reagirAJeNeSaisPasEnDictee,
} from "@domain/motivation";
import { useReducedMotion } from "motion/react";
import { CIBLE_DE_LA_ZONE_DE_REPONSE, useRetourDeLaReponse } from "../retours/index.ts";
import { attendre } from "../seance/exercices/attendre.ts";
import { aiderQuandOnNeSaitPas } from "../seance/exercices/paroles-du-calcul.ts";
import type { usePersonnageQuiParle } from "../seance/usePersonnageQuiParle.ts";
import type { Voix } from "../voix/index.ts";
import type { TexteDeLecture } from "./commencer-la-revision.ts";
import type { SeanceDeQuestions } from "./seance-de-questions.ts";
import { encouragerLaReponse, feliciterLaReponse, vueDuCalcul } from "./paroles-de-la-revision.ts";

export type Personnage = ReturnType<typeof usePersonnageQuiParle>;

const PAUSE_ENTRE_DEUX_PAROLES_MS = 400;
const PAUSE_AVEC_MOUVEMENTS_REDUITS_MS = 150;
const DUREE_DES_LETTRES_FAUSSES_MS = 1300;

type Parametres = {
  readonly seance: SeanceDeQuestions;
  /** Ce que le personnage guide dit en commençant. */
  readonly parolesDeDebut: string;
  readonly nombreDeQuestions: number;
  /** Les textes des questions de lecture, par clé de question : ils sont lus avant la question. */
  readonly textes: ReadonlyMap<string, TexteDeLecture>;
  readonly personnage: Personnage;
  readonly lire: Voix["lire"];
  readonly personnageGuide: PersonnageGuide;
  readonly toutLireAVoixHaute: boolean;
  readonly onFini: () => void;
};

function phrasesDeLaPresentation(question: QuestionPosee): readonly string[] {
  if (question instanceof QuestionDeBoite) return question.enCours().deroulement;
  if (question instanceof QuestionDeProblemeEnBarres) {
    const schema = question.enCours();
    return [schema.enonce, schema.explicationDuSchema];
  }
  return [];
}

function jeNeSaisPasPropose(question: QuestionPosee): boolean {
  if (question instanceof QuestionJouee) return question.jeNeSaisPasPermis() && !question.bonneReponseMontree;
  return vueDuCalcul(question)?.jeNeSaisPasPropose === true;
}

/**
 * Fait vivre la séance de révision dans le navigateur : appelle le domaine, puis fait dire au personnage guide ce qu'il décide.
 * Chaque action repart d'une nouvelle « séquence » : une parole ou un abandon plus récent interrompt les suites en attente.
 */
export function useDeroulementDeRevision(
  { seance, parolesDeDebut, nombreDeQuestions, textes, personnage, lire, personnageGuide, toutLireAVoixHaute, onFini }: Parametres,
) {
  const { dire, faireSilence, reecouter: relire } = personnage;
  const [, redessiner] = useReducer((compteur: number) => compteur + 1, 0);
  const { retour, signaler } = useRetourDeLaReponse();
  const sequence = useRef(0);
  const vivant = useRef(true);
  const estFigee = useRef(false);
  const lettresFaussesMontrees = useRef(false);
  const quandFini = useRef(onFini);
  quandFini.current = onFini;
  const [figee, setFigee] = useState<QuestionDeRevision | undefined>();
  const [choixVisiblesPour, setChoixVisiblesPour] = useState<QuestionPosee | undefined>();
  const [bulleEclatee, setBulleEclatee] = useState<string | undefined>();
  const [phrasesDites, setPhrasesDites] = useState(0);
  const [boiteOuverte, setBoiteOuverte] = useState<BoiteOuverte | undefined>();
  const [schemaResolu, setSchemaResolu] = useState<SchemaResolu | undefined>();
  const [lettresFausses, setLettresFausses] = useState<CorrectionDuMot | undefined>();
  const [toucheQuiBrille, setToucheQuiBrille] = useState<string | undefined>();
  const [texteEcoutePour, setTexteEcoutePour] = useState<string | undefined>();
  const [rangDuMotDuTexte, setRangDuMotDuTexte] = useState<number | undefined>();
  const [questionsReussies, setQuestionsReussies] = useState(0);
  const [avancementAnnonce, setAvancementAnnonce] = useState("");
  const pause = useRef(PAUSE_ENTRE_DEUX_PAROLES_MS);
  pause.current = useReducedMotion() ? PAUSE_AVEC_MOUVEMENTS_REDUITS_MS : PAUSE_ENTRE_DEUX_PAROLES_MS;

  const figer = useCallback((question: QuestionDeRevision | undefined) => {
    estFigee.current = question !== undefined;
    setFigee(question);
  }, []);

  const direLeMotAEcouter = useCallback(async (numero: number, question: QuestionPosee) => {
    if (!(question instanceof QuestionJouee) || question.motAEcouter === undefined) return true;
    await lire(question.motAEcouter, { langue: question.langue });
    return numero === sequence.current;
  }, [lire]);

  const presenterUneQuestionIllustree = useCallback(async (question: QuestionPosee) => {
    const phrases = phrasesDeLaPresentation(question);
    setPhrasesDites(0);
    for (const texte of phrases) {
      if (!(await dire({ texte, nature: "question" }))) return setPhrasesDites(phrases.length);
      setPhrasesDites((dites) => dites + 1);
    }
  }, [dire]);

  const presenter = useCallback(async (numero: number) => {
    const courante = seance.questionEnCours();
    if (!courante) return;
    const { dictee, question } = courante;
    if (dictee) {
      await dire({ texte: dictee.texteAffiche(), aLire: dictee.texteDit(), nature: "dictee" });
      return;
    }
    if (phrasesDeLaPresentation(question).length > 0) return await presenterUneQuestionIllustree(question);
    if (!(await dire({ texte: question.enonce, nature: "question" }))) return;
    if (!(await direLeMotAEcouter(numero, question))) return;
    setChoixVisiblesPour(question);
    const choixLus = toutLireAVoixHaute && question instanceof QuestionJouee
      ? lectureDesChoix(question.choix.possibles())
      : undefined;
    if (choixLus !== undefined) await lire(choixLus);
  }, [seance, dire, presenterUneQuestionIllustree, direLeMotAEcouter, toutLireAVoixHaute, lire]);

  const lireLeTexte = useCallback(async (numero: number, texte: string) => {
    if (!(await dire({ texte: INTRODUCTION_DE_LA_LECTURE, nature: "introduction" }))) return;
    const estLaDerniere = () => numero === sequence.current;
    await lire(texte, {
      onMot: (rang) => estLaDerniere() && setRangDuMotDuTexte(rang),
      onFin: () => estLaDerniere() && setRangDuMotDuTexte(undefined),
    });
  }, [dire, lire]);

  /** Une question de lecture commence par la lecture de son texte ; la question suit quand l'enfant dit « J'ai écouté ». */
  const ouvrir = useCallback(async (numero: number) => {
    const courante = seance.questionEnCours();
    const texte = courante && textes.get(courante.identite.valeur);
    if (texte) await lireLeTexte(numero, texte.texte);
    else await presenter(numero);
  }, [seance, textes, lireLeTexte, presenter]);

  const jAiEcoute = useCallback(async () => {
    const numero = ++sequence.current;
    faireSilence();
    setRangDuMotDuTexte(undefined);
    setTexteEcoutePour(seance.questionEnCours()?.identite.valeur);
    await presenter(numero);
  }, [faireSilence, seance, presenter]);

  const commencer = useCallback(async () => {
    vivant.current = true;
    const numero = ++sequence.current;
    if (!(await dire({ texte: parolesDeDebut, nature: "consigne" }))) return;
    await attendre(pause.current);
    if (numero === sequence.current) await ouvrir(numero);
  }, [dire, parolesDeDebut, ouvrir]);

  const feliciterEtPasserALaSuite = useCallback(async (courante: QuestionDeRevision, texte: string | undefined) => {
    figer(courante);
    setBulleEclatee(texte);
    if (courante.question instanceof QuestionDeBoite) setBoiteOuverte(courante.question.ouverte());
    if (courante.question instanceof QuestionDeProblemeEnBarres) setSchemaResolu(courante.question.resolu());
    const reussies = questionsReussies + 1;
    setQuestionsReussies(reussies);
    setAvancementAnnonce(`${reussies} sur ${nombreDeQuestions}`);
    const effets = effetsSonoresApresUneBonneReponse({
      questionsReussiesAvant: questionsReussies,
      questionsReussiesApres: reussies,
      exerciceComplete: false,
      pendantLeChronoDUneFluence: false,
    });
    await dire(feliciterLaReponse(courante, personnageGuide, effets));
    if (!vivant.current) return;
    figer(undefined);
    setBulleEclatee(undefined);
    setBoiteOuverte(undefined);
    setSchemaResolu(undefined);
    setPhrasesDites(0);
    if (seance.estFinie()) return quandFini.current();
    await ouvrir(++sequence.current);
  }, [figer, questionsReussies, nombreDeQuestions, dire, personnageGuide, seance, ouvrir]);

  const apresLaReponse = useCallback(async (courante: QuestionDeRevision, resultat: ResultatDeReponse, texte?: string) => {
    if (resultat === "dejaEcartee") return;
    const numero = ++sequence.current;
    redessiner();
    signaler(resultat, texte ?? CIBLE_DE_LA_ZONE_DE_REPONSE);
    if (resultat === "juste") return await feliciterEtPasserALaSuite(courante, texte);
    const jusquAuBout = await dire(encouragerLaReponse(courante, personnageGuide));
    if (!jusquAuBout) return;
    if (courante.dictee) await lire(courante.dictee.motADire());
    else await direLeMotAEcouter(numero, courante.question);
  }, [signaler, feliciterEtPasserALaSuite, dire, personnageGuide, lire, direLeMotAEcouter]);

  const repondre = useCallback(async (reponse: ReponseParChoix | ReponseEnNombre) => {
    const courante = seance.questionEnCours();
    if (!courante || estFigee.current) return;
    await apresLaReponse(courante, seance.repondre(reponse), reponse.genre === "choix" ? reponse.texte : undefined);
  }, [seance, apresLaReponse]);

  const repondreParUnChoix = useCallback((texte: string) => repondre(Reponse.choix(texte)), [repondre]);
  const repondreParUnNombre = useCallback((nombre: number) => repondre(Reponse.nombre(nombre)), [repondre]);

  const montrerLesLettresFausses = useCallback((correction: CorrectionDuMot) => {
    lettresFaussesMontrees.current = true;
    setLettresFausses(correction);
    void attendre(DUREE_DES_LETTRES_FAUSSES_MS).then(() => {
      lettresFaussesMontrees.current = false;
      if (vivant.current) setLettresFausses(undefined);
    });
  }, []);

  const taper = useCallback(async (lettre: string) => {
    const courante = seance.questionEnCours();
    const dictee = courante?.dictee;
    const minuscule = lettre.toLowerCase();
    if (!courante || !dictee || estFigee.current || lettresFaussesMontrees.current) return;
    if (!dictee.rangeesDuClavier().flat().some((touche) => touche.lettre === minuscule && touche.disponible)) return;
    const resultat = dictee.taper(minuscule);
    setToucheQuiBrille(undefined);
    redessiner();
    if (resultat === undefined) return;
    const correction = dictee.derniereCorrection();
    if (resultat === "fausse" && correction) montrerLesLettresFausses(correction);
    await apresLaReponse(courante, resultat);
  }, [seance, montrerLesLettresFausses, apresLaReponse]);

  const effacer = useCallback(() => {
    const dictee = seance.questionEnCours()?.dictee;
    if (!dictee?.peutEffacer() || estFigee.current || lettresFaussesMontrees.current) return;
    dictee.effacer();
    setToucheQuiBrille(undefined);
    redessiner();
  }, [seance]);

  const jeNeSaisPasEnDictee = useCallback(async () => {
    const { maniere, bonneReponse } = seance.direJeNeSaisPas();
    if (maniere === "briller") setToucheQuiBrille(bonneReponse);
    sequence.current++;
    faireSilence();
    redessiner();
    const reaction = reagirAJeNeSaisPasEnDictee(maniere);
    await dire({ texte: reaction.parole, nature: "aide", humeur: reaction.humeur });
  }, [seance, faireSilence, dire]);

  const jeNeSaisPas = useCallback(async () => {
    const courante = seance.questionEnCours();
    if (!courante || estFigee.current) return;
    if (courante.dictee) {
      if (!courante.dictee.bonneReponseMontree && !lettresFaussesMontrees.current) await jeNeSaisPasEnDictee();
      return;
    }
    const { question } = courante;
    if (!jeNeSaisPasPropose(question)) return;
    const { aide, bonneReponse } = seance.direJeNeSaisPas();
    const numero = ++sequence.current;
    faireSilence();
    redessiner();
    const calcul = vueDuCalcul(question);
    const reaction = reagirAJeNeSaisPas(aide);
    const parole = calcul
      ? aiderQuandOnNeSaitPas(calcul, aide, bonneReponse)
      : { texte: reaction.parole, nature: "aide", humeur: reaction.humeur } as const;
    if (await dire(parole)) await direLeMotAEcouter(numero, question);
  }, [seance, faireSilence, dire, direLeMotAEcouter, jeNeSaisPasEnDictee]);

  /** Relit la question jusqu'au bout de sa présentation : l'enfant n'est jamais laissé devant une question sans choix. Rend `false` s'il n'y a rien à relire. */
  const relireLaQuestion = useCallback(() => {
    if (!seance.questionEnCours() || estFigee.current) return false;
    const numero = ++sequence.current;
    faireSilence();
    void presenter(numero);
    return true;
  }, [seance, faireSilence, presenter]);

  const ecouterLeMot = useCallback(async () => {
    const question = seance.questionEnCours()?.question;
    if (!question || estFigee.current) return;
    const numero = ++sequence.current;
    faireSilence();
    if (await direLeMotAEcouter(numero, question)) setChoixVisiblesPour(question);
  }, [seance, faireSilence, direLeMotAEcouter]);

  const reecouterLeMot = useCallback(async (lent = false) => {
    const dictee = seance.questionEnCours()?.dictee;
    if (!dictee || estFigee.current) return;
    sequence.current++;
    faireSilence();
    await lire(dictee.motADire(), { lent });
  }, [seance, faireSilence, lire]);

  const reecouter = useCallback(() => {
    if (estFigee.current) return;
    const nature = personnage.parole?.nature;
    if ((nature === "question" || nature === "dictee") && relireLaQuestion()) return;
    sequence.current++;
    relire();
  }, [personnage.parole, relireLaQuestion, relire]);

  const abandonner = useCallback(() => {
    vivant.current = false;
    sequence.current++;
    faireSilence();
  }, [faireSilence]);

  return {
    retour,
    figee,
    choixVisiblesPour,
    bulleEclatee,
    phrasesDites,
    texteEcoutePour,
    rangDuMotDuTexte,
    jAiEcoute,
    boiteOuverte,
    schemaResolu,
    lettresFausses,
    toucheQuiBrille,
    questionsReussies,
    avancementAnnonce,
    commencer,
    abandonner,
    reecouter,
    relireLaQuestion,
    ecouterLeMot,
    reecouterLeMot,
    reecouterLeMotPlusLentement: () => reecouterLeMot(true),
    repondreParUnChoix,
    repondreParUnNombre,
    taper,
    effacer,
    jeNeSaisPas,
  };
}
