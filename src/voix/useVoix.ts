import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { type PersonnageGuide, presentationAuRetourDuSon } from "@domain/motivation";
import {
  type CauseDeLectureEmpechee,
  type ChoixDeVoix,
  type EffetSonore,
  type EtatDuSon,
  LecteurAvecRepli,
  LectureAVoixHaute,
  type ParoleEntendue,
  type VoixDisponible,
} from "@domain/voix";
import { hasardDuNavigateur } from "../hasard-navigateur.ts";
import { ChoixDeVoixMemoriseSurLAppareil } from "./choix-de-voix-memorise.ts";
import { DeverrouillageAudio, deverrouillerAuToucher, silenceEnWav } from "./deverrouillage-audio.ts";
import { LecteurDEffetsSonoresDuNavigateur } from "./lecteur-d-effets-sonores-du-navigateur.ts";
import { LecteurDePhrasesEnregistreesDuNavigateur } from "./lecteur-de-phrases-enregistrees-du-navigateur.ts";
import { LecteurSyntheseVocale, syntheseVocale } from "./lecteur-synthese-vocale.ts";
import { lireLEtatDuSon, memoriserLEtatDuSon } from "./memoire-du-son.ts";
import { RepertoireDesPhrasesEnregistreesDuNavigateur } from "./repertoire-des-phrases-enregistrees-du-navigateur.ts";
import { VoixDeLAppareilNavigateur } from "./voix-de-l-appareil-navigateur.ts";

export type OptionsDeLecture = Parameters<LectureAVoixHaute["lire"]>[1];

export type LectureEmpechee = {
  readonly nomDuPersonnageGuide: string;
  readonly cause: CauseDeLectureEmpechee;
};

export type Voix = {
  readonly son: EtatDuSon;
  /** Vrai tant qu'une lecture à voix haute est demandée et pas terminée. */
  readonly lectureEnCours: boolean;
  /** Un seul message à la fois : voix bloquée ou voix indisponible. */
  readonly lectureEmpechee: LectureEmpechee | undefined;
  readonly lire: (texte: string, options?: OptionsDeLecture) => Promise<ParoleEntendue>;
  readonly jouer: (effets: readonly EffetSonore[]) => Promise<void>;
  readonly couperLaVoix: () => void;
  readonly toucherUnBouton: () => void;
  readonly basculerLeSon: () => void;
  readonly suspendre: () => void;
  readonly reprendre: () => void;
  readonly voixDisponibles: readonly VoixDisponible[];
  readonly syntheseVocalePresente: boolean;
  /** Vrai si une voix enregistrée (répertoire chargé) ou la synthèse vocale peut lire. */
  readonly voixPresente: boolean;
  readonly choixDeVoix: ChoixDeVoix;
  readonly imposerUneVoix: (nomDeLaVoix: string) => void;
  readonly revenirALaVoixAutomatique: () => void;
  readonly essayerUneVoix: (choix: ChoixDeVoix) => void;
};

