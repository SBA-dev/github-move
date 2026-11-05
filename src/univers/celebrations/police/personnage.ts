import type { CleDeTenue } from "@domain/motivation";
import { habillerLeCorpsArticule } from "../commun/habiller.ts";
import { clamp01, DEG, E, fenetre, lerp, r1, r3 } from "../commun/courbes.ts";
import { creerUnGroupe, deplacer, elementsDe, poser, trouver } from "../commun/dom.ts";
import { expressionA } from "../commun/expressions.ts";
import { decaler, membre, type Membre, type Point, trace } from "../commun/membres.ts";
import { inclinaisonDuProfilDeLeoOuDesBottes, placerLaChaussure } from "../commun/chaussure.ts";
import type { CoteDeMain, PoseDeMain } from "../commun/mains.ts";
import { clignement } from "../commun/visage.ts";
import { anglesVers, brasVers, HANCHE } from "../commun/atteindre.ts";
import { dessinDuBras, LOUPE, MAINS, SIFFLET, STRUCTURE_D_AGENT_MAX } from "./dessin-de-max.ts";
import { GUIDON, PLATEAU, TROTTINETTE } from "./dessin-des-objets.ts";
import { type Emotion, ECHELLE_DE_BASE as BASE, type Pose, poseA, type ScenarioDeLaPolice, SOL, X_MAX } from "./poses.ts";

/** Au plus, Max tourne la tête de 38° : de face ou de trois-quarts, jamais de dos. */
const VUE_MAXIMALE = 38;

const EMOS: Record<Emotion, { readonly s: readonly [number, number]; readonly lid: number; readonly pup: number }> = {
  sourire: { s: [0, 0], lid: 0, pup: 1 },
  joie: { s: [-4, 0], lid: 0, pup: 1.05 },
  concentration: { s: [2, 10], lid: .3, pup: 1 },
  surprise: { s: [-7, -4], lid: 0, pup: .85 },
  hum: { s: [1, 6], lid: .25, pup: 1 },
};

export type DessinDeMax = { readonly pose: Pose; readonly mains: { readonly g: Membre; readonly d: Membre } };

