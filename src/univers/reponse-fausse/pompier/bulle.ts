import { E } from "../../celebrations/commun/courbes.ts";
import { creerLaBulleEcrite, type ReglagesDeLaBulleEcrite } from "../commun/bulle-ecrite.ts";
import { PREFIXE_DE_SAM } from "./reglages.ts";
import { T } from "./scenario.ts";

const BULLE_DE_SAM: ReglagesDeLaBulleEcrite = {
  prefixe: PREFIXE_DE_SAM,
  identifiant: "plouf",
  apparition: T.plouf,
  position: "translate(72 -116)",
  echelle: 1,
  dureeDEntree: .14,
  courbeDEntree: E.sortie,
  disparition: .92,
};

/** La petite bulle « plouf ! » : quand l'eau retombe, puis elle s'efface. */
export const creerLaBulleDeSam = (racine: SVGSVGElement) => creerLaBulleEcrite(racine, BULLE_DE_SAM);
