import { DEG, E, lerp, r1, r3 } from "../commun/courbes.ts";
import { creerUnGroupe, deplacer, elementsDe, poser, trouver } from "../commun/dom.ts";
import { type Expression, expressionA } from "../commun/expressions.ts";
import type { CoteDeMain, PoseDeMain } from "../commun/mains.ts";
import { decaler, membre, type Point, trace } from "../commun/membres.ts";
import { clignement } from "../commun/visage.ts";
import { dessinDuBras, MAINS, STRUCTURE_DE_NOISETTE } from "./dessin-de-noisette.ts";
import { BATTEMENT_DU_JONGLAGE, type Emotion, type Pose, poseA, SOL_Y, type ScenarioDesAnimaux } from "./poses.ts";
import { creerLaQueue } from "./queue.ts";

export const ECHELLE_DE_BASE = 1.35;
const BASE = ECHELLE_DE_BASE;
type Cote = "g" | "d";
const AMPLITUDE_DU_JONGLAGE = 14;

/** Pour chaque expression : le décalage et l'inclinaison des sourcils, la paupière (0 ouverte) et la taille de la pupille. */
const EMOS: Record<Emotion, { readonly s: readonly [number, number]; readonly lid: number; readonly pup: number }> = {
  sourire: { s: [0, 0], lid: 0, pup: 1 },
  joie: { s: [-4, 0], lid: 0, pup: 1.05 },
  concentration: { s: [2, 10], lid: .3, pup: 1 },
  surprise: { s: [-7, -4], lid: 0, pup: .85 },
  pleines: { s: [-2, 0], lid: 0, pup: 1 },
  croque: { s: [-1, 2], lid: .15, pup: 1 },
};
const EMOTIONS_AVEC_DENTS: readonly Emotion[] = ["sourire", "joie", "pleines"];

/** Ce que le moteur apprend de l'image dessinée : la pose, et où sont les mains et la bouche dans la scène (les effets s'y accrochent). */
export type Dessin = { readonly pose: Pose; readonly mains: Record<Cote, Point>; readonly bouche: Point };

/** Un point du dessin de Noisette, dans le repère de la scène (le groupe de Noisette est placé, tourné et étiré selon sa pose). */
function dansLaScene(p: Pose, local: Point): Point {
  const x = local.x * BASE * p.sx, y = local.y * BASE * p.sy, a = p.rot * DEG;
  return { x: p.x + x * Math.cos(a) - y * Math.sin(a), y: p.y + x * Math.sin(a) + y * Math.cos(a) };
}

/** Le mouvement des mains qui lancent et rattrapent les noisettes du jonglage. */
function elanDuJonglage(scenario: ScenarioDesAnimaux, t: number, p: Pose): number {
  if (scenario.tJongle === null || p.bras < .5) return 0;
  return Math.sin((t - scenario.tJongle) / BATTEMENT_DU_JONGLAGE * Math.PI) * AMPLITUDE_DU_JONGLAGE;
}

