import { E } from "../../celebrations/commun/courbes.ts";
import { creerLaBulleEcrite, type ReglagesDeLaBulleEcrite } from "../commun/bulle-ecrite.ts";
import { PREFIXE_DE_LUMI } from "./reglages.ts";
import { T_PSCHITT } from "./scenario.ts";

const BULLE_DE_LUMI: ReglagesDeLaBulleEcrite = {
  prefixe: PREFIXE_DE_LUMI,
  identifiant: "pschitt",
  apparition: T_PSCHITT,
  position: "translate(-84 -250)",
  echelle: 1,
  dureeDEntree: .14,
  courbeDEntree: E.sortie,
  disparition: 1,
};

/** La petite bulle « pschitt ! » : quand le sort fait des bulles, un instant. */
export const creerLaBulleDeLumi = (racine: SVGSVGElement) => creerLaBulleEcrite(racine, BULLE_DE_LUMI);
