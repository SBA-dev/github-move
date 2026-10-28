import { type MutableRefObject, useCallback, useRef, useState } from "react";
import { type CorrectionDuMot, type FaitDeSeance, type QuestionDeDictee, type Seance } from "@domain/apprentissage";
import { type PersonnageGuide, paroleApresUneBonneReponse, reagirAJeNeSaisPasEnDictee, reagirALaReponse } from "@domain/motivation";
import { hasardDuNavigateur } from "../../hasard-navigateur.ts";
import { CIBLE_DE_LA_ZONE_DE_REPONSE, effetsApresUneBonneReponse, type SignalerUnRetour } from "../../retours/index.ts";
import type { Voix } from "../../voix/index.ts";
import type { ParoleADire } from "../usePersonnageQuiParle.ts";
import { attendre } from "./attendre.ts";
import { paroleDueDeMotivation } from "./paroleDueDeMotivation.ts";
import type { QuestionFigee } from "./useQuestionFigee.ts";

const DUREE_DES_LETTRES_FAUSSES_MS = 1300;

type Dependances = {
  readonly seance: Seance;
  readonly personnageGuide: PersonnageGuide;
  readonly lire: Voix["lire"];
  readonly dire: (parole: ParoleADire) => Promise<boolean>;
  readonly signaler: SignalerUnRetour;
  readonly faireSilence: () => void;
  readonly sequence: MutableRefObject<number>;
  readonly vivant: MutableRefObject<boolean>;
  readonly redessiner: () => void;
  readonly reussite: QuestionFigee;
};

type SuiteDeLaDictee = (numero: number, faits: FaitDeSeance[], nouvelExercice: boolean) => Promise<void>;

/** Le déroulé d'une dictée : le mot est dit, les lettres s'écrivent case par case, la dernière case corrige. */
export function useDictee(
  { seance, personnageGuide, lire, dire, signaler, faireSilence, sequence, vivant, redessiner, reussite }: Dependances,
) {
  const { estFigee, figer, annoncerLAvancement, attendreLEcranSuivant } = reussite;
  /** Les lettres fausses restent en rouge un instant : pendant ce temps, rien ne s'écrit. */
  const [lettresFausses, setLettresFausses] = useState<CorrectionDuMot | undefined>();
  const lettresFaussesMontrees = useRef(false);
  /** « Je ne sais pas » à la dernière case : la touche à taper brille, la lettre n'est pas écrite. */
  const [toucheQuiBrille, setToucheQuiBrille] = useState<string | undefined>();

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

  const reecouterLeMot = useCallback(async (lent = false) => {
    const question = laQuestion();
    if (!question || estFigee.current) return;
    sequence.current++;
    faireSilence();
    await lire(question.motADire(), { lent });
  }, [laQuestion, estFigee, sequence, faireSilence, lire]);

  const reecouterLeMotPlusLentement = useCallback(() => reecouterLeMot(true), [reecouterLeMot]);

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
    if (await dire({ texte, nature: "encouragement", humeur: reaction.humeur, effetsAvant: [reaction.effetSonore] })) await lire(question.motADire());
  }, [seance, personnageGuide, dire, lire]);

  const feliciter = useCallback(async (questionsReussiesAvant: number) => {
    const { humeur } = reagirALaReponse(true, personnageGuide, hasardDuNavigateur);
    const felicitation = paroleApresUneBonneReponse(
      paroleDueDeMotivation(seance.paroleDueApresLaDerniereReponse()),
      personnageGuide,
      hasardDuNavigateur,
    );
    const suite = seance.suiteDeLaFelicitation();
    const texte = [felicitation, suite].filter((morceau) => morceau !== undefined).join(" ");
    await dire({ texte, nature: "felicitation", humeur, effetsAvant: effetsApresUneBonneReponse(seance, questionsReussiesAvant) });
  }, [seance, personnageGuide, dire]);

  const taper = useCallback(async (lettre: string, suite: SuiteDeLaDictee) => {
    const exercice = seance.exerciceEnCours();
    const question = laQuestion();
    const minuscule = lettre.toLowerCase();
    if (!exercice || !question || !peutEcrire()) return;
    if (!question.rangeesDuClavier().flat().some((touche) => touche.lettre === minuscule && touche.disponible)) return;
    const questionsReussiesAvant = seance.avancement().questionsReussies;
    const resultat = seance.taper(minuscule);
    setToucheQuiBrille(undefined);
    redessiner();
    if (resultat === undefined) return;
    sequence.current++;
    if (resultat === "fausse") {
      const correction = seance.derniereCorrection();
      if (correction) montrerLesLettresFausses(correction);
      signaler("fausse", CIBLE_DE_LA_ZONE_DE_REPONSE);
      return await encourager(question);
    }
    figer({ position: exercice.position, exercice, question: undefined, questionDeDictee: question });
    annoncerLAvancement(seance.avancement());
    signaler("juste", CIBLE_DE_LA_ZONE_DE_REPONSE);
    await feliciter(questionsReussiesAvant);
    if (!(await attendreLEcranSuivant()) || !vivant.current) return;
    figer(undefined);
    const nouvelExercice = seance.exerciceEnCours()?.position !== exercice.position;
    await suite(++sequence.current, seance.retirerFaits(), nouvelExercice);
  }, [seance, laQuestion, peutEcrire, redessiner, sequence, montrerLesLettresFausses, signaler, encourager, figer, annoncerLAvancement, feliciter, vivant, attendreLEcranSuivant]);

  const effacer = useCallback(() => {
    if (!peutEcrire()) return;
    if (!laQuestion()?.peutEffacer()) return;
    seance.effacer();
    setToucheQuiBrille(undefined);
    redessiner();
  }, [seance, laQuestion, peutEcrire, redessiner]);

  const jeNeSaisPas = useCallback(async () => {
    const question = laQuestion();
    if (!question || !peutEcrire() || question.bonneReponseMontree) return;
    const { maniere, bonneReponse } = seance.direJeNeSaisPas();
    if (maniere === "briller") setToucheQuiBrille(bonneReponse);
    sequence.current++;
    faireSilence();
    redessiner();
    const reaction = reagirAJeNeSaisPasEnDictee(maniere);
    await dire({ texte: reaction.parole, nature: "aide", humeur: reaction.humeur });
  }, [seance, laQuestion, peutEcrire, sequence, faireSilence, redessiner, dire]);

  return { lettresFausses, toucheQuiBrille, presenter, relireLaDictee, reecouterLeMot, reecouterLeMotPlusLentement, taper, effacer, jeNeSaisPas };
}
