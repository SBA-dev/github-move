import { type MutableRefObject, useCallback, useState } from "react";
import { type ExerciceJoue, JeNeSaisPasDejaDit, Reponse, type Seance, type VueAddition, type VueColonne } from "@domain/apprentissage";
import { type Humeur, humeurApresReponse, type PersonnageGuide, reagirAJeNeSaisPas } from "@domain/motivation";
import type { EffetSonore } from "@domain/voix";
import {
  CIBLE_DES_COLONNES,
  cibleDeLaReponse,
  effetsApresUneBonneReponse,
  type SignalerUnRetour,
} from "../../../retours/index.ts";
import type { Voix } from "../../../voix/index.ts";
import type { ParoleADire } from "../../usePersonnageQuiParle.ts";
import {
  aiderQuandOnNeSaitPas,
  encouragerApresUneErreurDeCalcul,
  feliciterUnCalcul,
} from "../paroles-du-calcul.ts";
import type { SuiteDuCalcul } from "../useCalcul.ts";
import type { QuestionFigee } from "../useQuestionFigee.ts";

type Dependances = {
  readonly seance: Seance;
  readonly personnageGuide: PersonnageGuide;
  readonly dire: (parole: ParoleADire) => Promise<boolean>;
  readonly jouer: Voix["jouer"];
  readonly signaler: SignalerUnRetour;
  readonly faireSilence: () => void;
  readonly montrerHumeur: (humeur: Humeur) => void;
  readonly sequence: MutableRefObject<number>;
  readonly vivant: MutableRefObject<boolean>;
  readonly redessiner: () => void;
  readonly reussite: QuestionFigee;
};

type Rang = VueColonne["rang"];

function direLaRetenue(parole: string): ParoleADire {
  return { texte: parole, nature: "felicitation", humeur: humeurApresReponse(true) };
}

function estFinie(vue: VueAddition | undefined): boolean {
  return vue !== undefined && vue.etape === "calculer" && vue.colonneEnCours === undefined;
}

