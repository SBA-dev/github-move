import { clamp01, DEG, E, fenetre, lerp, r1, r3 } from "../../celebrations/commun/courbes.ts";
import { creerUnGroupe, deplacer, elementsDe, poser, trouver } from "../../celebrations/commun/dom.ts";
import { DESSIN_DU_BALLON } from "../../celebrations/sports/ballon-et-filet.ts";
import { PREFIXE_DE_LEO } from "./reglages.ts";
import { T_IMPACT, T_TIR } from "./scenario.ts";

const X_POTEAU = 72;
const SOL = 74;
const R_BALLON = 8.5;
const X_BALLON_DEPART = 42;
const X_BALLON_FIN = 38;
const X_CONTACT = X_POTEAU - 4 - R_BALLON;
const Y_CONTACT = 52;
const Y_SOL_BALLON = SOL - R_BALLON;
const X_RETOMBEE = 52;
const T_SOL = .74;

type EtatDuBallon = { readonly x: number; readonly y: number; readonly rot: number; readonly sx: number; readonly sy: number };

/** Le ballon : posé aux pieds de Léo, frappé, il rebondit doucement sur le petit poteau, retombe et revient rouler à ses pieds. */
function etatDuBallon(t: number): EtatDuBallon {
  if (t < T_TIR) return { x: X_BALLON_DEPART, y: Y_SOL_BALLON, rot: 0, sx: 1, sy: 1 };
  if (t < T_IMPACT) {
    const u = (t - T_TIR) / (T_IMPACT - T_TIR);
    return { x: lerp(X_BALLON_DEPART, X_CONTACT, E.sortie(u)), y: lerp(Y_SOL_BALLON, Y_CONTACT, u) - 4 * 5 * u * (1 - u), rot: u * 150, sx: 1, sy: 1 };
  }
  if (t < T_IMPACT + .06) {
    const k = Math.sin((t - T_IMPACT) / .06 * Math.PI);
    return { x: X_CONTACT + k, y: Y_CONTACT, rot: 150, sx: 1 - .16 * k, sy: 1 + .1 * k };
  }
  const tRebond = T_IMPACT + .06;
  if (t < T_SOL) {
    const u = (t - tRebond) / (T_SOL - tRebond);
    return { x: lerp(X_CONTACT, X_RETOMBEE, u), y: lerp(Y_CONTACT, Y_SOL_BALLON, E.entree(u)), rot: 150 - u * 80, sx: 1, sy: 1 };
  }
  if (t < .86) {
    const w = (t - T_SOL) / (.86 - T_SOL);
    return { x: lerp(X_RETOMBEE, X_RETOMBEE - 3, w), y: Y_SOL_BALLON - 4 * 3.5 * w * (1 - w), rot: 70 - w * 40, sx: 1, sy: 1 };
  }
  const x = lerp(X_RETOMBEE - 3, X_BALLON_FIN, E.sortie(clamp01((t - .86) / .34)));
  return { x, y: Y_SOL_BALLON, rot: 30 - (X_RETOMBEE - 3 - x) / R_BALLON / DEG, sx: 1, sy: 1 };
}

export function creerLeBallon(racine: SVGSVGElement) {
  const n = elementsDe(racine, PREFIXE_DE_LEO);
  const ballon = creerUnGroupe();
  ballon.innerHTML = `<ellipse class="ombre" fill="#15502B" opacity=".25"/><g class="echelle">${DESSIN_DU_BALLON}</g>`;
  n("ballon-couche").replaceChildren(ballon);
  const echelle = trouver(ballon, ".echelle"), ombre = trouver(ballon, ".ombre");

  function dessiner(t: number) {
    const b = etatDuBallon(t), k = R_BALLON / 16, h = Math.max(0, Y_SOL_BALLON - b.y);
    deplacer(ballon, `translate(${r1(b.x)} ${r1(b.y)})`);
    deplacer(echelle, `scale(${r3(k * b.sx)} ${r3(k * b.sy)}) rotate(${r1(b.rot)})`);
    poser(ombre, "cx", 0);
    poser(ombre, "cy", r1(SOL - b.y));
    poser(ombre, "rx", r1(Math.max(3.5, R_BALLON - h * .12)));
    poser(ombre, "ry", 2.2);
    poser(ombre, "opacity", r3(Math.max(.08, .25 - h * .004)));
  }

  return { dessiner };
}

/** Le petit poteau, qui vibre un peu quand le ballon le touche, et le coin d'herbe : présents le temps de la scène seulement. */
export function creerLePoteau(racine: SVGSVGElement) {
  const n = elementsDe(racine, PREFIXE_DE_LEO);

  function dessiner(t: number) {
    const s = t - T_IMPACT, vibre = s > 0 && s < .35 ? Math.sin(s * 44) * Math.exp(-8 * s) * 2.2 : 0;
    deplacer(n("poteau-corps"), `translate(${r1(X_POTEAU + vibre)} 75)`);
    const presence = r3(fenetre(t, 0, .12) * (1 - fenetre(t, 1.3, .2, E.douce)));
    poser(n("sol"), "opacity", presence);
    poser(n("poteau"), "opacity", presence);
  }

  return { dessiner };
}

/** La petite bulle écrite « oh ! » : un instant, quand le ballon touche le poteau. Décor du dessin, jamais lue. Rien quand le dessin n'en porte pas. */
export function creerLaBulleEcrite(racine: SVGSVGElement) {
  if (!racine.querySelector(`#${PREFIXE_DE_LEO}-oh`)) return undefined;
  const n = elementsDe(racine, PREFIXE_DE_LEO);

  function dessiner(t: number) {
    const entree = fenetre(t, .5, .16, E.rebond), sortie = fenetre(t, .92, .12, E.entree);
    poser(n("oh"), "opacity", r3(fenetre(t, .5, .06) * (1 - sortie)));
    deplacer(n("oh-corps"), `translate(51 -103) scale(${r3((.4 + .6 * entree) * 1.15)})`);
  }

  return { dessiner };
}
