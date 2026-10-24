import { useCallback, useReducer, useRef } from "react";
import { consigneLueAuDebut, type FaitDeSeance, indicationDuGeste, type Seance, texteALireDeLEtape } from "@domain/apprentissage";
import type { EtapeDeLecon, Lecon } from "@domain/catalogue";
import {
  annoncerExerciceSuivant,
  inviterAJouerApresLesEtapes,
  type PersonnageGuide,
  parolesDeFinDeSeance,
} from "@domain/motivation";
import { useReducedMotion } from "motion/react";
import { hasardDuNavigateur } from "../hasard-navigateur.ts";
import type { Voix } from "../voix/index.ts";
import { useDictee } from "./exercices/useDictee.ts";
import { useEtiquettesAPlacer } from "./exercices/useEtiquettesAPlacer.ts";
import { useQuestionFigee } from "./exercices/useQuestionFigee.ts";
import { useQuestionsAChoix } from "./exercices/useQuestionsAChoix.ts";
import { type ParoleADire, usePersonnageQuiParle } from "./usePersonnageQuiParle.ts";

const PAUSE_ENTRE_DEUX_PAROLES_MS = 400;
const PAUSE_AVEC_MOUVEMENTS_REDUITS_MS = 150;

function paroleDeLEtape(etape: EtapeDeLecon): ParoleADire {
  return { texte: etape.texte, aLire: texteALireDeLEtape(etape).join(" "), nature: "etape" };
}

/**
 * Fait vivre une séance dans le navigateur : appelle le domaine, puis fait dire au personnage guide ce qu'il décide.
 * Chaque action repart d'une nouvelle « séquence » : une parole ou un abandon plus récent interrompt les suites en attente.
 */
