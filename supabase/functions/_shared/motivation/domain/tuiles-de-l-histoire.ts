import { type EtatDeLHistoire, HISTOIRE_DES_SAVANTURIERS } from "./histoire.ts";

export type TuileDEpisode = {
  readonly numero: number;
  readonly ouvert: boolean;
  readonly libelle: string;
  readonly libelleLu: string;
};

export function tuilesDeLHistoire(etat: EtatDeLHistoire): readonly TuileDEpisode[] {
  return HISTOIRE_DES_SAVANTURIERS.map(({ numero, titre }) => {
    const ouvert = numero <= etat.nombreDEpisodesOuverts;
    return {
      numero,
      ouvert,
      libelle: ouvert ? titre : "À découvrir",
      libelleLu: ouvert ? `Épisode ${numero} : ${titre}` : `Épisode ${numero}, à découvrir`,
    };
  });
}
