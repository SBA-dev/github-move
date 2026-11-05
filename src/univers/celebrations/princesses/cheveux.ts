import { DEG, lerp, r1 } from "../commun/courbes.ts";
import { elementsDe, poser, trouver } from "../commun/dom.ts";
import { courbe, type Point } from "../commun/membres.ts";
import { au } from "../commun/tableaux.ts";
import type { Pose } from "./poses.ts";

/** Une mèche : sa racine sur le crâne, son côté, son angle de repos, la longueur et la largeur de chacun de ses segments. */
type Meche = { readonly x: number; readonly cote: -1 | 0 | 1; readonly angle: number; readonly longueurs: readonly number[]; readonly largeurs: readonly number[] };

const MECHES: readonly Meche[] = [
  { x: -30, cote: -1, angle: -34, longueurs: [30, 20, 18, 17, 15], largeurs: [12, 11, 9.5, 7, 2.5] },
  { x: -22, cote: -1, angle: -16, longueurs: [34, 21, 19, 17, 15], largeurs: [12, 11, 9, 7, 2.5] },
  { x: 0, cote: 0, angle: 0, longueurs: [32, 20, 18, 17, 15], largeurs: [10, 9, 8, 6, 2.5] },
  { x: 22, cote: 1, angle: 16, longueurs: [34, 21, 19, 17, 15], largeurs: [12, 11, 9, 7, 2.5] },
  { x: 30, cote: 1, angle: 34, longueurs: [30, 20, 18, 17, 15], largeurs: [12, 11, 9.5, 7, 2.5] },
];
const SEGMENTS = 5;
const MASSE_ARRIERE = "M-42 -150 Q-46 -192 -22 -200 Q-10 -206 0 -200 Q10 -206 22 -200 Q46 -192 42 -150 Q44 -126 32 -116 Q0 -124 -32 -116 Q-44 -126 -42 -150 Z";

/**
 * Les longs cheveux de Lumi : cinq mèches qui naissent du crâne, chacune une chaîne de segments à ressorts.
 * Elles suivent le mouvement avec du retard et flottent pendant l'envol. L'état des ressorts vit dans cette fermeture.
 */
export function creerLesCheveux(racine: SVGSVGElement) {
  const n = elementsDe(racine, "princesse");
  poser(n("chevelure-dos"), "d", MASSE_ARRIERE);
  const ressorts = MECHES.map(() => ({ angles: Array<number>(SEGMENTS).fill(0), vitesses: Array<number>(SEGMENTS).fill(0) }));
  let tPrecedent: number | null = null;

  /** vx et vy : vitesse du corps. */
  function dessiner(p: Pose, t: number, vx: number, vy: number) {
    let dt = tPrecedent === null ? 0 : t - tPrecedent;
    const chauffe = dt < 0 || dt > .25 || tPrecedent === null;
    if (chauffe) {
      dt = 0;
      for (const r of ressorts) {
        r.angles.fill(0);
        r.vitesses.fill(0);
      }
    }
    tPrecedent = t;
    MECHES.forEach((meche, k) => {
      const r = au(ressorts, k), onde = Math.sin(t * 2.2 + k) * 3;
      const base = meche.angle + onde * .3;
      const souffle = Math.max(-40, Math.min(40, -vx * .3)) + Math.max(-70, Math.min(70, vy * .35)) * (1 + p.vol) - p.rot * .8 + onde;
      for (let i = 0; i < SEGMENTS; i++) {
        const vague = i ? (i % 2 ? 16 : -16) * (meche.cote || (k % 2 ? 1 : -1)) : 0;
        const cible = (i === 0 ? base : au(r.angles, i - 1) + (i === 1 ? souffle : 0)) + vague - (i ? meche.angle * .18 : 0);
        const raideur = i === 0 ? 900 : 220 - i * 30, amortissement = i === 0 ? 40 : 13 - i * 1.5;
        const pas = chauffe ? 160 : 4, h = chauffe ? 1 / 60 : dt / 4;
        for (let s = 0; s < pas; s++) {
          r.vitesses[i] = au(r.vitesses, i) + ((cible - au(r.angles, i)) * raideur - au(r.vitesses, i) * amortissement) * h;
          r.angles[i] = au(r.angles, i) + au(r.vitesses, i) * h;
        }
      }
      const J: Point[] = [{ x: meche.x + p.vue * 4, y: -172 }];
      for (let i = 0; i < SEGMENTS; i++) {
        const a = au(r.angles, i) * DEG, q = au(J, i);
        J.push({ x: q.x + Math.sin(a) * au(meche.longueurs, i), y: q.y + Math.cos(a) * au(meche.longueurs, i) });
      }
      const G: Point[] = [], D: Point[] = [];
      for (let i = 0; i <= SEGMENTS; i++) {
        const a = au(J, Math.max(0, i - 1)), b = au(J, Math.min(SEGMENTS, i + 1)), tx = b.x - a.x, ty = b.y - a.y;
        const tl = Math.hypot(tx, ty) || 1, nx = -ty / tl, ny = tx / tl, w = meche.largeurs[i] ?? au(meche.largeurs, SEGMENTS - 1), c = au(J, i);
        G.push({ x: c.x + nx * w, y: c.y + ny * w });
        D.push({ x: c.x - nx * w, y: c.y - ny * w });
      }
      const bout = au(J, SEGMENTS), fD = au(D, SEGMENTS);
      const d = courbe(G) + ` Q${r1(bout.x)} ${r1(bout.y + 5)} ${r1(fD.x)} ${r1(fD.y)}` + courbe(D.slice().reverse(), "L") + " Z";
      const bande = (kk: number) => J.map((_, i) => ({ x: lerp(au(G, i).x, au(D, i).x, kk), y: lerp(au(G, i).y, au(D, i).y, kk) }));
      const g = n(`brin-${k}`);
      poser(trouver(g, ".meche"), "d", d);
      poser(trouver(g, ".meche-ombre"), "d", courbe(bande(.72).slice(1, 5)));
      poser(trouver(g, ".meche-lumiere"), "d", courbe(bande(.3).slice(0, 3)));
    });
  }

  return { dessiner };
}
