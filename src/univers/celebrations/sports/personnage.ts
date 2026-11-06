import type { CleDeTenue } from "@domain/motivation";
import { habillerLeCorpsArticule } from "../commun/habiller.ts";
import { clamp01, DEG, E, lerp, r1, r3 } from "../commun/courbes.ts";
import { creerUnGroupe, type PrefixeDeScene, deplacer, elementsDe, poser, trouver } from "../commun/dom.ts";
import { type Expression, expressionA } from "../commun/expressions.ts";
import { decaler, membre, type Point, trace } from "../commun/membres.ts";
import { inclinaisonDuProfilDeLeoOuDesBottes, placerLaChaussure } from "../commun/chaussure.ts";
import type { CoteDeMain, PoseDeMain } from "../commun/mains.ts";
import { clignement, RAYON_DE_LA_TETE as R, traitDuVisage } from "../commun/visage.ts";
import { dessinDuBras, MAINS, structureDeCoachLeo } from "./dessin-du-personnage.ts";
import { type Emotion, type Pose, poseA, type ScenarioDeBut } from "./poses.ts";

const BASE = .8;
export const ECHELLE_DE_BASE = BASE;

type Emotions = Record<Emotion, { sg: readonly [number, number]; sd: readonly [number, number]; lid: number; pup: number }>;

const EMOS: Emotions = {
  concentration: { sg: [2, 10], sd: [2, -10], lid: .3, pup: 1 },
  surprise: { sg: [-7, -6], sd: [-7, 6], lid: 0, pup: .85 },
  joie: { sg: [-5, -4], sd: [-5, 4], lid: 0, pup: 1.05 },
  sourire: { sg: [-3, -3], sd: [-3, 3], lid: 0, pup: 1 },
};

/** Ce qui change d'une scène à l'autre pour un même Coach Léo : le préfixe de ses identifiants, sa taille et ses expressions. */
export type ReglagesDeCoachLeo = { readonly prefixe: PrefixeDeScene; readonly echelle: number; readonly emotions: Emotions };

export const REGLAGES_DE_LA_CELEBRATION: ReglagesDeCoachLeo = { prefixe: "sports", echelle: BASE, emotions: EMOS };

/** Ce que Coach Léo joue : des poses et des expressions dans le temps. */
type PosesEtExpressions = Pick<ScenarioDeBut, "poses" | "expressions">;

