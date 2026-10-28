import { type MutableRefObject, useCallback, useState } from "react";
import { type FaitDeSeance, Reponse, type Seance } from "@domain/apprentissage";
import {
  type Humeur,
  paroleApresUneBonneReponse,
  type PersonnageGuide,
  reagirAJeNeSaisPas,
  reagirALaReponse,
} from "@domain/motivation";
import type { EffetSonore } from "@domain/voix";
import { hasardDuNavigateur } from "../../hasard-navigateur.ts";
import { effetsApresUneBonneReponse, type SignalerUnRetour } from "../../retours/index.ts";
import type { Voix } from "../../voix/index.ts";
import type { ParoleADire } from "../usePersonnageQuiParle.ts";
import { paroleDueDeMotivation } from "./paroleDueDeMotivation.ts";
import type { QuestionFigee } from "./useQuestionFigee.ts";

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

const CLE_DE_L_ORDRE = "";

type SuiteDuPlacement = (numero: number, faits: FaitDeSeance[]) => Promise<void>;

/** Le déroulé des exercices à étiquettes (classer, ordre) : une étiquette posée est corrigée, puis le personnage guide réagit. */
export function useEtiquettesAPlacer(
  { seance, personnageGuide, dire, jouer, signaler, faireSilence, montrerHumeur, sequence, vivant, redessiner, reussite }: Dependances,
) {
  const { estFigee, figer, annoncerLAvancement, attendreLEcranSuivant } = reussite;
  /** Ce que « Je ne sais pas » a montré : la bonne réponse de chaque étiquette de classer, ou de la question en cours en ordre (clé vide). */
  const [bonnesReponsesMontrees, setBonnesReponsesMontrees] = useState<Readonly<Record<string, string>>>({});

  const oublierLaBonneReponse = useCallback((etiquette: string) => {
    setBonnesReponsesMontrees((montrees) =>
      Object.fromEntries(Object.entries(montrees).filter(([cle]) => cle !== etiquette && cle !== CLE_DE_L_ORDRE))
    );
  }, []);

  const encourager = useCallback(async () => {
    const reaction = reagirALaReponse(false, personnageGuide, hasardDuNavigateur);
    const aide = seance.aideApresLaDerniereErreur();
    const texte = aide === undefined ? reaction.parole.texte : `${reaction.parole.texte} ${aide}`;
    await dire({ texte, nature: "encouragement", humeur: reaction.humeur, effetsAvant: [reaction.effetSonore] });
  }, [seance, personnageGuide, dire]);

  /** Une bonne étiquette fait applaudir le personnage guide ; il ne parle que si le domaine le demande. */
  const feliciterOuRelancer = useCallback(async (effets: readonly EffetSonore[]) => {
    const { humeur } = reagirALaReponse(true, personnageGuide, hasardDuNavigateur);
    const texte = paroleApresUneBonneReponse(
      paroleDueDeMotivation(seance.paroleDueApresLaDerniereReponse()),
      personnageGuide,
      hasardDuNavigateur,
    );
    if (texte !== undefined) await dire({ texte, nature: "felicitation", humeur, effetsAvant: effets });
    else {
      faireSilence();
      montrerHumeur(humeur);
      void jouer(effets);
    }
  }, [seance, personnageGuide, dire, faireSilence, montrerHumeur, jouer]);

  const placer = useCallback(async (etiquette: string, groupe: string | undefined, suite: SuiteDuPlacement) => {
    const exercice = seance.exerciceEnCours();
    if (!exercice || estFigee.current) return;
    const questionsReussiesAvant = seance.avancement().questionsReussies;
    const resultat = seance.repondre(Reponse.placement(etiquette, groupe));
    sequence.current++;
    redessiner();
    if (resultat === "fausse") {
      signaler("fausse", etiquette);
      await encourager();
      return;
    }
    oublierLaBonneReponse(etiquette);
    const exerciceFini = exercice.estReussi();
    if (exerciceFini) figer({ position: exercice.position, exercice, question: undefined });
    annoncerLAvancement(seance.avancement());
    signaler("juste", etiquette, seance.exerciceCompleteParLaDerniereReponse());
    await feliciterOuRelancer(effetsApresUneBonneReponse(seance, questionsReussiesAvant));
    if (!exerciceFini) return;
    if (!(await attendreLEcranSuivant()) || !vivant.current) return;
    figer(undefined);
    await suite(++sequence.current, seance.retirerFaits());
  }, [seance, estFigee, sequence, redessiner, signaler, encourager, figer, annoncerLAvancement, feliciterOuRelancer, vivant, oublierLaBonneReponse, attendreLEcranSuivant]);

  const jeNeSaisPas = useCallback(async (etiquette?: string) => {
    if (!seance.exerciceEnCours() || estFigee.current) return;
    const cle = etiquette ?? CLE_DE_L_ORDRE;
    if (cle in bonnesReponsesMontrees) return;
    const { aide, bonneReponse } = seance.direJeNeSaisPas(etiquette);
    setBonnesReponsesMontrees({ ...bonnesReponsesMontrees, [cle]: bonneReponse });
    sequence.current++;
    faireSilence();
    redessiner();
    const reaction = reagirAJeNeSaisPas(aide);
    await dire({ texte: reaction.parole, nature: "aide", humeur: reaction.humeur });
  }, [seance, estFigee, bonnesReponsesMontrees, sequence, faireSilence, redessiner, dire]);

  return { placer, jeNeSaisPas, bonnesReponsesMontrees };
}
