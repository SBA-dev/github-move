import { E, fenetre, r3 } from "../../celebrations/commun/courbes.ts";
import { elementsDe, poser, type PrefixeDeScene } from "../../celebrations/commun/dom.ts";

export type ReglagesDuSol = {
  readonly prefixe: PrefixeDeScene;
  /** La durée, en secondes, que met le sol à apparaître au début de la scène. */
  readonly apparition: number;
  /** L'instant où le sol commence à s'effacer, en secondes de la scène. */
  readonly disparition: number;
};

/** Le petit coin de sol sous les pieds du personnage (tapis, prairie, herbe) : présent le temps de la scène seulement. Son groupe a l'identifiant `<préfixe>-sol`. */
export function creerUnSolDeScene({ prefixe, apparition, disparition }: ReglagesDuSol) {
  return (racine: SVGSVGElement) => {
    const sol = elementsDe(racine, prefixe)("sol");

    function dessiner(t: number) {
      poser(sol, "opacity", r3(fenetre(t, 0, apparition) * (1 - fenetre(t, disparition, .2, E.douce))));
    }

    return { dessiner };
  };
}