/** Coach Léo, dessiné image par image à partir des poses du scénario (portage du moteur des maquettes). */
export function creerCoachLeo(racine: SVGSVGElement, tenue?: CleDeTenue, { prefixe, echelle, emotions }: ReglagesDeCoachLeo = REGLAGES_DE_LA_CELEBRATION) {
  const n = elementsDe(racine, prefixe);
  n("leo").innerHTML = structureDeCoachLeo(prefixe);
  const habit = habillerLeCorpsArticule(n, n("leo"), "sports", tenue, prefixe);
  const bras = { g: creerLeBras("g"), d: creerLeBras("d") };
  const bouches = [...n("bouches").children];
  const q1 = (g: ParentNode, classe: string) => trouver(g, `.${classe}`);
  let vueCourante = 0;

  function creerLeBras(c: "g" | "d"): SVGElement {
    const enveloppe = creerUnGroupe();
    enveloppe.innerHTML = dessinDuBras(c, prefixe);
    const b = enveloppe.firstElementChild;
    if (!(b instanceof SVGElement)) throw new Error("Le bras de Coach Léo n'a pas pu être dessiné");
    return b;
  }

  function dessinerLeBras(g: SVGElement, c: "g" | "d", S: Point, a1: number, a2: number, pose: number) {
    const m = membre(S, a1, a2, 24, 22);
    poser(q1(g, "manche-contour"), "d", trace(m, .04, .3, 3));
    poser(q1(g, "contour"), "d", trace(m, .09, 1));
    poser(q1(g, "rempli"), "d", trace(m, 0, 1));
    poser(q1(g, "manche"), "d", trace(m, 0, .3, 3));
    poser(q1(g, "manche-bord"), "d", trace(m, .27, .3, 1));
    poser(q1(g, "ombre"), "d", trace(decaler(m, 3.2, 1.4), .32, .92));
    poser(q1(g, "lumiere"), "d", trace(decaler(m, -3.2, -1.4), .34, .9));
    poser(q1(g, "manche-ombre"), "d", trace(decaler(m, 4, 1), .04, .26, 2));
    const mainG = trouver(g, `#${prefixe}-main-${c}`);
    deplacer(mainG, `translate(${r1(m.W.x)} ${r1(m.W.y)}) rotate(${r1(m.dir)}) scale(.86)`);
    const versCentre = c === "g" ? 1 : -1, score = Math.cos(m.dir * DEG) * versCentre - Math.sin(m.dir * DEG) * .8;
    const cote: CoteDeMain = score > 0 ? "miroir" : "droit";
    const cle = cote + pose, emplacement = mainG.firstElementChild;
    if (emplacement instanceof SVGElement && emplacement.dataset["pose"] !== cle) {
      emplacement.innerHTML = MAINS[cote][pose as PoseDeMain] ?? "";
      emplacement.dataset["pose"] = cle;
    }
  }

  function dessinerLaJambe(g: SVGElement, c: "g" | "d", S: Point, a1: number, a2: number, f: number, sw: number, ft: number) {
    const m = membre(S, a1, a2, 28 * f, 26 * f * ft);
    poser(q1(g, "contour"), "d", trace(m, .06, 1));
    poser(q1(g, "rempli"), "d", trace(m, 0, 1));
    poser(q1(g, "ombre"), "d", trace(decaler(m, 3.4, 1.2), .3, .72));
    poser(q1(g, "lumiere"), "d", trace(decaler(m, -3.4, -1.2), .3, .7));
    poser(q1(g, "chaussette"), "d", trace(m, .5, 1, 5));
    poser(q1(g, "chaussette-bord"), "d", trace(m, .54, .59, 1));
    poser(q1(g, "chaussette-bord2"), "d", trace(m, .62, .65, 1));
    poser(q1(g, "chaussette-ombre"), "d", trace(decaler(m, 3.6, 1), .6, .95, 3));
    // chaussure de foot : vue de face, de profil ou semelle (pied levé), fondues selon la vue et l'angle du tibia
    const ch = n(`chaussure-${c}`), profilF = clamp01((Math.abs(Math.sin(vueCourante * DEG)) - .45) * 6), versCam = Math.cos(vueCourante * DEG) < 0 ? -1 : 1;
    const { face, leve, sens } = placerLaChaussure(g, ch, m, { cote: c, tibia: ft, sw, profil: profilF, inclinaisonDuProfil: inclinaisonDuProfilDeLeoOuDesBottes(tenue === "bottes-de-pluie") });
    poser(q1(face, "devant"), "opacity", versCam > 0 ? 1 : 0);
    poser(q1(face, "talon"), "opacity", versCam > 0 ? 0 : 1);
    const contact = q1(ch, "contact");
    poser(contact, "opacity", r3((1 - leve) * .25));
    deplacer(contact, `translate(${r1(profilF * sens * 5)} 12) scale(${r3(1 + profilF * .5)} 1)`);
  }

  function dessinerLaTete(p: Pose, meche: number, ex: Expression<Emotion>, lidBase: number, pup: number) {
    const w = p.vue, cw = Math.cos(w * DEG);
    for (const [id, alpha] of [["oreille-g", -90], ["oreille-d", 90]] as const) {
      const o = traitDuVisage(alpha, w, R);
      poser(n(id), "opacity", o.z > -.12 ? 1 : 0);
      deplacer(n(id), `translate(${r1(o.x)} 3)`);
    }
    poser(n("tete-ombre"), "d", `M8 27 A28 28 0 0 0 27 -6 A23 23 0 0 1 8 27 Z`);
    const A = emotions[ex.prec], B = emotions[ex.emo], u = ex.u;
    const sg = A.sg.map((v, i) => lerp(v, B.sg[i] ?? v, u)), sd = A.sd.map((v, i) => lerp(v, B.sd[i] ?? v, u));
    for (const [c, alpha, s, lidExtra] of [["g", -27, sg, 0], ["d", 27, sd, p.clin]] as const) {
      const o = traitDuVisage(alpha, w, R * .88), visible = o.z > .06, kx = Math.max(.3, Math.pow(Math.max(0, o.z), .6));
      poser(n(`oeil-${c}`), "opacity", visible ? 1 : 0);
      poser(n(`sourcil-${c}`), "opacity", visible ? 1 : 0);
      deplacer(n(`oeil-${c}`), `translate(${r1(o.x)} -5) scale(${r3(kx)} 1)`);
      deplacer(n(`sourcil-${c}`), `translate(${r1(o.x)} ${r1(-18 + (s[0] ?? 0))}) scale(${r3(kx)} 1) rotate(${r1(s[1] ?? 0)})`);
      deplacer(n(`paupiere-${c}`), `translate(0 ${r1(-21 * (1 - Math.max(lidBase, lidExtra)))})`);
      deplacer(n(`regard-${c}`), `translate(${r1(-(.5) * (pup - 1))} ${r1(-2.5 * (pup - 1))}) scale(${pup})`);
      const j = traitDuVisage(alpha * 1.8, w, R * .78);
      poser(n(`joue-${c}`), "opacity", j.z > .1 ? 1 : 0);
      deplacer(n(`joue-${c}`), `translate(${r1(j.x)} 8) scale(${r3(Math.max(.3, j.z))} 1)`);
    }
    const nez = traitDuVisage(0, w, R * .9);
    poser(n("nez"), "opacity", nez.z > -.05 ? 1 : 0);
    deplacer(n("nez"), `translate(${r1(nez.x + (nez.z < .3 ? 3 * Math.sign(Math.sin(w * DEG) || 1) : 0))} 0)`);
    const b = traitDuVisage(0, w, R * .7);
    poser(n("bouche"), "opacity", b.z > .05 ? 1 : 0);
    deplacer(n("bouche"), `translate(${r1(b.x)} -1) scale(${r3(Math.max(.3, b.z))} 1)`);
    for (const m of bouches) {
      const e = m.getAttribute("data-emo");
      poser(m, "opacity", e === ex.emo ? u : e === ex.prec ? 1 - u : 0);
      if (e === ex.emo) deplacer(m, `scale(${r3(lerp(.7, 1, E.retour(u)))})`);
    }
    // coiffure : ligne de cheveux basse derrière, haute devant, mèches qui rebondissent
    const sw = Math.sin(w * DEG), dosA = (1 - cw) / 2, yC = lerp(-17, 15, dosA), pente = (15 - -17) / 2, ondul = lerp(3, 1.2, dosA), cote = lerp(5, 13, dosA);
    let d = "";
    for (let i = 0; i <= 12; i++) {
      const x = -R - 1 + (2 * R + 2) * i / 12;
      const y = yC - (x / R) * sw * pente + ondul * Math.sin(i * 1.9 + .4) - (Math.abs(x) > R * .72 ? cote : 0);
      d += `${i ? "L" : "M"}${r1(x)} ${r1(y)}`;
    }
    d += ` Q${R + 4} -14 ${R - 10} -25 Q0 -37 ${-R + 10} -25 Q${-R - 4} -14 ${-R - 1} ${r1(yC + sw * pente - cote)} Z`;
    poser(n("cheveux-forme"), "d", d);
    const dos = clamp01(-cw);
    poser(n("nuque-ombre"), "d", `M${-R + 2} ${r1(yC - 2)} Q0 ${r1(yC + 10)} ${R - 2} ${r1(yC - 2)} Q0 ${r1(yC + 4)} ${-R + 2} ${r1(yC - 2)} Z`);
    poser(n("nuque-ombre"), "opacity", r3(dos * .8));
    poser(n("cheveux-lumiere"), "d", `M${r1(-16 + 6 * sw)} -22 Q${r1(-4 + 6 * sw)} -29 ${r1(8 + 6 * sw)} -26`);
    deplacer(n("meches"), `rotate(${r1(meche)} ${r1(6 * sw)} -26)`);
    poser(n("meche-1"), "d", `M${r1(-12 + 8 * sw)} -25 Q${r1(-16 + 8 * sw)} -39 ${r1(-2 + 10 * sw)} -36 Q${r1(-4 + 8 * sw)} -31 ${r1(2 + 8 * sw)} -27 Z`);
    poser(n("meche-2"), "d", `M${r1(0 + 8 * sw)} -27 Q${r1(6 + 10 * sw)} -41 ${r1(16 + 8 * sw)} -34 Q${r1(10 + 8 * sw)} -33 ${r1(10 + 8 * sw)} -26 Z`);
    poser(n("epi"), "d", `M${r1(-4 - 6 * sw)} -29 Q${r1(-14 - 8 * sw)} -42 ${r1(-18 - 6 * sw)} -31 Q${r1(-12 - 6 * sw)} -32 ${r1(-10 - 6 * sw)} -27 Z`);
    poser(n("meche-3"), "d", `M${r1(10 + 6 * sw)} -25 Q${r1(22 + 8 * sw)} -36 ${r1(24 + 4 * sw)} -22 Q${r1(18 + 4 * sw)} -24 ${r1(14 + 6 * sw)} -20 Z`);
  }

  /** Dessine Coach Léo à l'instant `t` du scénario et rend sa pose (les effets s'y accrochent). */
  function dessiner(scenario: PosesEtExpressions, t: number): Pose {
    const p = poseA(scenario.poses, t);
    vueCourante = p.vue;
    const pAvant = poseA(scenario.poses, t - .06);
    const meche = Math.max(-22, Math.min(22, (p.y - pAvant.y) * 1.1 + (p.x - pAvant.x) * .5));
    let { lGt, lGs, lDt, lDs, fG, fD, y } = p;
    if (p.course > 0) {
      const ph = t * Math.PI * 2 * 3.4, a = Math.max(0, Math.sin(ph)), b = Math.max(0, -Math.sin(ph));
      fG = lerp(fG, 1 - .4 * a, p.course);
      fD = lerp(fD, 1 - .4 * b, p.course);
      lGs = lerp(lGs, 64 * a, p.course);
      lDs = lerp(lDs, -64 * b, p.course);
      lGt = lerp(lGt, 10 - 6 * a, p.course);
      lDt = lerp(lDt, -10 + 6 * b, p.course);
      y -= 5 * Math.abs(Math.sin(ph)) * p.course;
    }
    const w = p.vue, cw = Math.cos(w * DEG), sw = Math.sin(w * DEG), wf = lerp(.55, 1, Math.abs(cw));
    deplacer(n("leo"), `translate(${r1(p.x)} ${r1(y)}) rotate(${r1(p.rot)}) scale(${r3(p.s * echelle * p.sx)} ${r3(p.s * echelle * p.sy)})`);
    const sh = 18 * wf, hp = 22 * wf, torse = n("torse"), short = n("short");
    poser(q1(torse, "forme"), "d", `M${r1(-sh)} -40 Q${r1(-sh - 6)} -12 ${r1(-hp)} 6 Q0 14 ${r1(hp)} 6 Q${r1(sh + 6)} -12 ${r1(sh)} -40 Q0 -47 ${r1(-sh)} -40 Z`);
    poser(q1(torse, "ombre"), "d", `M${r1(sh * .3)} -42 Q${r1(sh + 3)} -30 ${r1(hp)} 4 Q${r1(hp * .6)} 10 ${r1(hp * .35)} 9 Q${r1(sh + 1)} -20 ${r1(sh * .3)} -42 Z`);
    poser(q1(torse, "lumiere"), "d", `M${r1(-sh * .9)} -36 Q${r1(-sh * .4)} -42 ${r1(sh * .1)} -40 Q${r1(-sh * .4)} -37 ${r1(-sh * .8)} -30 Z`);
    poser(q1(torse, "col"), "d", cw > .2 ? `M-7 -44 L0 -35 L7 -44` : `M-8 -43 Q0 -39 8 -43`);
    const badge = q1(torse, "badge");
    poser(badge, "opacity", cw > .3 ? 1 : 0);
    deplacer(badge, `translate(${r1(-9 * cw + 4 * sw)} -24)`);
    poser(q1(short, "forme"), "d", `M${r1(-hp - 1)} -4 Q0 2 ${r1(hp + 1)} -4 L${r1(hp + 4)} 16 Q${r1(hp * .5)} 20 ${r1(hp * .1)} 18 Q0 14 ${r1(-hp * .1)} 18 Q${r1(-hp * .5)} 20 ${r1(-hp - 4)} 16 Z`);
    poser(q1(short, "ombre"), "d", `M${r1(hp * .2)} 8 Q${r1(hp + 1)} 0 ${r1(hp + 2)} 14 Q${r1(hp * .6)} 18 ${r1(hp * .15)} 17 Z`);
    poser(q1(short, "bande"), "d", `M${r1(-hp - 2)} 0 L${r1(-hp - 3)} 14 M${r1(hp + 2)} 0 L${r1(hp + 3)} 14`);
    deplacer(n("haut"), `rotate(${r1(p.torse)})`);
    habit.suivre({ cw, sw, torse: p.torse });
    dessinerLaJambe(n("jambe-g"), "g", { x: -10 * wf, y: 4 }, lGt, lGs, fG, sw, p.tG);
    dessinerLaJambe(n("jambe-d"), "d", { x: 10 * wf, y: 4 }, lDt, lDs, fD, sw, p.tD);
    // le bras loin derrière le torse, le bras proche devant ; les deux devant la tête si « devant »
    const proche = sw > .05 ? "d" : "g", emplacementAvant = n("bras-avant"), emplacementArriere = n("bras-arriere");
    for (const c of ["g", "d"] as const) {
      const cible = p.devant > .5 ? emplacementAvant : (c === proche || Math.abs(sw) <= .05 ? emplacementAvant : emplacementArriere);
      if (bras[c].parentNode !== cible) cible.append(bras[c]);
      const S = { x: (c === "g" ? -1 : 1) * 18 * wf + 4 * sw, y: -38 };
      dessinerLeBras(bras[c], c, S, c === "g" ? p.aGu : p.aDu, c === "g" ? p.aGl : p.aDl, Math.round(c === "g" ? p.mG : p.mD));
    }
    if (p.devant > .5 && emplacementAvant.firstElementChild !== bras.g) emplacementAvant.prepend(bras.g);
    deplacer(n("tete"), `translate(0 -48) rotate(${r1(p.tete)})`);
    deplacer(n("tete-forme"), `translate(0 -26)`);
    const ex = expressionA(scenario.expressions, t), A = emotions[ex.prec], B = emotions[ex.emo], u = ex.u;
    const lidBase = Math.max(lerp(A.lid, B.lid, u), p.lid, clignement(t));
    dessinerLaTete(p, meche, ex, lidBase, lerp(A.pup, B.pup, u));
    // ombre au sol
    const S = p.s * echelle, sol = p.y + 58 * S, haut = Math.max(0, sol - (y + 58 * S)), ombre = n("ombre-leo");
    poser(ombre, "cx", r1(p.x));
    poser(ombre, "cy", r1(sol + 2));
    poser(ombre, "rx", r1(34 * S + haut * .2));
    poser(ombre, "ry", r1(8 * S));
    poser(ombre, "opacity", r3(Math.max(.07, .25 - haut * .003)));
    return p;
  }

  return { dessiner };
}
