import { E } from "../../celebrations/commun/courbes.ts";
import { creerLaBulleEcrite, type ReglagesDeLaBulleEcrite } from "../commun/bulle-ecrite.ts";
import { PREFIXE_DE_LILI } from "./reglages.ts";
import { T_VACILLEMENT } from "./scenario.ts";

const BULLE_DE_LILI: ReglagesDeLaBulleEcrite = {
  prefixe: PREFIXE_DE_LILI,
  identifiant: "oups",
  apparition: T_VACILLEMENT,
  position: "translate(-52 -108)",
  echelle: 1,
  dureeDEntree: .14,
  courbeDEntree: E.sortie,
  disparition: .62,
};

/** La petite bulle « oups ! » : au vacillement, puis elle s'efface. */
export const creerLaBulleDeLili = (racine: SVGSVGElement) => creerLaBulleEcrite(racine, BULLE_DE_LILI);
