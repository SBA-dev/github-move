export type { CaractereDeLaVoix } from "./caractere-de-la-voix.ts";
export { texteALire } from "./texte-a-lire.ts";
export type { TexteALire } from "./texte-a-lire.ts";
export { estFeminine, estMasculine, estTresNaturelle, scoreDeLaVoix, voixFrancaisesTriees } from "./voix-disponible.ts";
export { phraseDEssai } from "./phrase-d-essai.ts";
export type { VoixDisponible } from "./voix-disponible.ts";
export {
  CARACTERE_LANGUE_ETRANGERE,
  choisirVoix,
  choisirVoixDeLangue,
  ChoixDeVoix,
  voixMontreeCommeChoisie,
} from "./choix-de-voix.ts";
export type { Hasard } from "./hasard.ts";
export { reglerPhrases } from "./reglage-de-phrase.ts";
export type { ReglageDePhrase } from "./reglage-de-phrase.ts";
export { LectureAVoixHaute } from "./lecture-a-voix-haute.ts";
export type { DependancesDeLectureAVoixHaute, EtatDuSon } from "./lecture-a-voix-haute.ts";
export type { LecteurAVoixHaute, LectureDemandee } from "./lecteur-a-voix-haute.ts";
export type { VoixDeLAppareil } from "./voix-de-l-appareil.ts";
export { LectureImpossible, VoixBloquee } from "./erreurs.ts";
export { motsDeLaConsigne } from "./mots-de-la-consigne.ts";
export type { SegmentDeConsigne } from "./mots-de-la-consigne.ts";
