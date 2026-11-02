import { CONTOUR } from "./dessin-du-personnage.ts";
import { clamp01, DEG, E, fenetre, lerp, r1, r3 } from "./courbes.ts";
import { creerUnGroupe, deplacer, elementsDe, NS, poser, trouver } from "./dom.ts";
import { T_FRAPPE, T_IMPACT } from "./poses.ts";

type Point = { readonly x: number; readonly y: number };

const SOL_LEO = 418;
const profondeur = (ySol: number) => lerp(1, .45, clamp01((SOL_LEO - ySol) / (SOL_LEO - 312)));
const DEPART: Point = { x: 104, y: 416 };
const ARRIVEE: Point = { x: 170, y: 300 };
export const POINT_DU_FILET: Point = { x: 170, y: 292 };

type EtatDuBallon = {
  readonly x: number;
  readonly y: number;
  readonly sol: number;
  readonly s: number;
  readonly rot: number;
  readonly sx: number;
  readonly sy: number;
  readonly dir: number;
  readonly vol: boolean;
  /** Avancement du vol (0 au départ, 1 à l'impact), 0 quand le ballon ne vole pas. */
  readonly u: number;
};

function volBallon(u: number, hauteur: number, hauteurFin: number) {
  const g = { x: lerp(DEPART.x, ARRIVEE.x, u), y: lerp(DEPART.y, ARRIVEE.y, u) }, s = profondeur(g.y);
  const h = (4 * hauteur * u * (1 - u) + hauteurFin * u) * s;
  return { x: g.x, y: g.y - h, sol: g.y, s, h };
}

function vol(t: number, hauteur: number, hauteurFin: number): EtatDuBallon {
  const u = E.sortie(clamp01((t - T_FRAPPE) / (T_IMPACT - T_FRAPPE)) * .8) / E.sortie(.8);
  const p = volBallon(u, hauteur, hauteurFin), q = volBallon(Math.min(1, u + .02), hauteur, hauteurFin), v = 1 - u * .7;
  return { ...p, rot: (t - T_FRAPPE) * 1000, sx: 1 + .3 * v, sy: 1 - .18 * v, dir: Math.atan2(q.y - p.y, q.x - p.x) / DEG, vol: true, u };
}

/** Le ballon : frappé, il rapetisse avec la profondeur, frappe le filet, puis retombe au pied du but. */
function etatDuBallon(t: number): EtatDuBallon {
  if (t < T_FRAPPE) return { x: DEPART.x, y: DEPART.y - 16, sol: DEPART.y, s: 1, rot: 0, sx: 1, sy: 1, dir: 0, vol: false, u: 0 };
  if (t < T_IMPACT) return vol(t, 78, 18);
  const s = t - T_IMPACT, p = volBallon(1, 78, 18);
  if (s < .09) {
    const k = Math.sin(s / .09 * Math.PI);
    return { ...p, rot: 470, sx: 1 - .3 * k, sy: 1 + .2 * k, dir: 0, vol: false, u: 0 };
  }
  const chute = fenetre(t, T_IMPACT + .09, .32, E.entree), reb = t - (T_IMPACT + .41);
  let y = lerp(p.y, 300 - 16 * p.s, chute);
  if (reb > 0 && reb < .2) y -= 5 * Math.sin(reb / .2 * Math.PI);
  return { x: p.x, y, sol: 300, s: p.s, rot: 470 + chute * 90, sx: 1, sy: 1, dir: 0, vol: false, u: 0 };
}

const BALLON = `<g class="forme-du-ballon"><circle r="16" fill="#FFFFFF" stroke="${CONTOUR}" stroke-width="3"/><path d="M6 14 A16 16 0 0 0 15 -4 A12 12 0 0 1 6 14 Z" fill="#D7DEE6"/>
    <g fill="#33304A"><path d="M0 -5.5 l5.2 3.8 -2 6.2 h-6.4 l-2 -6.2 z"/><path d="M-13.5 -7.5 l4 .8 1.6 4 -3 2.6 -3.8 -2 z" opacity=".8"/><path d="M11.5 -9.5 l1.6 3.8 -2.8 3 -4 -1.2 -.4 -4.2 z" opacity=".8"/><path d="M-7.5 11 l3.8 -1.4 3.4 2.6 -1 3.8 -4.2 .4 z" opacity=".8"/><path d="M10 8.5 l-4 -.4 -1.4 -3.8 3.2 -2.6 3.8 1.6 z" opacity=".8"/></g></g>`;

