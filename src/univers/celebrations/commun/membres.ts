import { DEG, lerp, r1 } from "./courbes.ts";
import { au } from "./tableaux.ts";

export type Point = { readonly x: number; readonly y: number };
export type Membre = { readonly S: Point; readonly E: Point; readonly W: Point; readonly C: Point; readonly dir: number };

const quad = (S: Point, C: Point, W: Point, t: number): Point => ({
  x: (1 - t) ** 2 * S.x + 2 * t * (1 - t) * C.x + t * t * W.x,
  y: (1 - t) ** 2 * S.y + 2 * t * (1 - t) * C.y + t * t * W.y,
});

/** Un membre articulé : une seule courbe souple de l'épaule (ou de la hanche) au poignet (ou à la cheville). */
export function membre(S: Point, a1: number, a2: number, L1: number, L2: number): Membre {
  const E1 = { x: S.x - Math.sin(a1 * DEG) * L1, y: S.y + Math.cos(a1 * DEG) * L1 };
  const W = { x: E1.x - Math.sin((a1 + a2) * DEG) * L2, y: E1.y + Math.cos((a1 + a2) * DEG) * L2 };
  const C = { x: 2 * E1.x - (S.x + W.x) / 2, y: 2 * E1.y - (S.y + W.y) / 2 };
  const dir = Math.atan2(W.x - E1.x, -(W.y - E1.y)) / DEG;
  return { S, E: E1, W, C, dir };
}

export function trace(m: Membre, t0: number, t1: number, pas = 8): string {
  let d = "";
  for (let i = 0; i <= pas; i++) {
    const p = quad(m.S, m.C, m.W, lerp(t0, t1, i / pas));
    d += `${i ? "L" : "M"}${r1(p.x)} ${r1(p.y)}`;
  }
  return d;
}

export const decaler = (m: Membre, dx: number, dy: number): Membre => ({
  ...m,
  S: { x: m.S.x + dx, y: m.S.y + dy },
  C: { x: m.C.x + dx, y: m.C.y + dy },
  W: { x: m.W.x + dx, y: m.W.y + dy },
});

/** Une courbe lisse qui passe entre les points : chaque point est un point de contrôle, la courbe va aux milieux. Elle démarre par `M` (nouveau tracé) ou par `L` (suite d'un tracé). */
export function courbe(P: readonly Point[], depart: "M" | "L" = "M"): string {
  const premier = au(P, 0);
  let d = `${depart}${r1(premier.x)} ${r1(premier.y)}`;
  for (let i = 1; i < P.length - 1; i++) {
    const a = au(P, i), b = au(P, i + 1);
    d += ` Q${r1(a.x)} ${r1(a.y)} ${r1((a.x + b.x) / 2)} ${r1((a.y + b.y) / 2)}`;
  }
  const fin = au(P, P.length - 1);
  return `${d} L${r1(fin.x)} ${r1(fin.y)}`;
}
