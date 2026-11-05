import { DEG, r1 } from "./courbes.ts";

export type PoseDeMain = 0 | 1 | 2 | 3;
export type CoteDeMain = "droit" | "miroir";
export type CouleursDeMain = { readonly contour: string; readonly peau: string; readonly peauOmbre: string };

/** Un doigt effilé et légèrement courbe, de la base (x, y0) dans la direction a (0 = vers le haut), longueur L. */
function doigtForme(x: number, y0: number, a: number, L: number, b = 2.7, tp = 1.9): string {
  const dx = Math.sin(a * DEG), dy = -Math.cos(a * DEG), nx = -dy, ny = dx;
  const tx = x + dx * L, ty = y0 + dy * L, mx = (x + tx) / 2 + nx * .7, my = (y0 + ty) / 2 + ny * .7, mw = (b + tp) / 2;
  return `M${r1(x + nx * b)} ${r1(y0 + ny * b)} Q${r1(mx + nx * mw)} ${r1(my + ny * mw)} ${r1(tx + nx * tp)} ${r1(ty + ny * tp)} A${tp} ${tp} 0 0 0 ${r1(tx - nx * tp)} ${r1(ty - ny * tp)} Q${r1(mx - nx * mw)} ${r1(my - ny * mw)} ${r1(x - nx * b)} ${r1(y0 - ny * b)} Z`;
}

/** Une main à cinq doigts : détendue (0), poing (1), pouce levé (2) ou doigts écartés (3). */
function main(pose: PoseDeMain, cote: CoteDeMain, { contour, peau, peauOmbre }: CouleursDeMain): string {
  const trait = (d: string, w: number) => `<path d="${d}" fill="none" stroke="${contour}" stroke-width="${w}" stroke-linejoin="round"/>`;
  const m = cote === "miroir" ? -1 : 1, doigts = [-6.3, -2.1, 2.1, 6.3], angles = pose === 3 ? [-26, -9, 9, 26] : [-9, -3, 3, 9];
  const paume = `M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z`;
  const paumePoing = `M-8 8 V-2 Q-8 -9 0 -9 Q8 -9 8 -2 V8 Q0 12 -8 8 Z`;
  let contours = "", remplissages = "";
  if (pose === 0 || pose === 3) {
    const formes = doigts.map((x, i) => doigtForme(x, -6, (angles[i] ?? 0) * m, 10.5 - Math.abs(i - 1.5) * .8));
    const pouce = doigtForme(-7 * m, 0, -52 * m, 9, 2.6, 1.9);
    formes.concat(pouce).forEach((d) => (contours += trait(d, 5.2)));
    remplissages += formes.concat(pouce).map((d) => `<path d="${d}" fill="${peau}"/>`).join("");
    remplissages += doigts.map((x, i) => {
      const a = (angles[i] ?? 0) * m * DEG;
      return `<path d="M${r1(x + Math.sin(a) * 3)} ${r1(-6 - Math.cos(a) * 3)} l${r1(Math.sin(a) * 4)} ${r1(-Math.cos(a) * 4)}" fill="none" stroke="${peauOmbre}" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>`;
    }).join("");
    return `${contours}${trait(paume, 5.6)}<path d="${paume}" fill="${peau}"/>${remplissages}<path d="M3 8 Q7 4 7 -1" fill="none" stroke="${peauOmbre}" stroke-width="2.2" stroke-linecap="round"/>`;
  }
  const pouce = pose === 2 ? doigtForme(-5 * m, -4, -10 * m, 13, 2.8, 2.1) : null;
  if (pouce) contours += trait(pouce, 5.4);
  doigts.forEach((x) => { contours += `<circle cx="${x}" cy="-8" r="5.4" fill="${contour}"/>`; });
  let dessus = doigts.map((x) => `<circle cx="${x}" cy="-8" r="3.6" fill="${peau}"/>`).join("") + `<rect x="-8" y="-8" width="16" height="6" fill="${peau}"/>`;
  dessus += doigts.map((x) => `<path d="M${x - 2.2} -6.5 q2.2 -1.8 4.4 0" fill="none" stroke="${peauOmbre}" stroke-width="1.4" stroke-linecap="round"/>`).join("");
  if (pouce) dessus += `<path d="${pouce}" fill="${peau}"/><path d="M${r1(-6 * m)} -3 l${r1(-1.5 * m)} -6" fill="none" stroke="${peauOmbre}" stroke-width="1.6" stroke-linecap="round"/>`;
  else dessus += `<path d="M${-7 * m} 2 q${r1(5 * m)} 3 ${r1(10 * m)} 1" fill="none" stroke="${peauOmbre}" stroke-width="1.8" stroke-linecap="round"/>`;
  return `${contours}${trait(paumePoing, 5.6)}<path d="${paumePoing}" fill="${peau}"/>${dessus}<path d="M3 7 Q7 3 7 -2" fill="none" stroke="${peauOmbre}" stroke-width="2.2" stroke-linecap="round"/>`;
}

const POSES_DE_MAIN: readonly PoseDeMain[] = [0, 1, 2, 3];

/** Les mains du personnage, dans chaque pose et de chaque côté, aux couleurs de sa peau. */
export const dessinDesMains = (couleurs: CouleursDeMain): Record<CoteDeMain, readonly string[]> => ({
  droit: POSES_DE_MAIN.map((p) => main(p, "droit", couleurs)),
  miroir: POSES_DE_MAIN.map((p) => main(p, "miroir", couleurs)),
});
