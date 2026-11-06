import { E, fenetre, r3 } from "../../celebrations/commun/courbes.ts";
import { elementsDe, poser } from "../../celebrations/commun/dom.ts";
import { PREFIXE_DE_NOISETTE } from "./reglages.ts";

/** Un élément du décor est là un instant après le début de la scène et s'efface vers sa fin. */
export const presenceDuDecor = (t: number, debut: number, duree: number) => r3(fenetre(t, debut, duree) * (1 - fenetre(t, 1.28, .2, E.douce)));

/** Le coin de prairie sous ses pieds et le bout de branche où pend la noisette : présents le temps de la scène seulement. */
export function creerLePaysage(racine: SVGSVGElement) {
  const n = elementsDe(racine, PREFIXE_DE_NOISETTE);

  function dessiner(t: number) {
    poser(n("sol"), "opacity", presenceDuDecor(t, 0, .1));
    poser(n("branche"), "opacity", presenceDuDecor(t, .04, .08));
  }

  return { dessiner };
}
