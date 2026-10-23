import { type MutableRefObject, useCallback, useRef, useState } from "react";
import {
  complementDeLEncouragement,
  explicationDeLaReponse,
  type FaitDeSeance,
  INTRODUCTION_DE_LA_LECTURE,
  type QuestionJouee,
  Reponse,
  type Seance,
} from "@domain/apprentissage";
import type { Lecon } from "@domain/catalogue";
import { type PersonnageGuide, type Reaction, reagirALaReponse } from "@domain/motivation";
import { hasardDuNavigateur } from "../../hasard-navigateur.ts";
import type { Voix } from "../../voix/index.ts";
import type { ParoleADire } from "../usePersonnageQuiParle.ts";
import { type QuestionDuCatalogue, questionDuCatalogue } from "./question-du-catalogue.ts";

type Dependances = {
  readonly seance: Seance;
  readonly lecon: Lecon;
  readonly personnageGuide: PersonnageGuide;
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
  { seance, lecon, personnageGuide, lire, dire, faireSilence, sequence, vivant, redessiner }: Dependances,
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
    const catalogue = exercice && questionDuCatalogue(lecon.exercices[exercice.position], exercice.rangDeLaQuestionEnCours);
    return exercice && question && catalogue ? { exercice, question, catalogue } : undefined;
  }, [seance, lecon]);

  const direLeMotAEcouter = useCallback(async (numero: number, { dire: mot, langue }: QuestionDuCatalogue) => {
    if (mot === undefined) return true;
    await lire(mot, { langue });
    return numero === sequence.current;
  }, [lire, sequence]);

  const presenter = useCallback(async (numero: number) => {
    const courante = laQuestionEnCours();
    if (!courante) return;
    if (!(await dire({ texte: courante.question.enonce, nature: "question" }))) return;
    if (!(await direLeMotAEcouter(numero, courante.catalogue))) return;
    setChoixVisiblesPour(courante.question);
  }, [laQuestionEnCours, dire, direLeMotAEcouter]);

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

  const relireLaQuestion = useCallback(() => {
    const courante = laQuestionEnCours();
    if (!courante) return;
    sequence.current++;
    void dire({ texte: courante.question.enonce, nature: "question" });
  }, [laQuestionEnCours, sequence, dire]);

  const ecouterLeMot = useCallback(async () => {
    const courante = laQuestionEnCours();
    if (!courante) return;
    const numero = ++sequence.current;
    faireSilence();
    await direLeMotAEcouter(numero, courante.catalogue);
  }, [laQuestionEnCours, sequence, faireSilence, direLeMotAEcouter]);

  const encourager = useCallback(async (numero: number, reaction: Reaction, catalogue: QuestionDuCatalogue) => {
    const texte = `${reaction.parole.texte} ${complementDeLEncouragement(catalogue.type, catalogue)}`;
    const jusquAuBout = await dire({ texte, nature: "encouragement", humeur: reaction.humeur });
    if (jusquAuBout) await direLeMotAEcouter(numero, catalogue);
  }, [dire, direLeMotAEcouter]);

  const feliciter = useCallback(async (reaction: Reaction, catalogue: QuestionDuCatalogue) => {
    const explication = explicationDeLaReponse(catalogue.type, { dire: catalogue.dire, reponse: catalogue.reponse });
    const texte = explication === undefined ? reaction.parole.texte : `${reaction.parole.texte} ${explication}`;
    await dire({ texte, nature: "felicitation", humeur: reaction.humeur });
  }, [dire]);

  const repondre = useCallback(async (texte: string, suite: SuiteDeLaReponse) => {
    const courante = laQuestionEnCours();
    if (!courante || estFigee.current) return;
    const { exercice, question, catalogue } = courante;
    const resultat = seance.repondre(Reponse.choix(texte));
    if (resultat === "dejaEcartee") return;
    const numero = ++sequence.current;
    redessiner();
    const reaction = reagirALaReponse(resultat === "juste", personnageGuide, hasardDuNavigateur);
    if (resultat === "fausse") return await encourager(numero, reaction, catalogue);
    figer({ position: exercice.position, question });
    setBulleEclatee(texte);
    const { questionsReussies, total } = seance.avancement();
    setAvancementAnnonce(`${questionsReussies} sur ${total}`);
    await feliciter(reaction, catalogue);
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
