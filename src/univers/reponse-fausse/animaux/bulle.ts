import { E } from "../../celebrations/commun/courbes.ts";
import { creerLaBulleEcrite, type ReglagesDeLaBulleEcrite } from "../commun/bulle-ecrite.ts";
import { PREFIXE_DE_NOISETTE } from "./reglages.ts";

const BULLE_DE_NOISETTE: ReglagesDeLaBulleEcrite = {
  prefixe: PREFIXE_DE_NOISETTE,
  identifiant: "hop",
  apparition: .5,
  position: "translate(-90 -148)",
  echelle: 1,
  dureeDEntree: .14,
  courbeDEntree: E.rebond,
  disparition: .94,
};

/** La petite bulle « hop ! » : quand la noisette touche l'herbe, un instant. */
export const creerLaBulleDeNoisette = (racine: SVGSVGElement) => creerLaBulleEcrite(racine, BULLE_DE_NOISETTE);
