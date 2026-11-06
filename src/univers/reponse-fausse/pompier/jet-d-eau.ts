import { DEG, lerp, r1, r3 } from "../../celebrations/commun/courbes.ts";
import { elementsDe, poser, trouver } from "../../celebrations/commun/dom.ts";
import type { Point } from "../../celebrations/commun/membres.ts";
import type { CapitaineSam, ScenarioDeSam } from "../../celebrations/pompiers/personnage.ts";
import type { Repere } from "../../celebrations/pompiers/repere.ts";
import { PREFIXE_DE_SAM, SOL_DU_CADRE } from "./reglages.ts";
import { T } from "./scenario.ts";

const VITESSE_DE_L_EAU = 3;
const PESANTEUR = 500;
const FORCE = 249;
/** La part de l'arc qui reste un filet continu : au-delà, l'eau n'est faite que de gouttes séparées. */
const PART_DU_FILET = .38;
const NOMBRE_DE_GOUTTES = 7;
const GOUTTE = "M0 -5 Q3.6 -.5 3.6 2.2 A3.6 3.6 0 0 1 -3.6 2.2 Q-3.6 -.5 0 -5 Z";
const POINTS_DU_FILET = 14;
const POINTS_DU_REFLET = 6;
const NOMBRE_D_ECLABOUSSURES = 4;

/** Où part l'eau : la pointe de la lance et son axe (vecteur unitaire), relus dans le repère du dessin. */
type DepartDeLEau = { readonly pointe: Point; readonly ux: number; readonly uy: number };

/**
 * Le jet de la scène : un petit filet bleu clair qui monte au-dessus du casque, puis des gouttes séparées qui retombent loin devant ses bottes,
 * du côté de la fleur ; il se coupe à `T.coupe`. L'arc part de la pointe de la lance, relevée à l'instant où il coupe l'eau.
 */
export function creerLeJet(racine: SVGSVGElement, sam: CapitaineSam, monde: Repere, scenario: ScenarioDeSam) {
  const jet = elementsDe(racine, PREFIXE_DE_SAM)("jet");
  const filetContour = trouver(jet, ".jet-contour"), filetEau = trouver(jet, ".jet-eau"), filetReflet = trouver(jet, ".jet-reflet");
  const gouttes = trouver(jet, ".gouttes"), eclaboussure = trouver(jet, ".eclabousse");
  gouttes.innerHTML = Array.from({ length: NOMBRE_DE_GOUTTES }, () => `<path d="${GOUTTE}"/>`).join("");
  eclaboussure.innerHTML = Array.from({ length: NOMBRE_D_ECLABOUSSURES }, () => `<circle r="2.2"/>`).join("") +
    `<ellipse class="rond" rx="8" ry="2.2" fill="none" stroke="#3C8DDA" stroke-width="1.4"/>`;

  function mesurerLaLance(): DepartDeLEau {
    const pointe = monde(sam.lance.pointe), axe = monde(sam.lance.axe), dx = pointe.x - axe.x, dy = pointe.y - axe.y, longueur = Math.hypot(dx, dy) || 1;
    return { pointe, ux: dx / longueur, uy: dy / longueur };
  }

  sam.dessiner(scenario, T.coupe);
  const departGele = mesurerLaLance();

  function dessinerLEclaboussure(t: number, arrivee: Point) {
    [...eclaboussure.children].forEach((element, i) => {
      if (element.classList.contains("rond")) {
        poser(element, "transform", `translate(${r1(arrivee.x)} ${r1(arrivee.y + 1.5)}) scale(${r3(.8 + .3 * Math.sin(t * 7))} 1)`);
        return;
      }
      const phase = (t * 2.4 + i / NOMBRE_D_ECLABOUSSURES) % 1, sens = i % 2 ? 1 : -1, ecart = (i < 2 ? 9 : 15) * sens;
      poser(element, "transform", `translate(${r1(arrivee.x + ecart * phase)} ${r1(arrivee.y - 10 * 4 * phase * (1 - phase))}) scale(${r3(1 - .4 * phase)})`);
      poser(element, "opacity", r3(1 - phase * phase));
    });
  }

  /** À appeler une fois Sam dessiné à l'instant `t` : la lance lue est celle de l'image. */
  function dessiner(t: number) {
    const tete = Math.max(0, (t - T.jet) * VITESSE_DE_L_EAU), queue = Math.max(0, (t - T.coupe) * VITESSE_DE_L_EAU);
    const depart = t < T.coupe ? mesurerLaLance() : departGele;
    const vx = depart.ux * FORCE, vy = depart.uy * FORCE, hauteur = SOL_DU_CADRE - depart.pointe.y;
    const dureeDeVol = (-vy + Math.sqrt(vy * vy + 2 * PESANTEUR * hauteur)) / PESANTEUR;
    const position = (tau: number): Point => ({ x: depart.pointe.x + vx * tau, y: depart.pointe.y + vy * tau + .5 * PESANTEUR * tau * tau });
    const a = Math.min(dureeDeVol, tete), b = Math.min(dureeDeVol, queue), finDuFilet = PART_DU_FILET * dureeDeVol;
    if (a <= b + .004 || t < T.jet) {
      poser(jet, "opacity", 0);
      return;
    }
    poser(jet, "opacity", 1);
    const fin = Math.min(a, finDuFilet);
    let filet = "", reflet = "";
    if (fin > b + .004) {
      for (let i = 0; i <= POINTS_DU_FILET; i++) {
        const q = position(lerp(b, fin, i / POINTS_DU_FILET));
        filet += `${i ? "L" : "M"}${r1(q.x)} ${r1(q.y)}`;
      }
      for (let i = 0; i <= POINTS_DU_REFLET; i++) {
        const q = position(lerp(b, fin, .05 + i / POINTS_DU_REFLET * .5));
        reflet += `${i ? "L" : "M"}${r1(q.x - .9)} ${r1(q.y - 1)}`;
      }
    }
    for (const element of [filetContour, filetEau]) poser(element, "d", filet);
    poser(filetReflet, "d", reflet);
    [...gouttes.children].forEach((goutte, i) => {
      const tau = lerp(finDuFilet, dureeDeVol, (i / NOMBRE_DE_GOUTTES + t * 1.3) % 1);
      if (tau < b || tau > a) {
        poser(goutte, "opacity", 0);
        return;
      }
      const q = position(tau), suivante = position(tau + .02), angle = Math.atan2(-(suivante.x - q.x), suivante.y - q.y) / DEG;
      poser(goutte, "opacity", 1);
      poser(goutte, "transform", `translate(${r1(q.x)} ${r1(q.y)}) rotate(${r1(angle)}) scale(.85)`);
    });
    const arrivee = position(dureeDeVol), retombee = tete >= dureeDeVol - .002 && b < dureeDeVol - .05;
    poser(eclaboussure, "opacity", retombee ? 1 : 0);
    if (retombee) dessinerLEclaboussure(t, arrivee);
  }

  return { dessiner };
}
