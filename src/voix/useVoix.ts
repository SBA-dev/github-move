import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { type PersonnageGuide, presentationAuRetourDuSon } from "@domain/motivation";
import { type EtatDuSon, LectureAVoixHaute } from "@domain/voix";
import { hasardDuNavigateur } from "../hasard-navigateur.ts";
import { DeverrouillageAudio, deverrouillerAuToucher } from "./deverrouillage-audio.ts";
import { LecteurSyntheseVocale } from "./lecteur-synthese-vocale.ts";
import { lireLEtatDuSon, memoriserLEtatDuSon } from "./memoire-du-son.ts";
import { VoixDeLAppareilNavigateur } from "./voix-de-l-appareil-navigateur.ts";

export type OptionsDeLecture = Parameters<LectureAVoixHaute["lire"]>[1];

export type Voix = {
  readonly son: EtatDuSon;
  readonly nomDuGuideDeLaVoixBloquee: string | undefined;
  readonly lire: (texte: string, options?: OptionsDeLecture) => Promise<void>;
  readonly couperLaVoix: () => void;
  readonly basculerLeSon: () => void;
};

export function useVoix(personnageGuide: PersonnageGuide): Voix {
  const guide = useRef(personnageGuide);
  useLayoutEffect(() => {
    guide.current = personnageGuide;
  });
  const [son, setSon] = useState(lireLEtatDuSon);
  const [nomDuGuideDeLaVoixBloquee, setNomDuGuideDeLaVoixBloquee] = useState<string | undefined>();
  const [deverrouillage] = useState(() => new DeverrouillageAudio());
  const [lecture] = useState(() =>
    new LectureAVoixHaute({
      lecteur: new LecteurSyntheseVocale(),
      voixDeLAppareil: new VoixDeLAppareilNavigateur(),
      hasard: hasardDuNavigateur,
      caractereDuPersonnageGuide: () => guide.current.caractere,
      etatInitial: son,
      onVoixBloquee: () => setNomDuGuideDeLaVoixBloquee(guide.current.nom),
    })
  );

  useEffect(() => {
    if (son === "muet") return;
    return deverrouillerAuToucher(deverrouillage);
  }, [son, deverrouillage]);

  const lire = useCallback((texte: string, options?: OptionsDeLecture) => {
    setNomDuGuideDeLaVoixBloquee(undefined);
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
    void lecture.remettreLeSon(presentationAuRetourDuSon(guide.current));
  }, [son, lecture, deverrouillage]);

  return { son, nomDuGuideDeLaVoixBloquee, lire, couperLaVoix, basculerLeSon };
}
