import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { type PersonnageGuide, presentationAuRetourDuSon } from "@domain/motivation";
import { type ChoixDeVoix, type EtatDuSon, LectureAVoixHaute, type VoixDisponible } from "@domain/voix";
import { hasardDuNavigateur } from "../hasard-navigateur.ts";
import { ChoixDeVoixMemoriseSurLAppareil } from "./choix-de-voix-memorise.ts";
import { DeverrouillageAudio, deverrouillerAuToucher } from "./deverrouillage-audio.ts";
import { LecteurSyntheseVocale, syntheseVocale } from "./lecteur-synthese-vocale.ts";
import { lireLEtatDuSon, memoriserLEtatDuSon } from "./memoire-du-son.ts";
import { VoixDeLAppareilNavigateur } from "./voix-de-l-appareil-navigateur.ts";

export type OptionsDeLecture = Parameters<LectureAVoixHaute["lire"]>[1];

export type Voix = {
  readonly son: EtatDuSon;
  readonly nomDuPersonnageGuideDeLaVoixBloquee: string | undefined;
  readonly lire: (texte: string, options?: OptionsDeLecture) => Promise<void>;
  readonly couperLaVoix: () => void;
  readonly basculerLeSon: () => void;
  readonly suspendre: () => void;
  readonly reprendre: () => void;
  readonly voixDisponibles: readonly VoixDisponible[];
  readonly syntheseVocalePresente: boolean;
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
  const [nomDuPersonnageGuideDeLaVoixBloquee, setNomDuPersonnageGuideDeLaVoixBloquee] = useState<string | undefined>();
  const [deverrouillage] = useState(() => new DeverrouillageAudio());
  const [voixDeLAppareil] = useState(() => new VoixDeLAppareilNavigateur());
  const [choixMemorise] = useState(() => new ChoixDeVoixMemoriseSurLAppareil());
  const [syntheseVocalePresente] = useState(() => syntheseVocale() !== undefined);
  const [voixDisponibles, setVoixDisponibles] = useState(() => voixDeLAppareil.voixDisponibles());
  const [choixDeVoix, setChoixDeVoix] = useState(() => choixMemorise.lire());
  const [lecture] = useState(() =>
    new LectureAVoixHaute({
      lecteur: new LecteurSyntheseVocale(),
      voixDeLAppareil,
      choixDeVoix: choixMemorise,
      hasard: hasardDuNavigateur,
      caractereDuPersonnageGuide: () => personnageGuideEnCours.current.caractere,
      etatInitial: son,
      onVoixBloquee: () => setNomDuPersonnageGuideDeLaVoixBloquee(personnageGuideEnCours.current.nom),
    })
  );

  useEffect(() => {
    if (son === "muet") return;
    return deverrouillerAuToucher(deverrouillage);
  }, [son, deverrouillage]);

  useEffect(
    () => voixDeLAppareil.surChangement(() => setVoixDisponibles(voixDeLAppareil.voixDisponibles())),
    [voixDeLAppareil],
  );

  const lire = useCallback((texte: string, options?: OptionsDeLecture) => {
    setNomDuPersonnageGuideDeLaVoixBloquee(undefined);
    return lecture.lire(texte, options);
  }, [lecture]);

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

  const suspendre = useCallback(() => lecture.suspendre(), [lecture]);

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
    nomDuPersonnageGuideDeLaVoixBloquee,
    lire,
    couperLaVoix,
    basculerLeSon,
    suspendre,
    reprendre,
    voixDisponibles,
    syntheseVocalePresente,
    choixDeVoix,
    imposerUneVoix,
    revenirALaVoixAutomatique,
    essayerUneVoix,
  };
}
