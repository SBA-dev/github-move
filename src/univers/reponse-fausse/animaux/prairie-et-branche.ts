import { elementsDe, poser } from "../../celebrations/commun/dom.ts";
import { presenceDuDecor } from "./presence-du-decor.ts";
import { PREFIXE_DE_NOISETTE } from "./reglages.ts";

/** Le coin de prairie sous ses pieds et le bout de branche où pend la noisette : présents le temps de la scène seulement. */
export function creerLePaysage(racine: SVGSVGElement) {
  const n = elementsDe(racine, PREFIXE_DE_NOISETTE);

  function dessiner(t: number) {
    poser(n("sol"), "opacity", presenceDuDecor(t, 0, .1));
    poser(n("branche"), "opacity", presenceDuDecor(t, .04, .08));
  }

  return { dessiner };
}