export function useDeroulementDeSeance(
  seance: Seance,
  lecon: Lecon,
  voix: Pick<Voix, "lire" | "couperLaVoix">,
  personnageGuide: PersonnageGuide,
  toutLireAVoixHaute: boolean,
  prenom: string,
) {
  const personnage = usePersonnageQuiParle(voix);
  const { dire, faireSilence, montrerHumeur, reecouter: relire } = personnage;
  const [, redessiner] = useReducer((compteur: number) => compteur + 1, 0);
  const sequence = useRef(0);
  const vivant = useRef(true);
  const pause = useRef(PAUSE_ENTRE_DEUX_PAROLES_MS);
  pause.current = useReducedMotion() ? PAUSE_AVEC_MOUVEMENTS_REDUITS_MS : PAUSE_ENTRE_DEUX_PAROLES_MS;

  const attendreUnPeu = useCallback(
    () => new Promise<void>((fin) => setTimeout(fin, pause.current)),
    [],
  );

  const reussite = useQuestionFigee();
  const questions = useQuestionsAChoix({
    seance,
    lecon,
    personnageGuide,
    toutLireAVoixHaute,
    lire: voix.lire,
    dire,
    faireSilence,
    montrerHumeur,
    sequence,
    vivant,
    redessiner,
    reussite,
  });
  const dictee = useDictee({
    seance,
    personnageGuide,
    lire: voix.lire,
    dire,
    faireSilence,
    sequence,
    vivant,
    redessiner,
    reussite,
  });
  const { placer: placerUneEtiquette, jeNeSaisPas: jeNeSaisPasDUneEtiquette, bonnesReponsesMontrees } = useEtiquettesAPlacer({
    seance,
    personnageGuide,
    dire,
    faireSilence,
    montrerHumeur,
    sequence,
    vivant,
    redessiner,
    reussite,
  });
  const { presenter: presenterLaDictee, taper: taperUneLettre } = dictee;
  const { ouvrir, presenter, repondre: repondreALaQuestion, relireLaQuestion } = questions;

  const lireLaConsigneDeLExercice = useCallback(async () => {
    const position = seance.exerciceEnCours()?.position;
    const exercice = position === undefined ? undefined : lecon.exercices[position];
    if (!exercice?.consigne || !consigneLueAuDebut(exercice.type)) return;
    if (!(await dire({ texte: exercice.consigne, nature: "consigne" }))) return;
    const indication = indicationDuGeste(exercice.type);
    if (indication) await dire({ texte: indication, nature: "consigne" });
  }, [seance, lecon, dire]);

  const ouvrirLExercice = useCallback(async (numero: number) => {
    await lireLaConsigneDeLExercice();
    if (numero !== sequence.current) return;
    if (seance.questionDeDicteeEnCours()) await presenterLaDictee();
    else await ouvrir(numero);
  }, [lireLaConsigneDeLExercice, seance, presenterLaDictee, ouvrir]);

  const direLeFait = useCallback((fait: FaitDeSeance): Promise<boolean> => {
    if (fait.type === "EtapesDeLeconFinies") {
      const invitation = inviterAJouerApresLesEtapes(hasardDuNavigateur);
      return dire({ texte: invitation.texte, nature: "invitation", humeur: invitation.humeur });
    }
    return dire({ texte: annoncerExerciceSuivant(fait.titre, hasardDuNavigateur), nature: "annonce" });
  }, [dire]);

  const enchainerSurLExercice = useCallback(async (numero: number, faits: readonly FaitDeSeance[]) => {
    for (const fait of faits) {
      if (!(await direLeFait(fait))) return;
    }
    await attendreUnPeu();
    if (numero === sequence.current) await ouvrirLExercice(numero);
  }, [direLeFait, attendreUnPeu, ouvrirLExercice]);

  const commencer = useCallback(async () => {
    vivant.current = true;
    const numero = ++sequence.current;
    const etape = seance.etapeDeLeconEnCours();
    if (etape) await dire(paroleDeLEtape(etape));
    else await ouvrirLExercice(numero);
  }, [seance, dire, ouvrirLExercice]);

  const continuer = useCallback(async () => {
    const numero = ++sequence.current;
    seance.continuer();
    redessiner();
    const etape = seance.etapeDeLeconEnCours();
    if (etape) await dire(paroleDeLEtape(etape));
    else await enchainerSurLExercice(numero, seance.retirerFaits());
  }, [seance, dire, enchainerSurLExercice]);

  const repondre = useCallback(
    (texte: string) =>
      repondreALaQuestion(texte, (numero, faits, nouvelExercice) =>
        faits.length > 0 || nouvelExercice ? enchainerSurLExercice(numero, faits) : presenter(numero)),
    [repondreALaQuestion, enchainerSurLExercice, presenter],
  );

  const taper = useCallback(
    (lettre: string) =>
      taperUneLettre(lettre, (numero, faits, nouvelExercice) =>
        faits.length > 0 || nouvelExercice ? enchainerSurLExercice(numero, faits) : presenterLaDictee()),
    [taperUneLettre, enchainerSurLExercice, presenterLaDictee],
  );

  const placer = useCallback(
    (etiquette: string, groupe?: string) => placerUneEtiquette(etiquette, groupe, enchainerSurLExercice),
    [placerUneEtiquette, enchainerSurLExercice],
  );

  const reecouter = useCallback(() => {
    if (reussite.figee) return;
    if (personnage.parole?.nature === "question" && relireLaQuestion()) return;
    sequence.current++;
    relire();
  }, [reussite.figee, personnage.parole, relireLaQuestion, relire]);

  const direLaFin = useCallback((etoiles: number) => {
    sequence.current++;
    const texte = parolesDeFinDeSeance(etoiles, prenom, personnageGuide, hasardDuNavigateur);
    void dire({ texte, nature: "felicitation", humeur: "applaudit" });
  }, [dire, prenom, personnageGuide]);

  const abandonner = useCallback(() => {
    vivant.current = false;
    sequence.current++;
    faireSilence();
  }, [faireSilence]);

  const { parole, rangDuMotPrononce, humeur } = personnage;
  const { figee, avancementAnnonce } = reussite;
  const {
    choixVisiblesPour,
    positionDuTexteEcoute,
    rangDuMotDuTexte,
    bulleEclatee,
    jAiEcoute,
    ecouterLeMot,
    jeNeSaisPas,
  } = questions;
  return {
    parole,
    rangDuMotPrononce,
    humeur,
    figee,
    choixVisiblesPour,
    positionDuTexteEcoute,
    rangDuMotDuTexte,
    bulleEclatee,
    avancementAnnonce,
    jAiEcoute,
    relireLaQuestion,
    ecouterLeMot,
    jeNeSaisPas,
    jeNeSaisPasDUneEtiquette,
    bonnesReponsesMontrees,
    lettresFausses: dictee.lettresFausses,
    toucheQuiBrille: dictee.toucheQuiBrille,
    relireLaDictee: dictee.relireLaDictee,
    reecouterLeMot: dictee.reecouterLeMot,
    reecouterLeMotPlusLentement: dictee.reecouterLeMotPlusLentement,
    effacer: dictee.effacer,
    jeNeSaisPasEnDictee: dictee.jeNeSaisPas,
    taper,
    repondre,
    placer,
    reecouter,
    commencer,
    continuer,
    direLaFin,
    abandonner,
  };
}
