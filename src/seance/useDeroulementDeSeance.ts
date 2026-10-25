import { useCallback, useReducer, useRef } from "react";
import {
  consigneLueAuDebut,
  type FaitDeSeance,
  indicationDuGeste,
  Reponse,
  type Seance,
  texteALireDeLEtape,
} from "@domain/apprentissage";
import type { EtapeDeLecon, Lecon } from "@domain/catalogue";
import {
  annoncerExerciceSuivant,
  finDePhraseDuPersonnageGuide,
  inviterAJouerApresLesEtapes,
  type ObjetDeLaCabane,
  type PersonnageGuide,
  parolesDeFinDeSeance,
} from "@domain/motivation";
import { useReducedMotion } from "motion/react";
import { hasardDuNavigateur } from "../hasard-navigateur.ts";
import type { Voix } from "../voix/index.ts";
import { useAdditionPosee } from "./exercices/addition/useAdditionPosee.ts";
import { useBattementDeLaFluence, useFluence } from "./exercices/fluence/useFluence.ts";
import { type SuiteDuCalcul, useCalcul } from "./exercices/useCalcul.ts";
import { seJoueCommeUneQuestionIllustree, useQuestionIllustree } from "./exercices/useQuestionIllustree.ts";
import { useDictee } from "./exercices/useDictee.ts";
import { useEtiquettesAPlacer } from "./exercices/useEtiquettesAPlacer.ts";
import { useMemorisation } from "./exercices/useMemorisation.ts";
import { useQuestionFigee } from "./exercices/useQuestionFigee.ts";
import { useQuestionsAChoix } from "./exercices/useQuestionsAChoix.ts";
import { type Horloge, horlogeDuNavigateur } from "./horloge.ts";
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
  horloge: Horloge = horlogeDuNavigateur,
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
  const dependancesDuCalcul = { seance, personnageGuide, dire, faireSilence, sequence, vivant, redessiner, reussite };
  const calcul = useCalcul(dependancesDuCalcul);
  const illustree = useQuestionIllustree(dependancesDuCalcul);
  const fluence = useFluence({ seance, horloge, dire, faireSilence, sequence, vivant, redessiner, reussite });
  const addition = useAdditionPosee({ ...dependancesDuCalcul, montrerHumeur });
  const memorisation = useMemorisation({
    seance,
    lecon,
    lire: voix.lire,
    dire,
    sequence,
    redessiner,
    presenterUneQuestion: ouvrir,
  });

  const lireLaConsigneDeLExercice = useCallback(async () => {
    const position = seance.exerciceEnCours()?.position;
    const exercice = position === undefined ? undefined : lecon.exercices[position];
    if (!exercice?.consigne || !consigneLueAuDebut(exercice.type)) return;
    if (!(await dire({ texte: exercice.consigne, nature: "consigne" }))) return;
    const indication = indicationDuGeste(exercice.type);
    if (indication) await dire({ texte: indication, nature: "consigne" });
  }, [seance, lecon, dire]);

  const presenterLaQuestionDeLExercice = useCallback(async (numero: number) => {
    const position = seance.exerciceEnCours()?.position;
    switch (position === undefined ? undefined : lecon.exercices[position]?.type) {
      case "calcul":
        return await calcul.presenter();
      case "boite":
      case "barres":
        return await illustree.presenter();
      case "fluence":
        return await fluence.presenter();
      case "addition":
        return await addition.presenter();
      case "dictee":
        return await presenterLaDictee();
      case "memoriser":
        return await memorisation.presenter(numero);
      default:
        return await ouvrir(numero);
    }
  }, [
    seance,
    lecon,
    calcul.presenter,
    illustree.presenter,
    fluence.presenter,
    addition.presenter,
    presenterLaDictee,
    memorisation.presenter,
    ouvrir,
  ]);

  const ouvrirLExercice = useCallback(async (numero: number) => {
    await lireLaConsigneDeLExercice();
    if (numero === sequence.current) await presenterLaQuestionDeLExercice(numero);
  }, [lireLaConsigneDeLExercice, presenterLaQuestionDeLExercice]);

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

  const suiteDeLaReponse: SuiteDuCalcul = useCallback(
    (numero, faits, nouvelExercice) =>
      faits.length > 0 || nouvelExercice ? enchainerSurLExercice(numero, faits) : presenterLaQuestionDeLExercice(numero),
    [enchainerSurLExercice, presenterLaQuestionDeLExercice],
  );

  const { repondre: repondreAuCalcul, jeNeSaisPas: jeNeSaisPasDuCalcul } = calcul;
  const {
    repondre: repondreAUneQuestionIllustree,
    jeNeSaisPas: jeNeSaisPasDUneQuestionIllustree,
    relireLaPresentation,
  } = illustree;
  const { repondre: repondreALaFluence, battre: battreLaFluence, demarrer: demarrerLaFluence } = fluence;
  const { repondre: repondreALAddition, placer: placerUnChiffre, jeNeSaisPas: jeNeSaisPasDeLAddition } = addition;
  const repondreParUnNombre = useCallback((nombre: number) => {
    const position = seance.exerciceEnCours()?.position;
    const type = position === undefined ? undefined : lecon.exercices[position]?.type;
    if (type === "fluence") return repondreALaFluence(nombre, suiteDeLaReponse);
    if (type === "addition") return repondreALAddition(Reponse.nombre(nombre), suiteDeLaReponse);
    if (seJoueCommeUneQuestionIllustree(type)) return repondreAUneQuestionIllustree(Reponse.nombre(nombre), suiteDeLaReponse);
    return repondreAuCalcul(Reponse.nombre(nombre), suiteDeLaReponse);
  }, [seance, lecon, repondreALaFluence, repondreALAddition, repondreAuCalcul, repondreAUneQuestionIllustree, suiteDeLaReponse]);

  const choisirUneReponseDeCalcul = useCallback((texte: string) => {
    const position = seance.exerciceEnCours()?.position;
    const type = position === undefined ? undefined : lecon.exercices[position]?.type;
    if (type === "addition") return repondreALAddition(Reponse.choix(texte), suiteDeLaReponse);
    if (seJoueCommeUneQuestionIllustree(type)) return repondreAUneQuestionIllustree(Reponse.choix(texte), suiteDeLaReponse);
    return repondreAuCalcul(Reponse.choix(texte), suiteDeLaReponse);
  }, [seance, lecon, repondreALAddition, repondreAuCalcul, repondreAUneQuestionIllustree, suiteDeLaReponse]);

  const jeNeSaisPasALaQuestion = useCallback(() => {
    const position = seance.exerciceEnCours()?.position;
    const type = position === undefined ? undefined : lecon.exercices[position]?.type;
    if (seJoueCommeUneQuestionIllustree(type)) return jeNeSaisPasDUneQuestionIllustree();
    return jeNeSaisPasDuCalcul();
  }, [seance, lecon, jeNeSaisPasDUneQuestionIllustree, jeNeSaisPasDuCalcul]);

  const poserUnChiffre = useCallback(
    (chiffre: string, rang: Parameters<typeof placerUnChiffre>[1]) => placerUnChiffre(chiffre, rang, suiteDeLaReponse),
    [placerUnChiffre, suiteDeLaReponse],
  );

  const relireLaPhrase = useCallback((phrase: string) => {
    if (reussite.estFigee.current) return;
    sequence.current++;
    void dire({ texte: phrase, nature: "question" });
  }, [reussite.estFigee, dire]);

  useBattementDeLaFluence(horloge, fluence.demarree, battreLaFluence, suiteDeLaReponse);

  const taper = useCallback(
    (lettre: string) => taperUneLettre(lettre, suiteDeLaReponse),
    [taperUneLettre, suiteDeLaReponse],
  );

  const { apresUnPlacement } = memorisation;
  const placer = useCallback(async (etiquette: string, groupe?: string) => {
    await placerUneEtiquette(etiquette, groupe, enchainerSurLExercice);
    await apresUnPlacement();
  }, [placerUneEtiquette, enchainerSurLExercice, apresUnPlacement]);

  const reecouter = useCallback(() => {
    if (reussite.figee) return;
    if (personnage.parole?.nature === "question" && (relireLaPresentation() || relireLaQuestion())) return;
    if (memorisation.reecouter()) return;
    sequence.current++;
    relire();
  }, [reussite.figee, personnage.parole, relireLaPresentation, relireLaQuestion, memorisation.reecouter, relire]);

  const direLaFin = useCallback((etoiles: number | undefined, objetRecu: ObjetDeLaCabane | undefined) => {
    sequence.current++;
    if (etoiles === undefined) return;
    const felicitation = parolesDeFinDeSeance(etoiles, prenom, personnageGuide, hasardDuNavigateur);
    const texte = objetRecu ? `${felicitation} ${finDePhraseDuPersonnageGuide(objetRecu)}` : felicitation;
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
    versLu: memorisation.versLu,
    tempsDeLaMemorisation: memorisation.tempsDe,
    jeSuisPret: memorisation.jeSuisPret,
    jeNeSaisPasEnDictee: dictee.jeNeSaisPas,
    taper,
    repondre,
    placer,
    reecouter,
    calculFige: calcul.calculFige,
    phrasesDitesDeLaQuestion: illustree.phrasesDites,
    boiteReussie: illustree.boiteReussie,
    schemaReussi: illustree.schemaReussi,
    additionFigee: addition.additionFigee,
    colonneQuiBrille: addition.colonneQuiBrille,
    fluenceFinie: fluence.fluenceFinie,
    repondreParUnNombre,
    choisirUneReponseDeCalcul,
    poserUnChiffre,
    jeNeSaisPasALaQuestion,
    jeNeSaisPasDeLAddition,
    demarrerLaFluence,
    relireLaPhrase,
    commencer,
    continuer,
    direLaFin,
    abandonner,
  };
}
