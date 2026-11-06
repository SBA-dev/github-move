import { E } from "../../celebrations/commun/courbes.ts";
import { creerLaBulleEcrite, type ReglagesDeLaBulleEcrite } from "../commun/bulle-ecrite.ts";
import { PREFIXE_DE_LEO } from "./reglages.ts";

const BULLE_DE_LEO: ReglagesDeLaBulleEcrite = {
  prefixe: PREFIXE_DE_LEO,
  identifiant: "oh",
  apparition: .5,
  position: "translate(51 -103)",
  echelle: 1.15,
  dureeDEntree: .16,
  courbeDEntree: E.rebond,
  disparition: .92,
};

/** La petite bulle « oh ! » : un instant, juste après que le ballon a touché le poteau. */
export const creerLaBulleDeLeo = (racine: SVGSVGElement) => creerLaBulleEcrite(racine, BULLE_DE_LEO);
