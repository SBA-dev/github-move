import { useCallback, useReducer, useRef, useState } from "react";
import {
  consigneAffichee,
  type FaitDeSeance,
  indicationDuGeste,
  Reponse,
  type Seance,
  texteALireDeLEtape,
} from "@domain/apprentissage";
import type { EtapeDeLecon, Lecon } from "@domain/catalogue";
import type { EffetSonore } from "@domain/voix";
import {
  annoncerExerciceSuivant,
  inviterAJouerApresLesEtapes,
  type PersonnageGuide,
  parolesDeFinDeSeance,
  phraseDeFinAvecLaQuete,
  phraseDeFinAvecLesNouveautes,
} from "@domain/motivation";
import { effetsDeLaFinDeSeance } from "./fin-de-seance/effets-de-la-fin.ts";
import type { NouveautesDeFin } from "./fin-de-seance/nouveautes-de-fin.ts";
import { useReducedMotion } from "motion/react";
import { hasardDuNavigateur } from "../hasard-navigateur.ts";
import { useRetourDeLaReponse } from "../retours/index.ts";
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
  voix: Pick<Voix, "lire" | "jouer" | "couperLaVoix">,
  personnageGuide: PersonnageGuide,
  toutLireAVoixHaute: boolean,
  prenom: string,
  horloge: Horloge = horlogeDuNavigateur,
) {
  const personnage = usePersonnageQuiParle(voix);
  const { dire, jouer, faireSilence, montrerHumeur, reecouter: relire } = personnage;
  const { retour, signaler } = useRetourDeLaReponse();
  const [, redessiner] = useReducer((compteur: number) => compteur + 1, 0);
  const sequence = useRef(0);
  const vivant = useRef(true);
  /** Numéro de la séquence qui présente l'exercice ; tout geste de l'enfant ouvre une nouvelle séquence et met donc fin à la présentation. */
  const presentation = useRef<number | undefined>(undefined);
  const [presentationAffichee, setPresentationAffichee] = useState(false);
  const pause = useRef(PAUSE_ENTRE_DEUX_PAROLES_MS);
  pause.current = useReducedMotion() ? PAUSE_AVEC_MOUVEMENTS_REDUITS_MS : PAUSE_ENTRE_DEUX_PAROLES_MS;

  const attendreUnPeu = useCallback(
    () => new Promise<void>((fin) => setTimeout(fin, pause.current)),
    [],
  );

  const reussite = useQuestionFigee(seance, personnage.paroleEntendue);
  const questions = useQuestionsAChoix({
    seance,
    lecon,
    personnageGuide,
    toutLireAVoixHaute,
    lire: voix.lire,
    dire,
    jouer,
    signaler,
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
    signaler,
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
    jouer,
    signaler,
    faireSilence,
    montrerHumeur,
    sequence,
    vivant,
    redessiner,
    reussite,
  });
  const { presenter: presenterLaDictee, taper: taperUneLettre } = dictee;
  const { ouvrir, presenter, repondre: repondreALaQuestion, relireLaQuestion } = questions;
  const dependancesDuCalcul = { seance, personnageGuide, dire, signaler, faireSilence, sequence, vivant, redessiner, reussite };
  const calcul = useCalcul(dependancesDuCalcul);
  const illustree = useQuestionIllustree(dependancesDuCalcul);
  const fluence = useFluence({ seance, personnageGuide, horloge, dire, jouer, signaler, faireSilence, sequence, vivant, redessiner, reussite });
  const addition = useAdditionPosee({ ...dependancesDuCalcul, jouer, montrerHumeur });
  const memorisation = useMemorisation({
    seance,
    lecon,
    lire: voix.lire,
    dire,
    sequence,
    redessiner,
    presenterUneQuestion: ouvrir,
  });

  const consigneDeLExercice = useCallback(() => {
    const position = seance.exerciceEnCours()?.position;
    const exercice = position === undefined ? undefined : lecon.exercices[position];
    return exercice && consigneAffichee(exercice);
  }, [seance, lecon]);

  const lireLaConsigneDeLExercice = useCallback(async () => {
    const position = seance.exerciceEnCours()?.position;
    const exercice = position === undefined ? undefined : lecon.exercices[position];
    const consigne = consigneDeLExercice();
    if (!exercice || consigne === undefined) return;
    if (!(await dire({ texte: consigne, nature: "consigne" }))) return;
    const indication = indicationDuGeste(exercice.type);
    if (indication) await dire({ texte: indication, nature: "consigne" });
  }, [seance, lecon, dire, consigneDeLExercice]);

  const presentationEnCours = useCallback(() => presentation.current === sequence.current, []);

  const commencerLaPresentation = useCallback((numero: number) => {
    presentation.current = numero;
    setPresentationAffichee(true);
  }, []);

  const terminerLaPresentation = useCallback((numero: number) => {
    if (presentation.current !== numero) return;
    presentation.current = undefined;
    setPresentationAffichee(false);
  }, []);

  const presenterLaQuestionDeLExercice = useCallback(async (numero: number) => {
    const position = seance.exerciceEnCours()?.position;
    switch (position === undefined ? undefined : lecon.exercices[position]?.type) {
      case "calcul":
        await calcul.presenter();
        break;
      case "boite":
      case "barres":
        await illustree.presenter();
        break;
      case "fluence":
        await fluence.presenter();
        break;
      case "addition":
        await addition.presenter();
        break;
      case "dictee":
        await presenterLaDictee();
        break;
      case "memoriser":
        await memorisation.presenter(numero);
        break;
      default:
        await ouvrir(numero);
    }
    terminerLaPresentation(numero);
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
    terminerLaPresentation,
  ]);

  const ouvrirLExercice = useCallback(async (numero: number) => {
    commencerLaPresentation(numero);
    await lireLaConsigneDeLExercice();
    if (numero === sequence.current) await presenterLaQuestionDeLExercice(numero);
  }, [commencerLaPresentation, lireLaConsigneDeLExercice, presenterLaQuestionDeLExercice]);

  /** Dit seulement la consigne : la question reste posée. Sans effet pendant la présentation de l'exercice. */
  const relireLaConsigne = useCallback(() => {
    const consigne = consigneDeLExercice();
    if (consigne === undefined || presentationEnCours() || reussite.estFigee.current) return;
    void dire({ texte: consigne, nature: "consigne" });
  }, [consigneDeLExercice, presentationEnCours, reussite.estFigee, dire]);

  const direLeFait = useCallback((fait: FaitDeSeance): Promise<boolean> => {
    if (fait.type === "EtapesDeLeconFinies") {
      const invitation = inviterAJouerApresLesEtapes(hasardDuNavigateur);
      return dire({ texte: invitation.texte, nature: "invitation", humeur: invitation.humeur });
    }
    return dire({ texte: annoncerExerciceSuivant(fait.titre, hasardDuNavigateur), nature: "annonce" });
  }, [dire]);

  const enchainerSurLExercice = useCallback(async (numero: number, faits: readonly FaitDeSeance[]) => {
    commencerLaPresentation(numero);
    for (const fait of faits) {
      if (!(await direLeFait(fait))) return;
      if (!(await reussite.attendreLEcranSuivant()) || numero !== sequence.current) return;
    }
    await attendreUnPeu();
    if (numero === sequence.current) await ouvrirLExercice(numero);
  }, [commencerLaPresentation, direLeFait, attendreUnPeu, ouvrirLExercice, reussite.attendreLEcranSuivant]);

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
    if (presentationEnCours() && personnage.parole?.nature === "consigne") {
      void ouvrirLExercice(++sequence.current);
      return;
    }
    if (personnage.parole?.nature === "question" && (relireLaPresentation() || relireLaQuestion())) return;
    if (memorisation.reecouter()) return;
    sequence.current++;
    relire();
  }, [reussite.figee, presentationEnCours, ouvrirLExercice, personnage.parole, relireLaPresentation, relireLaQuestion, memorisation.reecouter, relire]);

  const { parolesDeFin: parolesDeFinDeLaFluence, issueDuRecord } = fluence;
  /** Une fluence seule a déjà dit ses paroles de fin : elles sont reprises avec ce que la séance a fait gagner. Sans épisode, seuls les effets de la fin sont joués. */
  const direLaFinDeLaFluenceSeule = useCallback(({ episode }: NouveautesDeFin, effetsAvant: readonly EffetSonore[]) => {
    const paroles = parolesDeFinDeLaFluence.current;
    if (paroles === undefined) return;
    if (episode === undefined) {
      if (effetsAvant.length > 0) void jouer(effetsAvant);
      return;
    }
    void dire({ texte: phraseDeFinAvecLesNouveautes(paroles, { episode }), nature: "felicitation", humeur: "applaudit", effetsAvant });
  }, [dire, jouer, parolesDeFinDeLaFluence]);

  const direLaFin = useCallback((etoiles: number | undefined, nouveautes: NouveautesDeFin) => {
    sequence.current++;
    const effetsAvant = effetsDeLaFinDeSeance(etoiles, nouveautes, issueDuRecord.current);
    if (etoiles === undefined) return direLaFinDeLaFluenceSeule(nouveautes, effetsAvant);
    const felicitation = parolesDeFinDeSeance(etoiles, prenom, personnageGuide, hasardDuNavigateur);
    const texte = phraseDeFinAvecLaQuete(phraseDeFinAvecLesNouveautes(felicitation, nouveautes), prenom, nouveautes.queteAccomplie ?? false);
    void dire({ texte, nature: "felicitation", humeur: "applaudit", effetsAvant });
  }, [dire, prenom, personnageGuide, issueDuRecord, direLaFinDeLaFluenceSeule]);

  const abandonner = useCallback(() => {
    vivant.current = false;
    sequence.current++;
    reussite.continuer();
    faireSilence();
  }, [faireSilence, reussite.continuer]);

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
    retour,
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
    recordBattu: fluence.recordBattu,
    repondreParUnNombre,
    choisirUneReponseDeCalcul,
    poserUnChiffre,
    jeNeSaisPasALaQuestion,
    jeNeSaisPasDeLAddition,
    demarrerLaFluence,
    relireLaPhrase,
    relireLaConsigne,
    presentationEnCours: presentationAffichee && presentationEnCours(),
    enfantAttendu: reussite.enfantAttendu,
    continuerApresLaReussite: reussite.continuer,
    commencer,
    continuer,
    direLaFin,
    abandonner,
  };
}