/** Le déroulé d'une addition posée : on pose chaque chiffre dans sa colonne, puis on calcule de la droite vers la gauche. */
export function useAdditionPosee(
  { seance, personnageGuide, dire, jouer, signaler, faireSilence, montrerHumeur, sequence, vivant, redessiner, reussite }: Dependances,
) {
  const { estFigee, figer, annoncerLAvancement, attendreLEcranSuivant } = reussite;
  /** L'addition terminée, montrée telle quelle le temps de la féliciter. */
  const [additionFigee, setAdditionFigee] = useState<VueAddition | undefined>();
  /** La colonne que « Je ne sais pas » fait briller. */
  const [colonneQuiBrille, setColonneQuiBrille] = useState<Rang | undefined>();

  const presenter = useCallback(async () => {
    const vue = seance.additionEnCours();
    if (!vue) return;
    if (vue.etape === "poser") {
      if (vue.consigne !== undefined && !(await dire({ texte: vue.consigne, nature: "consigne" }))) return;
      if (vue.invite !== undefined) await dire({ texte: vue.invite, nature: "question" });
    } else if (vue.calcul) await dire({ texte: vue.calcul.phrase, nature: "question" });
  }, [seance, dire]);

  /** Les effets sonores précèdent la première parole de la suite ; sans parole, ils sont joués seuls. */
  const direLaSuite = useCallback(async (avant: VueAddition, apres: VueAddition, effets: readonly EffetSonore[]) => {
    const maintenant = seance.additionEnCours();
    let effetsAvant: readonly EffetSonore[] | undefined = effets;
    const direAvecLesEffets = (parole: ParoleADire) => {
      const aDire = effetsAvant === undefined ? parole : { ...parole, effetsAvant };
      effetsAvant = undefined;
      return dire(aDire);
    };
    if (apres.parole !== undefined && !(await direAvecLesEffets(direLaRetenue(apres.parole)))) return;
    if (maintenant?.etape === "calculer" && maintenant.calcul) {
      await direAvecLesEffets({ texte: maintenant.calcul.phrase, nature: "question" });
    } else if (maintenant?.invite !== undefined && maintenant.nombreAPoser !== avant.nombreAPoser) {
      await direAvecLesEffets({ texte: maintenant.invite, nature: "question" });
    } else if (maintenant && apres.parole === undefined) montrerHumeur(humeurApresReponse(true));
    if (effetsAvant !== undefined) void jouer(effetsAvant);
  }, [seance, dire, jouer, montrerHumeur]);

  const feliciterLAdditionFinie = useCallback(async (
    exercice: ExerciceJoue,
    apres: VueAddition,
    suite: SuiteDuCalcul,
    effets: readonly EffetSonore[],
  ) => {
    figer({ position: exercice.position, exercice, question: undefined });
    setAdditionFigee(apres);
    await dire(feliciterUnCalcul(personnageGuide, apres.parole, effets));
    if (!(await attendreLEcranSuivant()) || !vivant.current) return;
    figer(undefined);
    setAdditionFigee(undefined);
    const nouvelExercice = seance.exerciceEnCours()?.position !== exercice.position;
    await suite(++sequence.current, seance.retirerFaits(), nouvelExercice);
  }, [seance, figer, dire, personnageGuide, vivant, sequence, attendreLEcranSuivant]);

  const repondre = useCallback(async (reponse: Reponse, suite: SuiteDuCalcul) => {
    const avant = seance.additionEnCours();
    const exercice = seance.exerciceEnCours();
    if (!avant || !exercice || estFigee.current) return;
    const questionsReussiesAvant = seance.avancement().questionsReussies;
    const resultat = seance.repondre(reponse);
    if (resultat === "dejaEcartee") return;
    sequence.current++;
    setColonneQuiBrille(undefined);
    redessiner();
    const cible = reponse.genre === "placement" ? CIBLE_DES_COLONNES : cibleDeLaReponse(reponse);
    if (resultat === "fausse") {
      signaler("fausse", cible);
      await dire(encouragerApresUneErreurDeCalcul(personnageGuide, seance.aideApresLaDerniereErreur()));
      return;
    }
    const apres = seance.additionApresLaDerniereReponse();
    if (!apres) return;
    annoncerLAvancement(seance.avancement());
    signaler("juste", cible);
    const effets = effetsApresUneBonneReponse(seance, questionsReussiesAvant);
    if (estFinie(apres)) await feliciterLAdditionFinie(exercice, apres, suite, effets);
    else await direLaSuite(avant, apres, effets);
  }, [seance, estFigee, sequence, redessiner, dire, signaler, personnageGuide, annoncerLAvancement, feliciterLAdditionFinie, direLaSuite]);

  const placer = useCallback(
    (chiffre: string, rang: Rang, suite: SuiteDuCalcul) => repondre(Reponse.placement(chiffre, rang), suite),
    [repondre],
  );

  const jeNeSaisPas = useCallback(async (chiffre?: string) => {
    const vue = seance.additionEnCours();
    if (!vue || estFigee.current) return;
    try {
      const { aide, bonneReponse } = seance.direJeNeSaisPas(chiffre);
      sequence.current++;
      faireSilence();
      redessiner();
      if (vue.etape === "poser") {
        setColonneQuiBrille(vue.colonnes.find(({ rang }) => rang === bonneReponse)?.rang);
        const { humeur, parole } = reagirAJeNeSaisPas(aide);
        await dire({ texte: parole, nature: "aide", humeur });
      } else if (vue.calcul) await dire(aiderQuandOnNeSaitPas(vue.calcul, aide, bonneReponse));
    } catch (erreur) {
      if (!(erreur instanceof JeNeSaisPasDejaDit)) throw erreur;
    }
  }, [seance, estFigee, sequence, faireSilence, redessiner, dire]);

  return { additionFigee, colonneQuiBrille, presenter, repondre, placer, jeNeSaisPas };
}
