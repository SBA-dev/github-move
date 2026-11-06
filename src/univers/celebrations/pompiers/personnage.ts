import type { CleDeTenue } from "@domain/motivation";
import { habillerLeCorpsArticule } from "../commun/habiller.ts";
import { clamp01, DEG, E, lerp, r1, r3 } from "../commun/courbes.ts";
import { brasVers } from "../commun/atteindre.ts";
import { creerUnGroupe, deplacer, elementsDe, type PrefixeDeScene, poser, trouver } from "../commun/dom.ts";
import { expressionA } from "../commun/expressions.ts";
import { decaler, membre, type Point, trace } from "../commun/membres.ts";
import { inclinaisonDuProfilDeSam, placerLaChaussure } from "../commun/chaussure.ts";
import { au } from "../commun/tableaux.ts";
import { clignement } from "../commun/visage.ts";
import { dessinDuBras, MAINS, structureDeCapitaineSam } from "./dessin-de-sam.ts";
import { ECHELLE_DE_BASE as BASE, type Emotion, LANCE_AU_SOL, type Pose, poseA, type ScenarioDesPompiers, SOL, VUE_MAXIMALE } from "./poses.ts";

const EMOS: Record<Emotion, { readonly s: readonly [number, number]; readonly lid: number; readonly pup: number }> = {
  sourire: { s: [0, 0], lid: 0, pup: 1 },
  joie: { s: [-4, 0], lid: 0, pup: 1.05 },
  concentration: { s: [2, 10], lid: .3, pup: 1 },
  surprise: { s: [-7, -4], lid: 0, pup: .85 },
  coin: { s: [-2, -4], lid: 0, pup: 1 },
  hum: { s: [1, 6], lid: .25, pup: 1 },
};

type Cote = "g" | "d";

/** La main attrape la lance : le poignet s'arrête un peu avant le point saisi (le poing est au bout de l'avant-bras). */
export function brasSaisit(c: Cote, T: Point, S: Point) {
  const dx = T.x - S.x, dy = T.y - S.y, D = Math.hypot(dx, dy) || 1, k = Math.max(0, D - 4) / D;
  return brasVers(c, { x: S.x + dx * k, y: S.y + dy * k }, S);
}

/** Un point de la scène, dans le repère du buste (qui est incliné de `torse`, et écrasé ou étiré par `sx` et `sy`) : pour poser la lance à un endroit précis du sol. */
function versLeBuste(p: Pose, W: Point): Point {
  const dx = (W.x - p.x) / (BASE * p.sx), dy = (W.y - p.y) / (BASE * p.sy), ct = Math.cos(-p.torse * DEG), st = Math.sin(-p.torse * DEG);
  return { x: dx * ct - dy * st, y: dx * st + dy * ct };
}

const poseDeMain = (valeur: number) => Math.max(0, Math.min(3, Math.round(valeur)));

export type DessinDeSam = { readonly pose: Pose };

/** Ce que dessine Capitaine Sam : les poses et les expressions du scénario (la scène de réponse fausse n'a ni cloche, ni jet de la célébration). */
export type ScenarioDeSam = Pick<ScenarioDesPompiers, "poses" | "expressions">;

/**
 * Capitaine Sam, dessiné image par image à partir des poses du scénario (portage du moteur de la maquette : le corps de Coach Léo, la tête et la tenue de Sam).
 * Ses identifiants portent `prefixe` : la célébration des Pompiers ou la scène de réponse fausse.
 */
