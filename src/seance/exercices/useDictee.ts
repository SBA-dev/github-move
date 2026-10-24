import { type MutableRefObject, useCallback, useRef, useState } from "react";
import { type CorrectionDuMot, type FaitDeSeance, PasDeLettreAEffacer, type QuestionDeDictee, type Seance } from "@domain/apprentissage";
import { type Humeur, type PersonnageGuide, paroleApresUneBonneReponse, reagirALaReponse } from "@domain/motivation";
import { hasardDuNavigateur } from "../../hasard-navigateur.ts";
import type { Voix } from "../../voix/index.ts";
import type { ParoleADire } from "../usePersonnageQuiParle.ts";
import { attendre } from "./attendre.ts";
import type { QuestionFigee } from "./useQuestionFigee.ts";

const DUREE_DES_LETTRES_FAUSSES_MS = 1300;

type Dependances = {
  readonly seance: Seance;
  readonly personnageGuide: PersonnageGuide;
  readonly lire: Voix["lire"];
  readonly dire: (parole: ParoleADire) => Promise<boolean>;
  readonly faireSilence: () => void;
  readonly montrerHumeur: (humeur: Humeur) => void;
  readonly sequence: MutableRefObject<number>;
  readonly vivant: MutableRefObject<boolean>;
  readonly redessiner: () => void;
  readonly reussite: QuestionFigee;
};

type SuiteDeLaDictee = (numero: number, faits: FaitDeSeance[], nouvelExercice: boolean) => Promise<void>;

/** Le déroulé d'une dictée : le mot est dit, les lettres s'écrivent case par case, la dernière case corrige. */
export function useDictee(
  { seance, personnageGuide, lire, dire, faireSilence, montrerHumeur, sequence, vivant, redessiner, reussite }: Dependances,
) {
  const { estFigee, figer, annoncerLAvancement } = reussite;
  /** Les lettres fausses restent en rouge un instant : pendant ce temps, rien ne s'écrit. */
  const [lettresFausses, setLettresFausses] = useState<CorrectionDuMot | undefined>();
  const lettresFaussesMontrees = useRef(false);

  const laQuestion = useCallback((): QuestionDeDictee | undefined => seance.questionDeDicteeEnCours(), [seance]);

  const peutEcrire = useCallback(
    () => laQuestion() !== undefined && !estFigee.current && !lettresFaussesMontrees.current,
    [laQuestion, estFigee],
  );

  const presenter = useCallback(async () => {
    const question = laQuestion();
    if (!question) return;
    await dire({ texte: question.texteAffiche(), aLire: question.texteDit(), nature: "dictee" });
  }, [laQuestion, dire]);

  const relireLaDictee = useCallback(() => {
    if (!laQuestion() || estFigee.current) return;
    sequence.current++;
    faireSilence();
    void presenter();
  }, [laQuestion, estFigee, sequence, faireSilence, presenter]);

  const reecouterLeMot = useCallback(async () => {
    const question = laQuestion();
    if (!question || estFigee.current) return;
    sequence.current++;
    faireSilence();
    await lire(question.motADire());
  }, [laQuestion, estFigee, sequence, faireSilence, lire]);

  const montrerLesLettresFausses = useCallback((correction: CorrectionDuMot) => {
    lettresFaussesMontrees.current = true;
    setLettresFausses(correction);
    void attendre(DUREE_DES_LETTRES_FAUSSES_MS).then(() => {
      lettresFaussesMontrees.current = false;
      if (vivant.current) setLettresFausses(undefined);
    });
  }, [vivant]);

  /** Le début juste est gardé : le personnage guide encourage, donne l'aide, puis redit le mot. */
  const encourager = useCallback(async (question: QuestionDeDictee) => {
    const reaction = reagirALaReponse(false, personnageGuide, hasardDuNavigateur);
    const aide = seance.aideApresLaDerniereErreur();
    const texte = aide === undefined ? reaction.parole.texte : `${reaction.parole.texte} ${aide}`;
    if (await dire({ texte, nature: "encouragement", humeur: reaction.humeur })) await lire(question.motADire());
  }, [seance, personnageGuide, dire, lire]);

  const feliciter = useCallback(async () => {
    const { humeur } = reagirALaReponse(true, personnageGuide, hasardDuNavigateur);
    const felicitation = paroleApresUneBonneReponse(
      seance.paroleDueApresLaDerniereReponse(),
      personnageGuide,
      hasardDuNavigateur,
    );
    const suite = seance.suiteDeLaFelicitation();
    const texte = [felicitation, suite].filter((morceau) => morceau !== undefined).join(" ");
    await dire({ texte, nature: "felicitation", humeur });
  }, [seance, personnageGuide, dire]);

  const taper = useCallback(async (lettre: string, suite: SuiteDeLaDictee) => {
    const exercice = seance.exerciceEnCours();
    const question = laQuestion();
    const minuscule = lettre.toLowerCase();
    if (!exercice || !question || !peutEcrire() || !question.touchesDisponibles().includes(minuscule)) return;
    const resultat = seance.taper(minuscule);
    redessiner();
    if (resultat === undefined) return;
    sequence.current++;
    if (resultat === "fausse") {
      const correction = seance.derniereCorrection();
      if (correction) montrerLesLettresFausses(correction);
      return await encourager(question);
    }
    figer({ position: exercice.position, exercice, question: undefined, questionDeDictee: question });
    annoncerLAvancement(seance.avancement());
    await feliciter();
    if (!vivant.current) return;
    figer(undefined);
    const nouvelExercice = seance.exerciceEnCours()?.position !== exercice.position;
    await suite(++sequence.current, seance.retirerFaits(), nouvelExercice);
  }, [seance, laQuestion, peutEcrire, redessiner, sequence, montrerLesLettresFausses, encourager, figer, annoncerLAvancement, feliciter, vivant]);

  const effacer = useCallback(() => {
    if (!peutEcrire()) return;
    try {
      seance.effacer();
    } catch (erreur) {
      if (erreur instanceof PasDeLettreAEffacer) return;
      throw erreur;
    }
    redessiner();
  }, [seance, peutEcrire, redessiner]);

  const jeNeSaisPas = useCallback(() => {
    const question = laQuestion();
    if (!question || !peutEcrire() || question.bonneReponseMontree) return;
    seance.direJeNeSaisPas();
    sequence.current++;
    faireSilence();
    montrerHumeur("reflechit");
    redessiner();
  }, [seance, laQuestion, peutEcrire, sequence, faireSilence, montrerHumeur, redessiner]);

  return { lettresFausses, presenter, relireLaDictee, reecouterLeMot, taper, effacer, jeNeSaisPas };
}