export function creerLeBallon(racine: SVGSVGElement) {
  const n = elementsDe(racine);
  const ballon = creerUnGroupe();
  ballon.innerHTML = BALLON;
  const forme = trouver(ballon, ".forme-du-ballon");
  const trainee = creerUnGroupe({ fill: "#FFFFFF" });
  trainee.innerHTML = `<circle opacity=".4"/><circle opacity=".25"/><circle opacity=".12"/>`;
  const traits = creerUnGroupe({ fill: "none", stroke: "#FFFFFF", "stroke-width": "2.5", "stroke-linecap": "round" });
  traits.innerHTML = `<line/><line/><line/>`;
  const ombre = document.createElementNS(NS, "ellipse");
  poser(ombre, "fill", "#15502B");
  poser(ombre, "opacity", ".25");
  n("ballon-couche").replaceChildren(ombre, traits, trainee, ballon);

  function dessiner(t: number) {
    const b = etatDuBallon(t);
    deplacer(ballon, `translate(${r1(b.x)} ${r1(b.y)})`);
    deplacer(forme, `scale(${r3(b.s)}) rotate(${r1(b.dir)}) scale(${r3(b.sx)} ${r3(b.sy)}) rotate(${r1(b.rot - b.dir)})`);
    if (b.vol && b.u > .06) {
      const o = r3(Math.min(1, (1 - b.u) * 1.3));
      poser(trainee, "opacity", o);
      poser(traits, "opacity", o);
      [...trainee.children].forEach((f, i) => {
        const q = etatDuBallon(t - .026 * (i + 1));
        poser(f, "cx", r1(q.x));
        poser(f, "cy", r1(q.y));
        poser(f, "r", r1(15 * q.s - i * 1.5));
      });
      const a = b.dir * DEG, nx = -Math.sin(a), ny = Math.cos(a), L = 26 * b.s + 10;
      [...traits.children].forEach((l, i) => {
        const k = (i - 1) * 11 * b.s, bx = b.x + nx * k - Math.cos(a) * 18 * b.s, by = b.y + ny * k - Math.sin(a) * 18 * b.s;
        poser(l, "x1", r1(bx));
        poser(l, "y1", r1(by));
        poser(l, "x2", r1(bx - Math.cos(a) * L));
        poser(l, "y2", r1(by - Math.sin(a) * L));
      });
    } else {
      poser(trainee, "opacity", 0);
      poser(traits, "opacity", 0);
    }
    const h = Math.max(0, b.sol - b.y - 16 * b.s);
    poser(ombre, "cx", r1(b.x + h * .05));
    poser(ombre, "cy", r1(b.sol));
    poser(ombre, "rx", r1(Math.max(4, 15 * b.s - h * .04)));
    poser(ombre, "ry", r1(Math.max(1.5, 5 * b.s - h * .012)));
    poser(ombre, "opacity", r3(Math.max(.05, .25 - h * .0012)));
  }

  return { dessiner };
}

// ---------- Filet ----------
const FOND: readonly Point[] = [{ x: 117.8, y: 239 }, { x: 242.2, y: 239 }, { x: 242.2, y: 305.7 }, { x: 117.8, y: 305.7 }];
const COTE_G: readonly Point[] = [{ x: 105, y: 232 }, { x: 117.8, y: 239 }, { x: 117.8, y: 305.7 }, { x: 105, y: 312 }];
const COTE_D: readonly Point[] = [{ x: 242.2, y: 239 }, { x: 255, y: 232 }, { x: 255, y: 312 }, { x: 242.2, y: 305.7 }];
const TOIT: readonly Point[] = [{ x: 105, y: 232 }, { x: 255, y: 232 }, { x: 242.2, y: 239 }, { x: 117.8, y: 239 }];

const coin = (q: readonly Point[], i: number): Point => q[i] ?? { x: 0, y: 0 };
const bilin = (q: readonly Point[], s: number, v: number): Point => ({
  x: lerp(lerp(coin(q, 0).x, coin(q, 1).x, s), lerp(coin(q, 3).x, coin(q, 2).x, s), v),
  y: lerp(lerp(coin(q, 0).y, coin(q, 1).y, s), lerp(coin(q, 3).y, coin(q, 2).y, s), v),
});

type Deformation = (p: Point, u: number, v: number) => Point;

function grille(q: readonly Point[], n: number, m: number, pas: number, deforme: Deformation): string {
  let d = "";
  for (let i = 0; i <= n; i++) {
    for (let k = 0; k <= pas; k++) {
      const p = deforme(bilin(q, i / n, k / pas), i / n, k / pas);
      d += `${k ? "L" : "M"}${r1(p.x)} ${r1(p.y)}`;
    }
  }
  for (let i = 0; i <= m; i++) {
    for (let k = 0; k <= pas; k++) {
      const p = deforme(bilin(q, k / pas, i / m), k / pas, i / m);
      d += `${k ? "L" : "M"}${r1(p.x)} ${r1(p.y)}`;
    }
  }
  return d;
}

/** Le filet du but : il gonfle et ondule à l'impact du ballon. */
export function creerLeFilet(racine: SVGSVGElement) {
  const n = elementsDe(racine);
  n("filet-cotes").innerHTML = [COTE_G, COTE_D, TOIT].map((q) => `<path d="${grille(q, 2, 8, 1, (p) => p)}"/>`).join("");
  const chemin = document.createElementNS(NS, "path");
  n("filet-fond").replaceChildren(chemin);
  let dernierGonflement = -1;

  function dessiner(t: number) {
    const s = t - T_IMPACT;
    const amp = s > 0 && s < 1.2 ? Math.sin(2 * Math.PI * s / .72) * Math.exp(-3.2 * s) : 0;
    if (Math.abs(amp) < .002 && dernierGonflement === 0) return;
    dernierGonflement = Math.abs(amp) < .002 ? 0 : amp;
    const deforme: Deformation = (p, u, v) => {
      if (!amp) return p;
      const dx = p.x - POINT_DU_FILET.x, dy = p.y - POINT_DU_FILET.y, dist = Math.hypot(dx, dy);
      const g = Math.exp(-(dist * dist) / (2 * 26 * 26)) * Math.min(1, 4 * u * (1 - u)) * Math.min(1, 4 * v * (1 - v));
      const k = amp * 16 * g, rad = dist > .1 ? 1 / dist : 0;
      return { x: p.x + k * dx * rad * .8, y: p.y + k * (dy * rad * .8 - .5) };
    };
    poser(chemin, "d", grille(FOND, 9, 6, amp ? 6 : 1, deforme));
  }

  return { dessiner };
}