/** Noisette, dessinée image par image à partir des poses du scénario (portage du moteur de la maquette). */
export function creerNoisette(racine: SVGSVGElement) {
  const n = elementsDe(racine, "animaux");
  n("noisette").innerHTML = STRUCTURE_DE_NOISETTE;
  const bras = { g: creerLeBras("g"), d: creerLeBras("d") };
  const bouches = [...n("bouche").children];
  const queue = creerLaQueue(racine);
  const q1 = (g: ParentNode, classe: string) => trouver(g, `.${classe}`);

  function creerLeBras(c: Cote): SVGElement {
    const enveloppe = creerUnGroupe();
    enveloppe.innerHTML = dessinDuBras(c);
    const b = enveloppe.firstElementChild;
    if (!(b instanceof SVGElement)) throw new Error("Le bras de Noisette n'a pas pu être dessiné");
    return b;
  }

  /** Dessine un bras et rend la position du poignet, dans le repère de Noisette. */
  function dessinerLeBras(g: SVGElement, c: Cote, S: Point, a1: number, a2: number, pose: number): Point {
    const m = membre(S, a1, a2, 20, 17);
    poser(q1(g, "contour"), "d", trace(m, .06, 1));
    poser(q1(g, "rempli"), "d", trace(m, 0, 1));
    poser(q1(g, "ombre"), "d", trace(decaler(m, 3.4, 1.4), .25, .92));
    poser(q1(g, "lumiere"), "d", trace(decaler(m, -3.4, -1.4), .2, .85));
    const mainG = trouver(g, `#animaux-main-${c}`);
    deplacer(mainG, `translate(${r1(m.W.x)} ${r1(m.W.y)}) rotate(${r1(m.dir)}) scale(.82)`);
    const versCentre = c === "g" ? 1 : -1, score = Math.cos(m.dir * DEG) * versCentre - Math.sin(m.dir * DEG) * .8;
    const cote: CoteDeMain = score > 0 ? "miroir" : "droit";
    const cle = cote + pose, emplacement = mainG.firstElementChild;
    if (emplacement instanceof SVGElement && emplacement.dataset["pose"] !== cle) {
      emplacement.innerHTML = MAINS[cote][pose as PoseDeMain] ?? "";
      emplacement.dataset["pose"] = cle;
    }
    return m.W;
  }

  function dessinerLaTete(p: Pose, ex: Expression<Emotion>, lidBase: number, pup: number) {
    const v = p.vue, dx = v * 10, k = 1 - Math.abs(v) * .18;
    deplacer(n("oreille-g"), `translate(${r1(-30 + dx * 1.4)} -34) rotate(${r1(-14 + v * 10)}) scale(${r3(1 + Math.min(0, v) * .25)} 1)`);
    deplacer(n("oreille-d"), `translate(${r1(30 + dx * 1.4)} -34) rotate(${r1(14 + v * 10)}) scale(${r3(1 - Math.max(0, v) * .25)} 1)`);
    deplacer(n("bande"), `translate(${r1(dx * .8)} 0)`);
    // joues rebondies, gonflées par `joues` ; la joue loin de la caméra se cache un peu
    const jo = 1 + Math.min(p.joues, 1.3) * .38;
    deplacer(n("joue-g"), `translate(${r1(-24 + dx * 1.6 - p.joues * 3)} ${r1(13 + p.joues * 1.5)}) scale(${r3(jo * (1 + Math.min(0, v) * .2))} ${r3(jo)})`);
    deplacer(n("joue-d"), `translate(${r1(24 + dx * 1.6 + p.joues * 3)} ${r1(13 + p.joues * 1.5)}) scale(${r3(jo * (1 - Math.max(0, v) * .2))} ${r3(jo)})`);
    deplacer(n("museau"), `translate(${r1(dx * 1.8)} 14) scale(${r3(k)} 1)`);
    deplacer(n("nez"), `translate(${r1(dx * 1.9)} 4)`);
    deplacer(n("bouche"), `translate(${r1(dx * 1.8)} 17)`);
    const A = EMOS[ex.prec], B = EMOS[ex.emo], u = ex.u;
    const sourcils = [lerp(A.s[0], B.s[0], u), lerp(A.s[1], B.s[1], u)] as const;
    for (const m of bouches) {
      const e = m.getAttribute("data-emo");
      poser(m, "opacity", e === ex.emo ? u : e === ex.prec ? 1 - u : 0);
      if (e === ex.emo) deplacer(m, `scale(${r3(lerp(.7, 1, E.retour(u)))})`);
    }
    poser(n("dents"), "opacity", EMOTIONS_AVEC_DENTS.includes(ex.emo) ? 1 : 0);
    deplacer(n("dents"), `translate(${r1(dx * 1.8)} 17.5) scale(1 .8)`);
    for (const [c, sg, lidExtra] of [["g", -1, 0], ["d", 1, p.clin]] as const) {
      const x = sg * 16 + dx * 1.5, kx = 1 - Math.abs(v) * (sg * v > 0 ? .05 : .22);
      deplacer(n(`oeil-${c}`), `translate(${r1(x)} -9) scale(${r3(kx)} 1)`);
      deplacer(n(`sourcil-${c}`), `translate(${r1(x)} ${r1(-27 + sourcils[0])}) scale(${r3(kx)} 1) rotate(${r1(sourcils[1] * sg)})`);
      deplacer(n(`paupiere-${c}`), `translate(0 ${r1(-23 * (1 - Math.max(lidBase, lidExtra)))})`);
      deplacer(n(`regard-${c}`), `translate(${r1(p.regardX + v * 2 - .5 * (pup - 1))} ${r1(p.regardY - 2.5 * (pup - 1))}) scale(${pup})`);
    }
  }

  /** Dessine Noisette à l'instant `t` du scénario ; `yeuxOuverts` écarte le clignement (image fixe). */
  function dessiner(scenario: ScenarioDesAnimaux, t: number, { yeuxOuverts = false } = {}): Dessin {
    const p = poseA(scenario.poses, t), pAvant = poseA(scenario.poses, t - .06);
    deplacer(n("noisette"), `translate(${r1(p.x)} ${r1(p.y)}) rotate(${r1(p.rot)}) scale(${r3(BASE * p.sx)} ${r3(BASE * p.sy)})`);
    queue.dessiner(p, t, (p.x - pAvant.x) / .06, (p.y - pAvant.y) / .06);
    // corps légèrement tourné : ventre et pieds décalés
    deplacer(n("ventre"), `translate(${r1(p.vue * 6)} 0)`);
    deplacer(n("pied-g"), `translate(${r1(p.vue * 4)} 0)`);
    deplacer(n("pied-d"), `translate(${r1(p.vue * 4)} 0)`);
    // bras courts et dodus ; le bras loin de la caméra passe derrière le corps
    const elan = elanDuJonglage(scenario, t, p);
    const dessinerLeBrasDe = (c: Cote): Point => {
      const cote = c === "g" ? -1 : 1, signe = c === "g" ? 1 : -1;
      const derriere = p.vue * cote < -.3, cible = derriere ? n("bras-arriere") : n("bras-avant");
      if (bras[c].parentNode !== cible) cible.append(bras[c]);
      const epaule = { x: cote * 30 + p.vue * 8, y: -70 };
      const a1 = (c === "g" ? p.aGu : -p.aDu) + signe * elan * .9, a2 = (c === "g" ? p.aGl : -p.aDl) - signe * elan * 1.4;
      return dansLaScene(p, dessinerLeBras(bras[c], c, epaule, a1, a2, elan ? 0 : Math.round(c === "g" ? p.mG : p.mD)));
    };
    const mains = { g: dessinerLeBrasDe("g"), d: dessinerLeBrasDe("d") };
    deplacer(n("tete"), `translate(${r1(p.vue * 4)} -118) rotate(${r1(p.tete)})`);
    const ex = expressionA(scenario.expressions, t), A = EMOS[ex.prec], B = EMOS[ex.emo], u = ex.u;
    dessinerLaTete(p, ex, Math.max(lerp(A.lid, B.lid, u), p.lid, yeuxOuverts ? 0 : clignement(t)), lerp(A.pup, B.pup, u));
    // ombre au sol
    const haut = Math.max(0, SOL_Y - p.y);
    poser(n("ombre-sol"), "cx", r1(p.x));
    poser(n("ombre-sol"), "rx", r1(46 + haut * .3));
    poser(n("ombre-sol"), "opacity", r3(Math.max(.1, .28 - haut * .004)));
    return { pose: p, mains, bouche: { x: p.x + (p.vue * 4 + p.vue * 18) * BASE, y: p.y + (-118 + 16) * BASE * p.sy } };
  }

  return { dessiner };
}
