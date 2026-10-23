import { useCallback, useReducer, useRef } from "react";
import { type FaitDeSeance, type Seance, texteALireDeLEtape } from "@domain/apprentissage";
import type { EtapeDeLecon, Lecon } from "@domain/catalogue";
import { annoncerExerciceSuivant, inviterAJouerApresLesEtapes, type PersonnageGuide } from "@domain/motivation";
import { useReducedMotion } from "motion/react";
import { hasardDuNavigateur } from "../hasard-navigateur.ts";
import type { Voix } from "../voix/index.ts";
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
) {
  const personnage = usePersonnageQuiParle(voix);
  const { dire, faireSilence, reecouter: relire } = personnage;
  const [, redessiner] = useReducer((compteur: number) => compteur + 1, 0);
  const sequence = useRef(0);
  const vivant = useRef(true);
  const pause = useRef(PAUSE_ENTRE_DEUX_PAROLES_MS);
  pause.current = useReducedMotion() ? PAUSE_AVEC_MOUVEMENTS_REDUITS_MS : PAUSE_ENTRE_DEUX_PAROLES_MS;

  const attendreUnPeu = useCallback(
    () => new Promise<void>((fin) => setTimeout(fin, pause.current)),
    [],
  );

  const questions = useQuestionsAChoix({
    seance,
    lecon,
    personnageGuide,
    lire: voix.lire,
    dire,
    faireSilence,
    sequence,
    vivant,
    redessiner,
  });
  const { ouvrir, presenter, repondre: repondreALaQuestion, relireLaQuestion } = questions;

  const lireLaConsigneDeLExercice = useCallback(async () => {
    const position = seance.exerciceEnCours()?.position;
    const consigne = position === undefined ? undefined : lecon.exercices[position]?.consigne;
    if (consigne) await dire({ texte: consigne, nature: "consigne" });
  }, [seance, lecon, dire]);

  const ouvrirLExercice = useCallback(async (numero: number) => {
    await lireLaConsigneDeLExercice();
    if (numero === sequence.current) await ouvrir(numero);
  }, [lireLaConsigneDeLExercice, ouvrir]);

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

  const reecouter = useCallback(() => {
    if (questions.figee) return;
    if (personnage.parole?.nature === "question" && relireLaQuestion()) return;
    sequence.current++;
    relire();
  }, [questions.figee, personnage.parole, relireLaQuestion, relire]);

  const abandonner = useCallback(() => {
    vivant.current = false;
    sequence.current++;
    faireSilence();
  }, [faireSilence]);

  const { parole, rangDuMotPrononce, humeur } = personnage;
  const {
    figee,
    choixVisiblesPour,
    positionDuTexteEcoute,
    rangDuMotDuTexte,
    bulleEclatee,
    avancementAnnonce,
    jAiEcoute,
    ecouterLeMot,
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
    repondre,
    reecouter,
    commencer,
    continuer,
    abandonner,
  };
}
