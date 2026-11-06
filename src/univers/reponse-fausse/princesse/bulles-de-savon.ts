import { E, fenetre, r1, r3 } from "../../celebrations/commun/courbes.ts";
import { deplacer, elementsDe, poser } from "../../celebrations/commun/dom.ts";
import type { Point } from "../../celebrations/commun/membres.ts";
import { au } from "../../celebrations/commun/tableaux.ts";
import { PREFIXE_DE_LUMI } from "./reglages.ts";
import { T_PSCHITT } from "./scenario.ts";

/** Des bulles rondes, pastel et transparentes : bleu, rose, vert, lilas. Jamais dorées. */
const TEINTES = [["#9FD3FF", "#6FA8E6"], ["#FFB3D1", "#E883AB"], ["#B8F0C8", "#7CCB93"], ["#D9C6FF", "#A98BE6"]] as const;
const NOMBRE = 10;
/** Les bulles ne sortent pas du cadre du dessin : à droite et en haut. */
const BORD_DROIT = 112;
const BORD_HAUT = -266;

const BULLES = Array.from({ length: NOMBRE }, (_, i) => ({
  depart: T_PSCHITT + i * .045,
  fin: 1.2 + i * .025,
  rayon: 9 + (i % 4) * 3.5,
  vx: 5 + 7 * Math.sin(i * 1.7 + 1),
  vy: -(44 + 16 * Math.cos(i * 2.3)),
  phase: i * 1.3,
  teinte: au(TEINTES, i % 4),
}));

const dessinDeLaBulle = ({ rayon, teinte: [fond, trait] }: (typeof BULLES)[number]) =>
  `<g opacity="0"><circle r="${rayon}" fill="${fond}" fill-opacity=".45" stroke="${trait}" stroke-opacity=".85" stroke-width="1.6"/><circle cx="${r1(-rayon * .34)}" cy="${r1(-rayon * .36)}" r="${r1(rayon * .22)}" fill="#FFFFFF" fill-opacity=".9"/></g>`;

/**
 * Les bulles de savon du « pschitt ! » : elles sortent de la fleur au bout de la baguette, montent à droite de son visage, puis s'effacent toutes avant la fin.
 * Chaque bulle part de là où était le bout de la baguette à son départ.
 */
export function creerLesBullesDeSavon(racine: SVGSVGElement) {
  const groupe = elementsDe(racine, PREFIXE_DE_LUMI)("bulles");
  groupe.innerHTML = BULLES.map(dessinDeLaBulle).join("");
  const bulles = [...groupe.children];
  const departs: (Point | null)[] = BULLES.map(() => null);

  function dessiner(t: number, boutDeLaBaguette: Point | null) {
    const pousse = 22 * fenetre(t, 1, .3, E.douce);
    BULLES.forEach((b, i) => {
      const g = au(bulles, i), s = t - b.depart;
      if (s < 0 || t > b.fin) {
        poser(g, "opacity", 0);
        if (s < 0) departs[i] = null;
        return;
      }
      departs[i] ??= boutDeLaBaguette && { x: boutDeLaBaguette.x, y: boutDeLaBaguette.y };
      const depart = departs[i];
      if (!depart) {
        poser(g, "opacity", 0);
        return;
      }
      const x = Math.min(BORD_DROIT - b.rayon, depart.x + 16 + (i % 4) * 9 - 12 + b.vx * s + Math.sin(b.phase + s * 5) * 4 + pousse * Math.min(1, s * 3));
      const y = Math.max(BORD_HAUT + b.rayon, depart.y + (i % 4) * 4 - 6 + b.vy * s);
      const entree = fenetre(t, b.depart, .14, E.sortie), sortie = 1 - fenetre(t, b.fin - .22, .22, E.entree);
      poser(g, "opacity", r3(entree * sortie));
      deplacer(g, `translate(${r1(x)} ${r1(y)}) scale(${r3(.3 + .7 * entree)})`);
    });
  }

  return { dessiner };
}
