import { E, fenetre, r3 } from "../../celebrations/commun/courbes.ts";
import { elementsDe, poser } from "../../celebrations/commun/dom.ts";
import { PREFIXE_DE_LILI } from "./reglages.ts";

/** Le petit tapis rose pâle sous ses pieds : présent le temps de la scène seulement. */
export function creerLeTapis(racine: SVGSVGElement) {
  const n = elementsDe(racine, PREFIXE_DE_LILI);

  function dessiner(t: number) {
    poser(n("sol"), "opacity", r3(fenetre(t, 0, .1) * (1 - fenetre(t, 1.25, .2, E.douce))));
  }

  return { dessiner };
}
