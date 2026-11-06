import { E, fenetre, r3 } from "../../celebrations/commun/courbes.ts";
import { elementsDe, poser } from "../../celebrations/commun/dom.ts";
import { PREFIXE_DE_LUMI } from "./reglages.ts";

/** Le petit coin de prairie pâle sous ses pieds : présent le temps de la scène seulement. */
export function creerLaPrairie(racine: SVGSVGElement) {
  const sol = elementsDe(racine, PREFIXE_DE_LUMI)("sol");

  function dessiner(t: number) {
    poser(sol, "opacity", r3(fenetre(t, 0, .12) * (1 - fenetre(t, 1.3, .2, E.douce))));
  }

  return { dessiner };
}
