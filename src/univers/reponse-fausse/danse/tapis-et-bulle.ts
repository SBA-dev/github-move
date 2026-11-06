import { E, fenetre, r3 } from "../../celebrations/commun/courbes.ts";
import { deplacer, elementsDe, poser } from "../../celebrations/commun/dom.ts";
import { PREFIXE_DE_LILI } from "./reglages.ts";
import { T_VACILLEMENT } from "./scenario.ts";

/** Le petit tapis rose pâle sous ses pieds : présent le temps de la scène seulement. */
export function creerLeTapis(racine: SVGSVGElement) {
  const n = elementsDe(racine, PREFIXE_DE_LILI);

  function dessiner(t: number) {
    poser(n("sol"), "opacity", r3(fenetre(t, 0, .1) * (1 - fenetre(t, 1.25, .2, E.douce))));
  }

  return { dessiner };
}

/** La petite bulle écrite « oups ! » : au vacillement, puis elle s'efface. Décor du dessin, jamais lue. Rien quand le dessin n'en porte pas. */
export function creerLaBulleEcrite(racine: SVGSVGElement) {
  if (!racine.querySelector(`#${PREFIXE_DE_LILI}-oups`)) return undefined;
  const n = elementsDe(racine, PREFIXE_DE_LILI);

  function dessiner(t: number) {
    const entree = fenetre(t, T_VACILLEMENT, .14, E.sortie), sortie = fenetre(t, .62, .12, E.entree);
    poser(n("oups"), "opacity", r3(fenetre(t, T_VACILLEMENT, .06) * (1 - sortie)));
    deplacer(n("oups-corps"), `translate(-52 -108) scale(${r3(.4 + .6 * entree)})`);
  }

  return { dessiner };
}
