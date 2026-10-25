import { type MutableRefObject, useCallback, useState } from "react";
import { type ExerciceJoue, JeNeSaisPasDejaDit, Reponse, type Seance, type VueAddition, type VueColonne } from "@domain/apprentissage";
import { type Humeur, humeurApresReponse, type PersonnageGuide, reagirAJeNeSaisPas } from "@domain/motivation";
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
  { seance, personnageGuide, dire, faireSilence, montrerHumeur, sequence, vivant, redessiner, reussite }: Dependances,
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

  const direLaSuite = useCallback(async (avant: VueAddition, apres: VueAddition) => {
    const maintenant = seance.additionEnCours();
    if (apres.parole !== undefined && !(await dire(direLaRetenue(apres.parole)))) return;
    if (!maintenant) return;
    if (maintenant.etape === "calculer" && maintenant.calcul) {
      await dire({ texte: maintenant.calcul.phrase, nature: "question" });
    } else if (maintenant.invite !== undefined && maintenant.nombreAPoser !== avant.nombreAPoser) {
      await dire({ texte: maintenant.invite, nature: "question" });
    } else if (apres.parole === undefined) montrerHumeur(humeurApresReponse(true));
  }, [seance, dire, montrerHumeur]);

  const feliciterLAdditionFinie = useCallback(async (exercice: ExerciceJoue, apres: VueAddition, suite: SuiteDuCalcul) => {
    figer({ position: exercice.position, exercice, question: undefined });
    setAdditionFigee(apres);
    await dire(feliciterUnCalcul(personnageGuide, apres.parole));
    await attendreLEcranSuivant();
    if (!vivant.current) return;
    figer(undefined);
    setAdditionFigee(undefined);
    const nouvelExercice = seance.exerciceEnCours()?.position !== exercice.position;
    await suite(++sequence.current, seance.retirerFaits(), nouvelExercice);
  }, [seance, figer, dire, personnageGuide, vivant, sequence, attendreLEcranSuivant]);

  const repondre = useCallback(async (reponse: Reponse, suite: SuiteDuCalcul) => {
    const avant = seance.additionEnCours();
    const exercice = seance.exerciceEnCours();
    if (!avant || !exercice || estFigee.current) return;
    const resultat = seance.repondre(reponse);
    if (resultat === "dejaEcartee") return;
    sequence.current++;
    setColonneQuiBrille(undefined);
    redessiner();
    if (resultat === "fausse") {
      await dire(encouragerApresUneErreurDeCalcul(personnageGuide, seance.aideApresLaDerniereErreur()));
      return;
    }
    const apres = seance.additionApresLaDerniereReponse();
    if (!apres) return;
    annoncerLAvancement(seance.avancement());
    if (estFinie(apres)) await feliciterLAdditionFinie(exercice, apres, suite);
    else await direLaSuite(avant, apres);
  }, [seance, estFigee, sequence, redessiner, dire, personnageGuide, annoncerLAvancement, feliciterLAdditionFinie, direLaSuite]);

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
