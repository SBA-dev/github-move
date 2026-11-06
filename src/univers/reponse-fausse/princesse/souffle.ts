import { ECHELLE_DE_BASE } from "../../celebrations/princesses/personnage.ts";
import { fenetre, r1, r3 } from "../../celebrations/commun/courbes.ts";
import { deplacer, elementsDe, poser } from "../../celebrations/commun/dom.ts";
import type { Pose } from "../../celebrations/princesses/poses.ts";
import { PREFIXE_DE_LUMI } from "./reglages.ts";

const DEBUT = 1.04;
/** Le moteur fait flotter Lumi de 4 unités autour de 10 unités au-dessus de sa position. */
const flotte = (t: number) => Math.sin(t * 2.2) * 4 - 10;

/** Les trois petits traits lilas devant la bouche de Lumi pendant qu'elle souffle sur les bulles : ils suivent son visage, puis s'effacent. */
export function creerLeSouffle(racine: SVGSVGElement) {
  const souffle = elementsDe(racine, PREFIXE_DE_LUMI)("souffle");

  function dessiner(t: number, pose: Pose) {
    const u = fenetre(t, DEBUT, .08) * (1 - fenetre(t, 1.16, .08));
    poser(souffle, "opacity", r3(u * .85));
    if (u <= 0) return;
    const x = pose.x + ECHELLE_DE_BASE * 18.4 * pose.vue + 22, y = pose.y + flotte(t) - ECHELLE_DE_BASE * 130;
    deplacer(souffle, `translate(${r1(x + 8 * fenetre(t, DEBUT, .16))} ${r1(y)})`);
  }

  return { dessiner };
}