/** Agent Max, dessiné image par image à partir des poses du scénario (portage du moteur de la maquette : le corps de Coach Léo, la tête et la tenue de Max). */
export function creerAgentMax(racine: SVGSVGElement, tenue?: CleDeTenue) {
  const n = elementsDe(racine, "police");
  n("max").innerHTML = STRUCTURE_D_AGENT_MAX;
  const habit = habillerLeCorpsArticule(n, n("max"), "police", tenue);
  const bouches = [...n("bouches").children];
  const q1 = (g: ParentNode, classe: string) => trouver(g, `.${classe}`);
  const bras = { g: creerLeBras("g"), d: creerLeBras("d") };
  n("bras-arriere").append(bras.g);
  n("bras-avant").append(bras.d);
  const jambes = { g: n("jambe-g"), d: n("jambe-d") };
  n("trottinette").innerHTML = TROTTINETTE;
  let vueCourante = 0;

  function creerLeBras(c: "g" | "d"): SVGElement {
    const enveloppe = creerUnGroupe();
    enveloppe.innerHTML = dessinDuBras(c);
    const b = enveloppe.firstElementChild;
    if (!(b instanceof SVGElement)) throw new Error("Le bras d'Agent Max n'a pas pu être dessiné");
    return b;
  }

  function dessinerLeBras(g: SVGElement, c: "g" | "d", S: Point, a1: number, a2: number, pose: number, couleur: "peau" | "gant"): Membre {
    const m = membre(S, a1, a2, 24, 22);
    poser(q1(g, "manche-contour"), "d", trace(m, .04, .26, 3));
    poser(q1(g, "contour"), "d", trace(m, .09, 1));
    poser(q1(g, "rempli"), "d", trace(m, 0, 1));
    poser(q1(g, "manche"), "d", trace(m, 0, .26, 3));
    poser(q1(g, "manche-bord"), "d", trace(m, .235, .26, 1));
    poser(q1(g, "ombre"), "d", trace(decaler(m, 3.2, 1.4), .32, .92));
    poser(q1(g, "lumiere"), "d", trace(decaler(m, -3.2, -1.4), .34, .9));
    poser(q1(g, "manche-ombre"), "d", trace(decaler(m, 3.6, 1), .04, .22, 2));
    const mainG = trouver(g, `#police-main-${c}`);
    deplacer(mainG, `translate(${r1(m.W.x)} ${r1(m.W.y)}) rotate(${r1(m.dir)}) scale(.86)`);
    const versCentre = c === "g" ? 1 : -1, score = Math.cos(m.dir * DEG) * versCentre - Math.sin(m.dir * DEG) * .8;
    const cote: CoteDeMain = score > 0 ? "miroir" : "droit";
    const cle = couleur + cote + pose, emplacement = q1(mainG, "pose-main");
    if (emplacement.dataset["pose"] !== cle) {
      emplacement.innerHTML = MAINS[couleur][cote][pose as PoseDeMain] ?? "";
      emplacement.dataset["pose"] = cle;
    }
    return m;
  }

  function dessinerLaJambe(g: SVGElement, c: "g" | "d", S: Point, a1: number, a2: number, f: number, sw: number, ft: number) {
    const m = membre(S, a1, a2, 28 * f, 26 * f * ft);
    poser(q1(g, "contour"), "d", trace(m, .06, 1));
    poser(q1(g, "rempli"), "d", trace(m, 0, 1));
    poser(q1(g, "ombre"), "d", trace(decaler(m, 3.4, 1.2), .3, .72));
    poser(q1(g, "lumiere"), "d", trace(decaler(m, -3.4, -1.2), .3, .7));
    poser(q1(g, "revers"), "d", trace(m, .9, .97, 1));
    const ch = n(`chaussure-${c}`), profilF = clamp01((Math.abs(Math.sin(vueCourante * DEG)) - .45) / (Math.sin(VUE_MAXIMALE * DEG) - .45));
    const { sens } = placerLaChaussure(g, ch, m, { cote: c, tibia: ft, sw, profil: profilF, inclinaisonDuProfil: inclinaisonDuProfilDeLeoOuDesBottes(tenue === "bottes-de-pluie") });
    const contact = q1(ch, "contact");
    poser(contact, "opacity", 0);
    deplacer(contact, `translate(${r1(profilF * sens * 5)} 12) scale(${r3(1 + profilF * .5)} 1)`);
  }

  /** Les cheveux : sous la casquette ou le casque, ils se réduisent à deux mèches sur les côtés. */
  function dessinerLesCheveux(fx: number, coiffe: boolean) {
    if (coiffe) {
      poser(n("cheveux-forme"), "d", `M${r1(-41 + fx)} -14 Q${r1(-45 + fx)} -46 ${r1(fx)} -50 Q${r1(45 + fx)} -46 ${r1(41 + fx)} -14 Q${r1(41 + fx)} -5 ${r1(36 + fx)} -5 Q${r1(31 + fx)} -5 ${r1(31 + fx)} -14 V-22 Q${r1(fx)} -30 ${r1(-31 + fx)} -22 V-14 Q${r1(-31 + fx)} -5 ${r1(-36 + fx)} -5 Q${r1(-41 + fx)} -5 ${r1(-41 + fx)} -14 Z`);
      poser(n("cheveux-meche"), "d", "M0 0");
      poser(n("cheveux-lumiere"), "d", `M${r1(-37 + fx)} -10 Q${r1(-37 + fx)} -20 ${r1(-34 + fx)} -26`);
      return;
    }
    poser(n("cheveux-forme"), "d", `M${r1(-42 + fx)} -12 Q${r1(-46 + fx)} -50 ${r1(fx)} -55 Q${r1(46 + fx)} -50 ${r1(42 + fx)} -12 Q${r1(42 + fx)} -5 ${r1(36 + fx)} -6 Q${r1(32 + fx)} -8 ${r1(32 + fx)} -16 Q${r1(28 + fx)} -29 ${r1(fx)} -31 Q${r1(-28 + fx)} -29 ${r1(-32 + fx)} -16 Q${r1(-32 + fx)} -8 ${r1(-36 + fx)} -6 Q${r1(-42 + fx)} -5 ${r1(-42 + fx)} -12 Z`);
    poser(n("cheveux-meche"), "d", `M${r1(-14 + fx)} -31 Q${r1(-6 + fx)} -42 ${r1(8 + fx)} -34 Q${r1(-2 + fx)} -35 ${r1(-14 + fx)} -31 Z`);
    poser(n("cheveux-lumiere"), "d", `M${r1(-26 + fx)} -38 Q${r1(-12 + fx)} -48 ${r1(4 + fx)} -46`);
  }

  /** La tête de Max (rayon 40 dans son repère, réduite à 28 comme celle de Léo) : de face ou de trois-quarts, jamais de dos. */
  function dessinerLaTete(p: Pose, casquette: boolean, ex: { emo: Emotion; prec: Emotion; u: number }, lidBase: number, pup: number) {
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
    dessinerLesCheveux(dx * .6, casquette || p.casque > .5);
    poser(n("casquette"), "opacity", casquette ? 1 : 0);
    deplacer(n("casquette"), `translate(${r1(dx * .8)} 0) rotate(${r1(v * 5)})`);
    poser(n("casque"), "opacity", p.casque > .5 ? 1 : 0);
    deplacer(n("casque"), `translate(${r1(dx * .7)} 0) rotate(${r1(v * 4)})`);
    poser(q1(n("casquette"), "visiere"), "d", `M-43 -34 Q${r1(v * 22)} -46 43 -34 Q${r1(v * 26)} -18 -43 -34 Z`);
  }

  /** En trottinette : le pied éloigné est sur le plateau, le pied proche pousse au sol (position fixe dans la scène) ou se lève derrière. */
  function poserLesJambesSurLaTrottinette(p: Pose, jambesEnMouvement: { lGt: number; lGs: number; lDt: number; lDs: number; fG: number; fD: number }, f: number, procheJ: "g" | "d") {
    const k = p.trot, echelle = BASE * p.s * p.sx, loinJ = procheJ === "d" ? "g" : "d";
    const auSol = { x: (p.pied - p.x) / echelle, y: 58 + 3 - p.piedH }, derriere = { x: -58 * f, y: 18 };
    const cibleDe = (c: "g" | "d"): Point => c === loinJ ? { x: PLATEAU.x * f, y: PLATEAU.y } : { x: lerp(auSol.x, derriere.x, p.libre), y: lerp(auSol.y, derriere.y, p.libre) };
    for (const c of ["g", "d"] as const) {
      const r = anglesVers(HANCHE(c), cibleDe(c), 28, 26, f);
      if (c === "g") {
        jambesEnMouvement.lGt = lerp(jambesEnMouvement.lGt, r.a1, k);
        jambesEnMouvement.lGs = lerp(jambesEnMouvement.lGs, r.a2, k);
        jambesEnMouvement.fG = 1;
      } else {
        jambesEnMouvement.lDt = lerp(jambesEnMouvement.lDt, r.a1, k);
        jambesEnMouvement.lDs = lerp(jambesEnMouvement.lDs, r.a2, k);
        jambesEnMouvement.fD = 1;
      }
    }
  }

  /** La trottinette entière, jamais écrasée (au plus 55 % de sa largeur pendant le demi-tour de trois-quarts), et les bras qui tiennent le guidon. */
  function dessinerLaTrottinette(scenario: ScenarioDeLaPolice, t: number, p: Pose, f: number, sw: number, procheJ: "g" | "d", brasEnMouvement: { aGu: number; aGl: number; aDu: number; aDl: number }) {
    const pop = scenario.tTrottinette === null ? 1 : fenetre(t, scenario.tTrottinette, .35, E.rebond), kx = Math.max(.55, Math.abs(sw) / Math.sin(VUE_MAXIMALE * DEG)) * f;
    deplacer(n("trottinette"), `scale(${r3(kx * pop)} ${r3(pop)})`);
    const angle = (p.x - X_MAX) / (9 * BASE) / DEG;
    n("trottinette").querySelectorAll(".rayons-roue").forEach((r) => deplacer(r, `rotate(${r1(angle)})`));
    // les mains sur le guidon (cible exprimée dans le repère du buste, qui est penché) ; une seule main va à la sonnette
    const ca = Math.cos(p.torse * DEG), sa = Math.sin(p.torse * DEG), versLeBuste = (q: Point): Point => ({ x: q.x * ca + q.y * sa, y: -q.x * sa + q.y * ca });
    for (const c of ["g", "d"] as const) {
      const surSonnette = c === procheJ ? p.sonnette : 0;
      const cible = versLeBuste({ x: lerp(GUIDON[c].x, 46, surSonnette) * f, y: lerp(GUIDON[c].y, -2, surSonnette) });
      const r = brasVers(c, cible), k = p.trot * (c === procheJ ? 1 - p.salut : 1);
      if (c === "g") {
        brasEnMouvement.aGu = lerp(brasEnMouvement.aGu, r.a1, k);
        brasEnMouvement.aGl = lerp(brasEnMouvement.aGl, r.a2, k);
      } else {
        brasEnMouvement.aDu = lerp(brasEnMouvement.aDu, r.a1, k);
        brasEnMouvement.aDl = lerp(brasEnMouvement.aDl, r.a2, k);
      }
    }
    if (p.salut > 0) {
      const k = p.salut;
      if (procheJ === "d") {
        brasEnMouvement.aDu = lerp(brasEnMouvement.aDu, -150, k);
        brasEnMouvement.aDl = lerp(brasEnMouvement.aDl, -24, k);
      } else {
        brasEnMouvement.aGu = lerp(brasEnMouvement.aGu, 150, k);
        brasEnMouvement.aGl = lerp(brasEnMouvement.aGl, 24, k);
      }
    }
  }

  /** Pendant le vol de la casquette lancée, celle de la tête reste cachée : il n'y en a jamais deux. */
  function casquetteSurLaTete({ tLance, tRattrape }: ScenarioDeLaPolice, p: Pose, t: number): boolean {
    const enVol = tLance !== null && tRattrape !== null && t >= tLance && t < tRattrape;
    return p.casq > .5 && !enVol;
  }

  function contenuDeLaMain(c: "g" | "d", p: Pose): "loupe" | "sifflet" | "" {
    const sif = Math.round(p.sif);
    if (c === "d" && p.loupe > .5) return "loupe";
    return (c === "d" && sif === 1) || (c === "g" && sif === 2) ? "sifflet" : "";
  }

  /** Dessine Max à l'instant `t` du scénario et rend sa pose et ses mains (le chiot et les effets s'y accrochent). */
  function dessiner(scenario: ScenarioDeLaPolice, t: number): DessinDeMax {
    const p = poseA(scenario.poses, t);
    vueCourante = p.vue;
    const jambesEnMouvement = { lGt: p.lGt, lGs: p.lGs, lDt: p.lDt, lDs: p.lDs, fG: p.fG, fD: p.fD }, brasEnMouvement = { aGu: p.aGu, aGl: p.aGl, aDu: p.aDu, aDl: p.aDl };
    let y = p.y;
    const w = p.vue, cw = Math.cos(w * DEG), sw = Math.sin(w * DEG), wf = lerp(.55, 1, Math.abs(cw)), f = sw >= 0 ? 1 : -1;
    // marche : cycle de pas, cuisse en avant puis genou qui plie derrière, bras opposés aux jambes
    if (p.marche > 0) {
      const ph = t * Math.PI * 2 * 2.1, a = Math.sin(ph), b = -a, k = p.marche, j = jambesEnMouvement;
      j.lGt = lerp(j.lGt, -24 * a * f, k);
      j.lGs = lerp(j.lGs, 52 * Math.max(0, -a * f) + 6, k);
      j.lDt = lerp(j.lDt, -24 * b * f, k);
      j.lDs = lerp(j.lDs, 52 * Math.max(0, -b * f) + 6, k);
      j.fG = lerp(j.fG, 1 - .12 * Math.max(0, a), k);
      j.fD = lerp(j.fD, 1 - .12 * Math.max(0, b), k);
      brasEnMouvement.aGu = lerp(brasEnMouvement.aGu, 8 + 30 * a * f, k);
      brasEnMouvement.aGl = lerp(brasEnMouvement.aGl, 14 + 10 * Math.max(0, a * f), k);
      y -= 3 * Math.abs(a) * k;
    }
    y -= 3 * p.trot;
    deplacer(n("max"), `translate(${r1(p.x)} ${r1(y)}) rotate(${r1(p.rot)}) scale(${r3(p.s * BASE * p.sx)} ${r3(p.s * BASE * p.sy)})`);
    // buste en poire, chemise rentrée, ceinture fine, col, poche-carnet, écusson, loupe à la ceinture
    const sh = 18 * wf, hp = 21 * wf, torse = n("torse"), bassin = n("bassin");
    poser(q1(torse, "forme"), "d", `M${r1(-sh)} -40 Q${r1(-sh - 6)} -12 ${r1(-hp)} 1 Q0 4 ${r1(hp)} 1 Q${r1(sh + 6)} -12 ${r1(sh)} -40 Q0 -47 ${r1(-sh)} -40 Z`);
    poser(q1(torse, "ombre"), "d", `M${r1(sh * .3)} -42 Q${r1(sh + 3)} -30 ${r1(hp)} 0 Q${r1(hp * .6)} 3 ${r1(hp * .35)} 2 Q${r1(sh + 1)} -20 ${r1(sh * .3)} -42 Z`);
    poser(q1(torse, "lumiere"), "d", `M${r1(-sh * .9)} -36 Q${r1(-sh * .4)} -42 ${r1(sh * .1)} -40 Q${r1(-sh * .4)} -37 ${r1(-sh * .8)} -30 Z`);
    poser(q1(torse, "boutons"), "d", `M${r1(4 * sw)} -34 V-4`);
    poser(q1(torse, "ceinture"), "d", `M${r1(-hp - 1)} -2 Q0 1 ${r1(hp + 1)} -2 L${r1(hp + 1)} 3 Q0 6 ${r1(-hp - 1)} 3 Z`);
    deplacer(q1(torse, "boucle"), `translate(${r1(4 * sw)} 1)`);
    poser(q1(torse, "col"), "d", cw > .2 ? `M-8 -44 L-3 -37 L0 -41 L3 -37 L8 -44 Q0 -47 -8 -44 Z` : `M-8 -43 Q0 -39 8 -43`);
    deplacer(q1(torse, "poche"), `translate(${r1(9 * cw + 4 * sw)} -24)`);
    deplacer(q1(torse, "insigne"), `translate(${r1(-8 * cw + 4 * sw)} -25)`);
    const loupeDeLaCeinture = q1(torse, "loupe-ceinture");
    poser(loupeDeLaCeinture, "opacity", p.loupe < .5 && p.loupeSol < .5 ? 1 : 0);
    deplacer(loupeDeLaCeinture, `translate(${r1(hp + 2 + 4 * sw)} 10)`);
    // bassin étroit : deux tubes de pantalon partent des hanches
    poser(q1(bassin, "forme"), "d", `M${r1(-hp - 1)} -1 Q0 2 ${r1(hp + 1)} -1 L${r1(hp + 2)} 12 Q${r1(hp * .5)} 15 ${r1(hp * .12)} 11 Q0 8 ${r1(-hp * .12)} 11 Q${r1(-hp * .5)} 15 ${r1(-hp - 2)} 12 Z`);
    poser(q1(bassin, "ombre"), "d", `M${r1(hp * .2)} 5 Q${r1(hp + 1)} 0 ${r1(hp + 2)} 12 Q${r1(hp * .6)} 15 ${r1(hp * .15)} 11 Z`);
    poser(q1(bassin, "pli"), "d", `M${r1(4 * sw)} 2 V9`);
    deplacer(n("haut"), `rotate(${r1(p.torse)})`);
    habit.suivre({ cw, sw, torse: p.torse });
    const procheJ = sw >= 0 ? "d" : "g", loinJ = procheJ === "d" ? "g" : "d";
    if (p.trot > 0) poserLesJambesSurLaTrottinette(p, jambesEnMouvement, f, procheJ);
    const j = jambesEnMouvement;
    dessinerLaJambe(n("jambe-g"), "g", { x: -10 * wf, y: 4 }, j.lGt, j.lGs, j.fG, sw, p.tG);
    dessinerLaJambe(n("jambe-d"), "d", { x: 10 * wf, y: 4 }, j.lDt, j.lDs, j.fD, sw, p.tD);
    if (n("jambe-avant").firstElementChild !== jambes[procheJ]) {
      n("max").insertBefore(jambes[loinJ], n("trottinette"));
      n("jambe-avant").append(jambes[procheJ]);
    }
    poser(n("trottinette"), "opacity", p.trot > 0 ? 1 : 0);
    if (p.trot > 0) dessinerLaTrottinette(scenario, t, p, f, sw, procheJ, brasEnMouvement);
    // bras : le bras loin derrière le buste, le bras proche devant
    const proche = sw > .05 ? "d" : "g", emplacementAvant = n("bras-avant"), emplacementArriere = n("bras-arriere"), couleur = p.gants > .5 ? "gant" : "peau";
    if (p.trot > 0) {
      if (n("haut").firstElementChild !== emplacementArriere) n("haut").prepend(emplacementArriere);
    } else if (n("haut").firstElementChild === emplacementArriere) torse.after(emplacementArriere);
    const dessinerUnBras = (c: "g" | "d"): Membre => {
      const cible = c === proche || Math.abs(sw) <= .05 ? emplacementAvant : emplacementArriere;
      if (bras[c].parentNode !== cible) cible.append(bras[c]);
      const S = { x: (c === "g" ? -1 : 1) * 18 * wf + 4 * sw, y: -38 };
      const salue = p.trot > 0 && c === procheJ && p.salut > .5;
      const pose = p.trot > 0 ? (salue ? 3 : 1) : Math.round(c === "g" ? p.mG : p.mD);
      const m = dessinerLeBras(bras[c], c, S, c === "g" ? brasEnMouvement.aGu : brasEnMouvement.aDu, c === "g" ? brasEnMouvement.aGl : brasEnMouvement.aDl, pose, couleur);
      const objet = trouver(bras[c], `#police-main-${c} .prop`), contenu = contenuDeLaMain(c, p);
      if (objet.dataset["contenu"] !== contenu) {
        objet.innerHTML = contenu === "loupe" ? LOUPE : contenu === "sifflet" ? SIFFLET : "";
        objet.dataset["contenu"] = contenu;
      }
      return m;
    };
    const mains = { g: dessinerUnBras("g"), d: dessinerUnBras("d") };
    deplacer(n("tete"), `translate(0 -48) rotate(${r1(p.tete)})`);
    const ex = expressionA(scenario.expressions, t), A = EMOS[ex.prec], B = EMOS[ex.emo], u = ex.u;
    dessinerLaTete(p, casquetteSurLaTete(scenario, p, t), ex, Math.max(lerp(A.lid, B.lid, u), clignement(t)), lerp(A.pup, B.pup, u));
    // ombre au sol
    const S = p.s * BASE, haut = Math.max(0, SOL - (y + 58 * S));
    poser(n("ombre-sol"), "cx", r1(p.x));
    poser(n("ombre-sol"), "cy", r1(SOL + 2));
    poser(n("ombre-sol"), "rx", r1(34 * S + haut * .2));
    poser(n("ombre-sol"), "ry", r1(8 * S));
    poser(n("ombre-sol"), "opacity", r3(Math.max(.07, .25 - haut * .003)));
    return { pose: p, mains };
  }

  return { dessiner };
}