export function useVoix(personnageGuide: PersonnageGuide): Voix {
  const personnageGuideEnCours = useRef(personnageGuide);
  useLayoutEffect(() => {
    personnageGuideEnCours.current = personnageGuide;
  });
  const [son, setSon] = useState(lireLEtatDuSon);
  const [lecturesEnCours, setLecturesEnCours] = useState(0);
  const [lectureEmpechee, setLectureEmpechee] = useState<LectureEmpechee | undefined>();
  const [repertoire] = useState(() => new RepertoireDesPhrasesEnregistreesDuNavigateur());
  const [repertoireCharge, setRepertoireCharge] = useState(false);
  const [effetsSonores] = useState(() => new LecteurDEffetsSonoresDuNavigateur());
  const [phrasesEnregistrees] = useState(() => new LecteurDePhrasesEnregistreesDuNavigateur());
  const [deverrouillage] = useState(() =>
    new DeverrouillageAudio(() => {
      effetsSonores.amorcer();
      phrasesEnregistrees.amorcer(silenceEnWav());
    })
  );
  const [voixDeLAppareil] = useState(() => new VoixDeLAppareilNavigateur());
  const [choixMemorise] = useState(() => new ChoixDeVoixMemoriseSurLAppareil());
  const [syntheseVocalePresente] = useState(() => syntheseVocale() !== undefined);
  const [voixDisponibles, setVoixDisponibles] = useState(() => voixDeLAppareil.voixDisponibles());
  const [choixDeVoix, setChoixDeVoix] = useState(() => choixMemorise.lire());
  const [lecture] = useState(() =>
    new LectureAVoixHaute({
      lecteur: new LecteurAvecRepli({
        repertoire,
        lecteurDePhrasesEnregistrees: phrasesEnregistrees,
        voixDeLAppareil: new LecteurSyntheseVocale(),
        aUneVoixFrancaise: () => voixDeLAppareil.voixDisponibles().some(({ langue }) => langue.toLowerCase().startsWith("fr")),
      }),
      lecteurDEffetsSonores: effetsSonores,
      voixDeLAppareil,
      choixDeVoix: choixMemorise,
      hasard: hasardDuNavigateur,
      caractereDuPersonnageGuide: () => personnageGuideEnCours.current.caractere,
      etatInitial: son,
      onLectureEmpechee: (cause) => setLectureEmpechee({ nomDuPersonnageGuide: personnageGuideEnCours.current.nom, cause }),
      onFinDeLectureEmpechee: () => setLectureEmpechee(undefined),
    })
  );

  useEffect(() => {
    if (son === "muet") return;
    return deverrouillerAuToucher(deverrouillage);
  }, [son, deverrouillage]);

  useEffect(() => {
    void repertoire.charger().then(() => setRepertoireCharge(repertoire.charge));
  }, [repertoire]);

  useEffect(
    () => voixDeLAppareil.surChangement(() => setVoixDisponibles(voixDeLAppareil.voixDisponibles())),
    [voixDeLAppareil],
  );

  const lire = useCallback(
    async (texte: string, options?: OptionsDeLecture) => {
      setLecturesEnCours((nombre) => nombre + 1);
      try {
        return await lecture.lire(texte, options);
      } finally {
        setLecturesEnCours((nombre) => nombre - 1);
      }
    },
    [lecture],
  );

  const jouer = useCallback((effets: readonly EffetSonore[]) => lecture.jouer(effets), [lecture]);

  const toucherUnBouton = useCallback(() => lecture.toucherUnBouton(), [lecture]);

  const couperLaVoix = useCallback(() => lecture.couperLaVoix(), [lecture]);

  const basculerLeSon = useCallback(() => {
    const suivant: EtatDuSon = son === "son" ? "muet" : "son";
    memoriserLEtatDuSon(suivant);
    setSon(suivant);
    if (suivant === "muet") {
      lecture.passerEnMuet();
      deverrouillage.relacher();
      return;
    }
    deverrouillage.deverrouiller();
    void lecture.remettreLeSon(presentationAuRetourDuSon(personnageGuideEnCours.current));
  }, [son, lecture, deverrouillage]);

  const suspendre = useCallback(() => {
    lecture.suspendre();
  }, [lecture]);

  const reprendre = useCallback(() => lecture.reprendre(), [lecture]);

  const imposerUneVoix = useCallback((nomDeLaVoix: string) => {
    lecture.imposerUneVoix(nomDeLaVoix);
    setChoixDeVoix(choixMemorise.lire());
  }, [lecture, choixMemorise]);

  const revenirALaVoixAutomatique = useCallback(() => {
    lecture.revenirALaVoixAutomatique();
    setChoixDeVoix(choixMemorise.lire());
  }, [lecture, choixMemorise]);

  const essayerUneVoix = useCallback(
    (choix: ChoixDeVoix) => void lecture.essayerUneVoix(choix, personnageGuideEnCours.current.nom),
    [lecture],
  );

  return {
    son,
    lectureEnCours: lecturesEnCours > 0,
    lectureEmpechee,
    lire,
    jouer,
    couperLaVoix,
    toucherUnBouton,
    basculerLeSon,
    suspendre,
    reprendre,
    voixDisponibles,
    syntheseVocalePresente,
    voixPresente: repertoireCharge || syntheseVocalePresente,
    choixDeVoix,
    imposerUneVoix,
    revenirALaVoixAutomatique,
    essayerUneVoix,
  };
}
