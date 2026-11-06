import { dessinDeLaNoisette } from "../../celebrations/animaux/dessin-de-noisette.ts";
import { DEG, E, fenetre, lerp, r1, r3 } from "../../celebrations/commun/courbes.ts";
import { creerUnGroupe, deplacer, elementsDe, poser } from "../../celebrations/commun/dom.ts";
import type { Point } from "../../celebrations/commun/membres.ts";
import { presenceDuDecor } from "./presence-du-decor.ts";
import { PREFIXE_DE_NOISETTE } from "./reglages.ts";
import { ECHELLE_DU_MOTEUR, SOL_X, SOL_Y, T_PRISE } from "./scenario.ts";

const K = ECHELLE_DU_MOTEUR;
/** La hauteur du centre de la noisette posée dans l'herbe. */
const SOL_NOIX = 385;
const R_NOIX = 11.5;
const BRANCHE = { x: SOL_X + 56 * K, y: SOL_Y - 146 * K };
/** Elle descend doucement le long de la branche, touche l'herbe à droite de Noisette, rebondit deux fois en roulant vers elle, et s'arrête tout près de sa main. */
const T_LACHE = .10, T_SOL = .50, T_REBOND1 = .70, T_REBOND2 = .80, T_ARRET = .92;
const ATTERRISSAGE_X = SOL_X + 62 * K;
const OMBRE_MAX = .3;

type EtatDeLaNoix = { readonly x: number; readonly y: number; readonly rot: number; readonly sy: number; readonly ombre: number; readonly tenue?: true };

/** La noisette dorée : elle tombe de la branche loin de Noisette et s'arrête dans l'herbe là où sa main (`mainALaPrise`) se referme ; à la prise, elle passe dans la main. */
export function creerLaNoisetteDoree(racine: SVGSVGElement, mainALaPrise: Point) {
  const n = elementsDe(racine, PREFIXE_DE_NOISETTE);
  const echelle = creerUnGroupe();
  echelle.innerHTML = dessinDeLaNoisette(1.15, PREFIXE_DE_NOISETTE);
  n("noix").replaceChildren(echelle);
  const repos = { x: mainALaPrise.x, y: SOL_NOIX };
  const dansLaMain = { x: 0, y: SOL_NOIX - mainALaPrise.y };
  const retombee1 = repos.x + 34, retombee2 = repos.x + 20;
  const rouleVers = (x: number) => -150 - (retombee2 - x) / R_NOIX / DEG;

  function etatDeLaNoix(t: number, mainDroite: Point): EtatDeLaNoix {
    if (t < T_LACHE) return { x: BRANCHE.x, y: BRANCHE.y, rot: Math.sin(t * 30) * 3, sy: 1, ombre: 0 };
    if (t < T_SOL) {
      const u = (t - T_LACHE) / (T_SOL - T_LACHE), v = Math.pow(u, 1.5);
      return { x: lerp(BRANCHE.x, ATTERRISSAGE_X, u) + 3 * Math.sin(u * Math.PI * 2), y: lerp(BRANCHE.y, SOL_NOIX, v), rot: 14 * Math.sin(u * Math.PI * 2) * (1 - u), sy: 1, ombre: v };
    }
    if (t < T_REBOND1) {
      const v = (t - T_SOL) / (T_REBOND1 - T_SOL), h = 46 * 4 * v * (1 - v);
      return { x: lerp(ATTERRISSAGE_X, retombee1, v), y: SOL_NOIX - h, rot: -v * 100, sy: 1 + (h < 2 ? -.12 : 0), ombre: 1 - h / 80 };
    }
    if (t < T_REBOND2) {
      const v = (t - T_REBOND1) / (T_REBOND2 - T_REBOND1), h = 15 * 4 * v * (1 - v);
      return { x: lerp(retombee1, retombee2, v), y: SOL_NOIX - h, rot: -100 - v * 50, sy: 1, ombre: 1 - h / 80 };
    }
    if (t < T_ARRET) {
      const x = lerp(retombee2, repos.x, E.sortie((t - T_REBOND2) / (T_ARRET - T_REBOND2)));
      return { x, y: SOL_NOIX, rot: rouleVers(x), sy: 1, ombre: 1 };
    }
    if (t < T_PRISE) return { x: repos.x, y: SOL_NOIX, rot: rouleVers(repos.x), sy: 1, ombre: 1 };
    return { x: mainDroite.x + dansLaMain.x, y: mainDroite.y + lerp(dansLaMain.y, 2, fenetre(t, T_PRISE, .14)), rot: 0, sy: 1, ombre: 0, tenue: true };
  }

  function dessiner(t: number, mainDroite: Point) {
    const noix = etatDeLaNoix(t, mainDroite);
    deplacer(n("noix"), `translate(${r1(noix.x)} ${r1(noix.y)})`);
    deplacer(echelle, `rotate(${r1(noix.rot)}) scale(1 ${r3(noix.sy)})`);
    poser(n("noix"), "opacity", noix.tenue ? 1 : presenceDuDecor(t, .04, .08));
    poser(n("ombre-noix"), "cx", r1(noix.x));
    poser(n("ombre-noix"), "opacity", r3(OMBRE_MAX * Math.max(0, Math.min(1, noix.ombre)) * (t < T_LACHE ? 0 : 1)));
  }

  return { dessiner };
}
