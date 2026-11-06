import { REGLAGES_DE_LA_CELEBRATION, type ReglagesDeCoachLeo } from "../../celebrations/sports/personnage.ts";

/** Le préfixe des identifiants du dessin : la scène de réponse fausse ne partage aucun identifiant avec la célébration des Sports. */
export const PREFIXE_DE_LEO = "reponse-fausse-sports";

/** Léo à sa taille de maquette, avec les expressions de la scène : un sourire de départ et d'arrivée, une surprise, un rire. */
export const REGLAGES_DE_LEO_EN_REPONSE_FAUSSE: ReglagesDeCoachLeo = {
  prefixe: PREFIXE_DE_LEO,
  echelle: 1,
  emotions: {
    ...REGLAGES_DE_LA_CELEBRATION.emotions,
    joie: { sg: [-6, 5], sd: [-6, -5], lid: 0, pup: 1.05 },
  },
};
