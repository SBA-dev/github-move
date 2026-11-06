import { E } from "../../celebrations/commun/courbes.ts";
import { creerLaBulleEcrite, type ReglagesDeLaBulleEcrite } from "../commun/bulle-ecrite.ts";
import { PREFIXE_DE_MAX } from "./reglages.ts";
import { T } from "./scenario.ts";

const BULLE_DE_MAX: ReglagesDeLaBulleEcrite = {
  prefixe: PREFIXE_DE_MAX,
  identifiant: "oups",
  apparition: T.oups,
  position: "translate(-52 -112)",
  echelle: 1,
  dureeDEntree: .14,
  courbeDEntree: E.sortie,
  disparition: .62,
};

/** La petite bulle « oups ! » : quand la casquette glisse, puis elle s'efface. */
export const creerLaBulleDeMax = (racine: SVGSVGElement) => creerLaBulleEcrite(racine, BULLE_DE_MAX);
