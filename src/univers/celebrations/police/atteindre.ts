import { DEG } from "../commun/courbes.ts";
import type { Point } from "../commun/membres.ts";

const LONGUEUR_DU_BRAS = [24, 22] as const;
const EPAULE = (c: "g" | "d"): Point => ({ x: c === "g" ? -18 : 18, y: -38 });
export const HANCHE = (c: "g" | "d"): Point => ({ x: c === "g" ? -10 : 10, y: 4 });

/** Les angles (a1, a2) d'un membre à deux segments qui amènent son extrémité sur la cible ; `cote` choisit de quel côté plie le coude (ou le genou). */
export function anglesVers(S: Point, T: Point, L1: number, L2: number, cote: number): { readonly a1: number; readonly a2: number } {
  const dx = T.x - S.x, dy = T.y - S.y, D = Math.hypot(dx, dy) || .001;
  const Dc = Math.max(Math.abs(L1 - L2) + 1, Math.min((L1 + L2) * .985, D)), ux = dx / D, uy = dy / D;
  const a = (L1 * L1 - L2 * L2 + Dc * Dc) / (2 * Dc), h = Math.sqrt(Math.max(0, L1 * L1 - a * a));
  const Ex = S.x + ux * a + uy * h * cote, Ey = S.y + uy * a - ux * h * cote, Wx = S.x + ux * Dc, Wy = S.y + uy * Dc;
  const a1 = Math.atan2(-(Ex - S.x), Ey - S.y) / DEG;
  let a2 = Math.atan2(-(Wx - Ex), Wy - Ey) / DEG - a1;
  while (a2 > 180) a2 -= 360;
  while (a2 < -180) a2 += 360;
  return { a1, a2 };
}

/** Le bras `c` qui amène la main sur la cible (repère du buste) : le coude va vers l'extérieur et le bas. */
export function brasVers(c: "g" | "d", T: Point): { readonly a1: number; readonly a2: number } {
  const S = EPAULE(c), cote = c === "g" ? -1 : 1, dx = T.x - S.x, dy = T.y - S.y, D = Math.hypot(dx, dy) || 1, nx = dy / D, ny = -dx / D;
  const [L1, L2] = LONGUEUR_DU_BRAS;
  return anglesVers(S, T, L1, L2, Math.sign(nx * cote + ny * .55) || cote);
}