export function creerCapitaineSam(racine: SVGSVGElement, tenue?: CleDeTenue, prefixe: PrefixeDeScene = "pompier") {
  const n = elementsDe(racine, prefixe);
  n("sam").innerHTML = structureDeCapitaineSam(prefixe);
  const habit = habillerLeCorpsArticule(n, n("sam"), "pompier", tenue, prefixe);
  const bouches = [...n("bouches").children];
  const q1 = (g: ParentNode, classe: string) => trouver(g, `.${classe}`);
  const bras = { g: creerLeBras("g"), d: creerLeBras("d") };
  n("bras-arriere").append(bras.g);
  n("bras-avant").append(bras.d);
  const jambes = { g: n("jambe-g"), d: n("jambe-d") };
  // les bottes de pluie remplacent les bottes noires du pantalon : elles ne se dessinent pas par-dessus
  if (tenue === "bottes-de-pluie") for (const jambe of [jambes.g, jambes.d]) for (const classe of ["botte", "botte-bord"]) poser(q1(jambe, classe), "display", "none");
  const lance = { pointe: q1(n("lance-tenue"), "m-pointe"), axe: q1(n("lance-tenue"), "m-axe"), arriere: q1(n("lance-tenue"), "m-arriere") };
  let vueCourante = 0;

  function creerLeBras(c: Cote): SVGElement {
    const enveloppe = creerUnGroupe();
    enveloppe.innerHTML = dessinDuBras(c, prefixe);
    const b = enveloppe.firstElementChild;
    if (!(b instanceof SVGElement)) throw new Error("Le bras de Capitaine Sam n'a pas pu être dessiné");
    return b;
  }

  function dessinerLeBras(g: SVGElement, c: Cote, S: Point, a1: number, a2: number, pose: number) {
    const m = membre(S, a1, a2, 24, 22);
    poser(q1(g, "contour"), "d", trace(m, .09, 1));
    poser(q1(g, "rempli"), "d", trace(m, 0, 1));
    poser(q1(g, "ombre"), "d", trace(decaler(m, 3.2, 1.4), .9, .97, 2));
    poser(q1(g, "lumiere"), "d", trace(decaler(m, -3.2, -1.4), .9, .96, 2));
    poser(q1(g, "manche-contour"), "d", trace(m, .04, .86, 6));
    poser(q1(g, "manche"), "d", trace(m, 0, .86, 6));
    poser(q1(g, "manche-ombre"), "d", trace(decaler(m, 3.6, 1), .06, .8, 5));
    poser(q1(g, "bande"), "d", trace(m, .5, .6, 2));
    poser(q1(g, "bande-argent"), "d", trace(m, .538, .562, 1));
    poser(q1(g, "manche-bord"), "d", trace(m, .83, .86, 1));
    const mainG = trouver(g, `#${prefixe}-main-${c}`);
    deplacer(mainG, `translate(${r1(m.W.x)} ${r1(m.W.y)}) rotate(${r1(m.dir)}) scale(.86)`);
    const versCentre = c === "g" ? 1 : -1, score = Math.cos(m.dir * DEG) * versCentre - Math.sin(m.dir * DEG) * .8;
    const cote = score > 0 ? "miroir" : "droit", cle = cote + pose, emplacement = q1(mainG, "pose-main");
    if (emplacement.dataset["pose"] !== cle) {
      emplacement.innerHTML = au(MAINS[cote], pose);
      emplacement.dataset["pose"] = cle;
    }
  }

  function dessinerLaJambe(g: SVGElement, c: Cote, S: Point, a1: number, a2: number, f: number, sw: number, ft: number) {
    const m = membre(S, a1, a2, 28 * f, 26 * f * ft);
    poser(q1(g, "contour"), "d", trace(m, .06, 1));
    poser(q1(g, "rempli"), "d", trace(m, 0, 1));
    poser(q1(g, "ombre"), "d", trace(decaler(m, 3.4, 1.2), .3, .72));
    poser(q1(g, "lumiere"), "d", trace(decaler(m, -3.4, -1.2), .3, .7));
    poser(q1(g, "bande"), "d", trace(m, .64, .7, 1));
    poser(q1(g, "botte"), "d", trace(m, .8, 1, 2));
    poser(q1(g, "botte-bord"), "d", trace(m, .8, .815, 1));
    const ch = n(`chaussure-${c}`), profilF = clamp01((Math.abs(Math.sin(vueCourante * DEG)) - .45) / (Math.sin(VUE_MAXIMALE * DEG) - .45));
    placerLaChaussure(g, ch, m, { cote: c, tibia: ft, sw, profil: profilF, inclinaisonDuProfil: inclinaisonDuProfilDeSam });
  }

  /** La tête de Sam (rayon 40 dans son repère, réduite à 28 comme celle de Léo) : de face ou de trois-quarts, jamais de dos. Le casque couvre les cheveux roux : il n'en reste que les tempes et une petite frange sous la visière. */
  function dessinerLaTete(p: Pose, ex: { emo: Emotion; prec: Emotion; u: number }, lidBase: number, pup: number) {
    const v = Math.max(-1, Math.min(1, Math.sin(p.vue * DEG) / Math.sin(VUE_MAXIMALE * DEG))), dx = v * 9;
    deplacer(n("cheveux-fond"), `translate(${r1(-dx * .5)} 0)`);
    for (const [id, sg] of [["oreille-g", -1], ["oreille-d", 1]] as const) {
      poser(n(id), "opacity", sg * v < .5 ? 1 : 0);
      deplacer(n(id), `translate(${r1(sg * 39 + dx * 1.3)} 4) scale(${r3(Math.max(.3, 1 - Math.max(0, sg * v) * .9))} 1)`);
    }
    deplacer(n("joue-g"), `translate(${r1(-22 + dx * 1.5)} 15) scale(${r3(1 + Math.min(0, v) * .25)} 1)`);
    deplacer(n("joue-d"), `translate(${r1(22 + dx * 1.5)} 15) scale(${r3(1 - Math.max(0, v) * .25)} 1)`);
    deplacer(n("nez"), `translate(${r1(dx * 1.7)} 8)`);
    deplacer(n("bouche"), `translate(${r1(dx * 1.6)} 20)`);
    deplacer(n("taches"), `translate(${r1(dx * 1.5)} 0)`);
    const A = EMOS[ex.prec], B = EMOS[ex.emo], u = ex.u, s = [lerp(A.s[0], B.s[0], u), lerp(A.s[1], B.s[1], u)] as const;
    for (const m of bouches) {
      const e = m.getAttribute("data-emo");
      poser(m, "opacity", e === ex.emo ? u : e === ex.prec ? 1 - u : 0);
      if (e === ex.emo) deplacer(m, `scale(${r3(lerp(.7, 1, E.retour(u)))})`);
    }
    for (const [c, sg, lidExtra] of [["g", -1, 0], ["d", 1, p.clin]] as const) {
      const x = sg * 12 + dx * 1.1, kx = 1 - Math.abs(v) * (sg * v > 0 ? .05 : .22);
      deplacer(n(`oeil-${c}`), `translate(${r1(x)} 0) scale(${r3(kx)} 1)`);
      deplacer(n(`sourcil-${c}`), `translate(${r1(x * 1.3)} ${r1(-17 + s[0])}) scale(${r3(kx)} 1) rotate(${r1(s[1] * sg)})`);
      deplacer(n(`paupiere-${c}`), `translate(0 ${r1(-21 * (1 - Math.max(lidBase, lidExtra)))})`);
      deplacer(n(`regard-${c}`), `translate(${r1(p.regardX * .8 + v * 1.6 - .5 * (pup - 1))} ${r1(p.regardY * .8 - 2.5 * (pup - 1))}) scale(${pup})`);
    }
    const fx = dx * .6, f = dx * 1.2;
    poser(n("cheveux-forme"), "d", [-1, 1].map((k) => `M${r1(k * 43 + fx)} -30 Q${r1(k * 46 + fx)} -15 ${r1(k * 39 + fx)} -8 Q${r1(k * 34 + fx)} -10 ${r1(k * 32 + fx)} -18 Q${r1(k * 30 + fx)} -24 ${r1(k * 30 + fx)} -30 Z`).join(" "));
    poser(n("cheveux-lumiere"), "d", `M${r1(-37 + fx)} -10 Q${r1(-37 + fx)} -20 ${r1(-34 + fx)} -26`);
    poser(n("frange"), "d", `M${r1(-22 + f)} -31 Q${r1(-20 + f)} -21 ${r1(-13 + f)} -24 Q${r1(-9 + f)} -18 ${r1(-3 + f)} -24 Q${r1(2 + f)} -19 ${r1(7 + f)} -25 Q${r1(13 + f)} -21 ${r1(16 + f)} -30 Z`);
    deplacer(n("casque"), `translate(${r1(dx * .8)} 0) rotate(${r1(v * 5)})`);
    deplacer(q1(n("casque"), "ecusson"), `translate(${r1(dx * 1.1)} 0) scale(${r3(1 - Math.abs(v) * .25)} 1)`);
    deplacer(q1(n("casque"), "crete"), `translate(${r1(dx * .9)} 0)`);
    poser(q1(n("casque"), "visiere"), "d", `M-47 -30 Q${r1(v * 22)} -44 47 -30 Q${r1(v * 26)} -22 -47 -30 Z`);
  }

  /** Le buste en poire de Léo : la veste rouge, la bande réfléchissante en bas, la fermeture et le col montant ; le bassin étroit, d'où partent les deux tubes de pantalon. */
  function dessinerLeBuste(wf: number, sw: number) {
    const sh = 18 * wf, hp = 21 * wf, torse = n("torse"), bassin = n("bassin"), hb = hp * .98 + 1;
    poser(q1(torse, "forme"), "d", `M${r1(-sh)} -40 Q${r1(-sh - 6)} -12 ${r1(-hp - 1)} 4 Q0 8 ${r1(hp + 1)} 4 Q${r1(sh + 6)} -12 ${r1(sh)} -40 Q0 -47 ${r1(-sh)} -40 Z`);
    poser(q1(torse, "ombre"), "d", `M${r1(sh * .3)} -42 Q${r1(sh + 3)} -30 ${r1(hp + 1)} 3 Q${r1(hp * .6)} 6 ${r1(hp * .35)} 5 Q${r1(sh + 1)} -20 ${r1(sh * .3)} -42 Z`);
    poser(q1(torse, "lumiere"), "d", `M${r1(-sh * .9)} -36 Q${r1(-sh * .4)} -42 ${r1(sh * .1)} -40 Q${r1(-sh * .4)} -37 ${r1(-sh * .8)} -30 Z`);
    poser(q1(torse, "bande"), "d", `M${r1(-hb)} -7 Q0 -4 ${r1(hb)} -7 L${r1(hb + .6)} 0 Q0 3.6 ${r1(-hb - .6)} 0 Z`);
    poser(q1(torse, "bande-argent"), "d", `M${r1(-hb + 1)} -3.6 Q0 -.4 ${r1(hb - 1)} -3.6`);
    poser(q1(torse, "fermeture"), "d", `M${r1(4 * sw)} -42 V-8 M${r1(4 * sw)} 1 V5`);
    deplacer(q1(torse, "tirette"), `translate(${r1(4 * sw)} -30)`);
    poser(n("col"), "d", `M${r1(-8 + 3 * sw)} -51 Q${r1(3 * sw)} -54 ${r1(8 + 3 * sw)} -51 L${r1(9 + 3 * sw)} -42 Q${r1(3 * sw)} -38 ${r1(-9 + 3 * sw)} -42 Z`);
    poser(q1(bassin, "forme"), "d", `M${r1(-hp - 1)} -1 Q0 2 ${r1(hp + 1)} -1 L${r1(hp + 2)} 12 Q${r1(hp * .5)} 15 ${r1(hp * .12)} 11 Q0 8 ${r1(-hp * .12)} 11 Q${r1(-hp * .5)} 15 ${r1(-hp - 2)} 12 Z`);
    poser(q1(bassin, "ombre"), "d", `M${r1(hp * .2)} 5 Q${r1(hp + 1)} 0 ${r1(hp + 2)} 12 Q${r1(hp * .6)} 15 ${r1(hp * .15)} 11 Z`);
    poser(q1(bassin, "pli"), "d", `M${r1(4 * sw)} 6 V10`);
  }

  /** La lance tenue à deux mains (la main droite à l'arrière, la gauche devant), ou posée au sol : les bras suivent la lance. */
  function placerLaLance(p: Pose, wf: number, sw: number, angles: { aGu: number; aGl: number; aDu: number; aDl: number }, tenue: boolean) {
    poser(n("lance-tenue"), "opacity", tenue ? 1 : 0);
    if (!tenue) return;
    const epaule = (c: Cote): Point => ({ x: (c === "g" ? -1 : 1) * 18 * wf + 4 * sw, y: -38 });
    let O: Point = { x: p.lX, y: p.lY }, th = p.lA;
    if (p.sol > 0) {
      const g = versLeBuste(p, LANCE_AU_SOL);
      O = { x: lerp(O.x, g.x, p.sol), y: lerp(O.y, g.y, p.sol) };
      th = lerp(th, LANCE_AU_SOL.a - p.torse, p.sol);
    }
    const u = { x: Math.cos(th * DEG), y: Math.sin(th * DEG) }, k = p.tenue;
    deplacer(n("lance-tenue"), `translate(${r1(O.x)} ${r1(O.y)}) rotate(${r1(th)})`);
    const rD = brasSaisit("d", { x: O.x + u.x * 2, y: O.y + u.y * 2 }, epaule("d")), rG = brasSaisit("g", { x: O.x + u.x * 11, y: O.y + u.y * 11 }, epaule("g"));
    angles.aDu = lerp(angles.aDu, rD.a1, k);
    angles.aDl = lerp(angles.aDl, rD.a2, k);
    angles.aGu = lerp(angles.aGu, rG.a1, k);
    angles.aGl = lerp(angles.aGl, rG.a2, k);
  }

  /** Dessine Sam à l'instant `t` du scénario et rend sa pose (le jet, la cloche et les effets s'y accrochent). */
  function dessiner(scenario: ScenarioDeSam, t: number): DessinDeSam {
    const p = poseA(scenario.poses, t);
    vueCourante = p.vue;
    const cw = Math.cos(p.vue * DEG), sw = Math.sin(p.vue * DEG), wf = lerp(.55, 1, Math.abs(cw));
    deplacer(n("sam"), `translate(${r1(p.x)} ${r1(p.y)}) scale(${r3(BASE * p.sx)} ${r3(BASE * p.sy)})`);
    dessinerLeBuste(wf, sw);
    deplacer(n("haut"), `rotate(${r1(p.torse)})`);
    habit.suivre({ cw, sw, torse: p.torse });
    const procheJ = sw >= 0 ? "d" : "g", loinJ = procheJ === "d" ? "g" : "d";
    dessinerLaJambe(n("jambe-g"), "g", { x: -10 * wf, y: 4 }, p.lGt, p.lGs, p.fG, sw, p.tG);
    dessinerLaJambe(n("jambe-d"), "d", { x: 10 * wf, y: 4 }, p.lDt, p.lDs, p.fD, sw, p.tD);
    if (n("jambe-avant").firstElementChild !== jambes[procheJ]) {
      n("sam").insertBefore(jambes[loinJ], n("jambe-avant"));
      n("jambe-avant").append(jambes[procheJ]);
    }
    const angles = { aGu: p.aGu, aGl: p.aGl, aDu: p.aDu, aDl: p.aDl };
    const tenue = p.tenue > 0 && p.posee < .5;
    placerLaLance(p, wf, sw, angles, tenue);
    // bras : le bras loin derrière le buste, le bras proche devant (les deux devant quand il tient la lance)
    const devant = p.devant > .5 || tenue, proche = sw > .05 ? "d" : "g", emplacementAvant = n("bras-avant"), emplacementArriere = n("bras-arriere");
    for (const c of ["g", "d"] as const) {
      const cible = devant || c === proche || Math.abs(sw) <= .05 ? emplacementAvant : emplacementArriere;
      if (bras[c].parentNode !== cible) cible.append(bras[c]);
      const S = { x: (c === "g" ? -1 : 1) * 18 * wf + 4 * sw, y: -38 };
      dessinerLeBras(bras[c], c, S, c === "g" ? angles.aGu : angles.aDu, c === "g" ? angles.aGl : angles.aDl, tenue ? 1 : poseDeMain(c === "g" ? p.mG : p.mD));
    }
    if (devant && emplacementAvant.firstElementChild !== bras.g) emplacementAvant.prepend(bras.g);
    deplacer(n("tete"), `translate(0 -48) rotate(${r1(p.tete)})`);
    const ex = expressionA(scenario.expressions, t), A = EMOS[ex.prec], B = EMOS[ex.emo], u = ex.u;
    dessinerLaTete(p, ex, Math.max(lerp(A.lid, B.lid, u), clignement(t)), lerp(A.pup, B.pup, u));
    const haut = Math.max(0, SOL - (p.y + 58 * BASE));
    poser(n("ombre-sol"), "cx", r1(p.x));
    poser(n("ombre-sol"), "cy", r1(SOL + 2));
    poser(n("ombre-sol"), "rx", r1(34 * BASE + haut * .2));
    poser(n("ombre-sol"), "ry", r1(8 * BASE));
    poser(n("ombre-sol"), "opacity", r3(Math.max(.07, .22 - haut * .003)));
    return { pose: p };
  }

  return { dessiner, lance, mainDroite: trouver(bras.d, `#${prefixe}-main-d`) };
}

export type CapitaineSam = ReturnType<typeof creerCapitaineSam>;
