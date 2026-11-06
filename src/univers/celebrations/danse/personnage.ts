import type { CleDeTenue } from "@domain/motivation";
import { habillerLeCorpsArticule } from "../commun/habiller.ts";
import { clamp01, DEG, E, lerp, r1, r3 } from "../commun/courbes.ts";
import { creerUnGroupe, deplacer, elementsDe, type PrefixeDeScene, poser, trouver } from "../commun/dom.ts";
import { type Expression, expressionA } from "../commun/expressions.ts";
import type { CoteDeMain, PoseDeMain } from "../commun/mains.ts";
import { decaler, membre, type Point, trace } from "../commun/membres.ts";
import { inclinaisonDuProfilDeLeoOuDesBottes, placerLaChaussure } from "../commun/chaussure.ts";
import { clignement, RAYON_DE_LA_TETE as R, traitDuVisage } from "../commun/visage.ts";
import { dessinDuBras, MAINS, QUEUE_DE_CHEVAL, structureDeLili } from "./dessin-de-lili.ts";
import { type Emotion, type Pose, poseA, type ScenarioDeDanse } from "./poses.ts";
import { creerLaQueueDeCheval } from "./queue-de-cheval.ts";

export const ECHELLE_DE_BASE = 1.25;
const BASE = ECHELLE_DE_BASE;

const EMOS: Record<Emotion, { sg: readonly [number, number]; sd: readonly [number, number]; lid: number; pup: number }> = {
  concentration: { sg: [2, 10], sd: [2, -10], lid: .3, pup: 1 },
  joie: { sg: [-5, -4], sd: [-5, 4], lid: 0, pup: 1.05 },
  sourire: { sg: [-3, -3], sd: [-3, 3], lid: 0, pup: 1 },
};

/** Ce que Lili joue : des poses et des expressions dans le temps. */
type PosesEtExpressions = Pick<ScenarioDeDanse, "poses" | "expressions">;

/** Lili, dessinée image par image à partir des poses du scénario (portage du moteur de la maquette). Ses identifiants portent `prefixe` : la célébration de la Danse ou la scène de réponse fausse. */
export function creerLili(racine: SVGSVGElement, tenue?: CleDeTenue, prefixe: PrefixeDeScene = "danse") {
  const n = elementsDe(racine, prefixe);
  n("lili").innerHTML = structureDeLili(prefixe);
  const habit = habillerLeCorpsArticule(n, n("lili"), "danse", tenue, prefixe);
  n("queue-arriere").innerHTML = QUEUE_DE_CHEVAL;
  const bras = { g: creerLeBras("g"), d: creerLeBras("d") };
  const bouches = [...n("bouches").children];
  const queue = creerLaQueueDeCheval(racine, { avant: `${prefixe}-queue-avant`, arriere: `${prefixe}-queue-arriere` });
  const q1 = (g: ParentNode, classe: string) => trouver(g, `.${classe}`);
  let vueCourante = 0;

  function creerLeBras(c: "g" | "d"): SVGElement {
    const enveloppe = creerUnGroupe();
    enveloppe.innerHTML = dessinDuBras(c, prefixe);
    const b = enveloppe.firstElementChild;
    if (!(b instanceof SVGElement)) throw new Error("Le bras de Lili n'a pas pu être dessiné");
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
    // chausson : vue de face, de profil ou semelle (pied levé), fondues selon la vue et l'angle du tibia
    const ch = n(`chaussure-${c}`), profilF = clamp01((Math.abs(Math.sin(vueCourante * DEG)) - .45) * 6), versCam = Math.cos(vueCourante * DEG) < 0 ? -1 : 1;
    const { face, leve, sens } = placerLaChaussure(g, ch, m, { cote: c, tibia: ft, sw, profil: profilF, inclinaisonDuProfil: inclinaisonDuProfilDeLeoOuDesBottes(tenue === "bottes-de-pluie") });
    poser(q1(face, "devant"), "opacity", versCam > 0 ? 1 : 0);
    poser(q1(face, "talon"), "opacity", versCam > 0 ? 0 : 1);
    const contact = q1(ch, "contact");
    poser(contact, "opacity", r3((1 - leve) * .25));
    deplacer(contact, `translate(${r1(profilF * sens * 5)} 12) scale(${r3(1 + profilF * .5)} 1)`);
  }

  function dessinerLaTete(p: Pose, ex: Expression<Emotion>, lidBase: number, pup: number) {
    const w = p.vue, cw = Math.cos(w * DEG);
    for (const [id, alpha] of [["oreille-g", -90], ["oreille-d", 90]] as const) {
      const o = traitDuVisage(alpha, w, R);
      poser(n(id), "opacity", o.z > -.12 ? 1 : 0);
      deplacer(n(id), `translate(${r1(o.x)} 6)`);
    }
    poser(n("tete-ombre"), "d", `M8 27 A28 28 0 0 0 27 -6 A23 23 0 0 1 8 27 Z`);
    const A = EMOS[ex.prec], B = EMOS[ex.emo], u = ex.u;
    const sg = A.sg.map((v, i) => lerp(v, B.sg[i] ?? v, u)), sd = A.sd.map((v, i) => lerp(v, B.sd[i] ?? v, u));
    for (const [c, alpha, s, lidExtra] of [["g", -32, sg, 0], ["d", 32, sd, p.clin]] as const) {
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
    deplacer(n("nez"), `translate(${r1(nez.x + (nez.z < .3 ? 3 * Math.sign(Math.sin(w * DEG) || 1) : 0))} 8)`);
    const b = traitDuVisage(0, w, R * .7);
    poser(n("bouche"), "opacity", b.z > .05 ? 1 : 0);
    deplacer(n("bouche"), `translate(${r1(b.x)} 1) scale(${r3(Math.max(.3, b.z))} 1)`);
    for (const m of bouches) {
      const e = m.getAttribute("data-emo");
      poser(m, "opacity", e === ex.emo ? u : e === ex.prec ? 1 - u : 0);
      if (e === ex.emo) deplacer(m, `scale(${r3(lerp(.7, 1, E.retour(u)))})`);
    }
    // coiffure : ligne de cheveux basse derrière, haute devant
    const sw = Math.sin(w * DEG), dosA = (1 - cw) / 2, pente = (15 - -17) / 2, cote = lerp(5, 13, dosA), deFace = clamp01(cw), yC = lerp(-17, 15, dosA) - 5 * deFace;
    // de dos, la chevelure recouvre tout l'arrière du crâne : aucune peau n'en dépasse
    const recouvrement = clamp01((-cw - .05) / .2), basDeLaTete = (x: number) => Math.sqrt(Math.max(0, (R + 2) ** 2 - x * x)) + 1;
    // de face, la frange descend en douceur vers les tempes et la chevelure épouse le crâne : aucune mèche ne dépasse
    const descente = lerp(-cote, 14, deFace), bord = lerp(R + 1, Math.sqrt((R + 1.5) ** 2 - 11 ** 2), deFace);
    const hauteurDeLaFrange = (x: number) => {
      const ligne = yC - (x / R) * sw * pente + descente * (Math.abs(x) / R) ** lerp(3, 1.6, deFace);
      return lerp(ligne, basDeLaTete(x), recouvrement);
    };
    let d = "";
    for (let i = 0; i <= 12; i++) {
      const x = -bord + 2 * bord * i / 12;
      const y = hauteurDeLaFrange(x);
      d += `${i ? "L" : "M"}${r1(x)} ${r1(y)}`;
    }
    const yGauche = r1(hauteurDeLaFrange(-bord));
    d += ` C${r1(bord + lerp(4, 3, deFace))} ${r1(lerp(-14, -20, deFace))} ${R - 10} -25 ${R - 10} -25 Q0 ${lerp(-37, -46, deFace)} ${-R + 10} -25 C${-R + 10} -25 ${r1(-bord - lerp(4, 3, deFace))} ${r1(lerp(-14, -20, deFace))} ${r1(-bord)} ${yGauche} Z`;
    poser(n("cheveux-forme"), "d", d);
    // nuque, visible de dos : l'ombre de la chevelure
    const dos = clamp01(-cw);
    poser(n("nuque-ombre"), "d", `M${-R + 2} ${r1(yC - 2)} Q0 ${r1(yC + 10)} ${R - 2} ${r1(yC - 2)} Q0 ${r1(yC + 4)} ${-R + 2} ${r1(yC - 2)} Z`);
    poser(n("nuque-ombre"), "opacity", r3(dos * .8));
    poser(n("cheveux-lumiere"), "d", `M${r1(-16 + 6 * sw)} -22 Q${r1(-4 + 6 * sw)} -29 ${r1(8 + 6 * sw)} -26`);
  }

  /** Dessine Lili à l'instant `t` du scénario et rend sa pose (les effets s'y accrochent). */
  function dessiner(scenario: PosesEtExpressions, t: number): Pose {
    const p = poseA(scenario.poses, t);
    vueCourante = p.vue;
    const pAvant = poseA(scenario.poses, t - .06);
    const rebond = Math.max(-22, Math.min(22, (p.y - pAvant.y) * 1.1 + (p.x - pAvant.x) * .5));
    let { lGt, lGs, lDt, lDs, y } = p;
    let fG = 1, fD = 1;
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
    deplacer(n("lili"), `translate(${r1(p.x)} ${r1(y)}) rotate(${r1(p.rot)}) scale(${r3(BASE * p.sx)} ${r3(BASE * p.sy)})`);
    // justaucorps en poire, col (devant seulement)
    const sh = 17 * wf, wa = 13 * wf, hp = 21 * wf, torse = n("torse"), tutu = n("tutu");
    poser(q1(torse, "forme"), "d", `M${r1(-sh)} -40 Q${r1(-sh - 3)} -26 ${r1(-wa)} -13 Q${r1(-wa - 1)} -6 ${r1(-hp * .8)} 0 Q0 6 ${r1(hp * .8)} 0 Q${r1(wa + 1)} -6 ${r1(wa)} -13 Q${r1(sh + 3)} -26 ${r1(sh)} -40 Q0 -47 ${r1(-sh)} -40 Z`);
    poser(q1(torse, "ombre"), "d", `M${r1(sh * .35)} -42 Q${r1(sh + 2)} -30 ${r1(wa)} -13 Q${r1(wa + 1)} -6 ${r1(hp * .8)} 0 Q${r1(hp * .6)} 3 ${r1(hp * .35)} 3 Q${r1(wa - 2)} -8 ${r1(wa - 4)} -16 Q${r1(sh - 2)} -28 ${r1(sh * .35)} -42 Z`);
    poser(q1(torse, "lumiere"), "d", `M${r1(-sh * .9)} -36 Q${r1(-sh * .4)} -42 ${r1(sh * .1)} -40 Q${r1(-sh * .4)} -37 ${r1(-sh * .8)} -30 Z`);
    poser(q1(torse, "col"), "d", cw > .2 ? `M-9 -44 Q0 -34 9 -44` : `M-8 -43 Q0 -39 8 -43`);
    // tutu court et bouffant : festons, couche arrière plus large, rebond vertical avec le mouvement
    const festons = (W: number, y0: number, yb: number, nombre: number) => {
      const taille = W * .55;
      let d = `M${r1(-taille)} ${y0} Q${r1(-W * .95)} ${y0 + 2} ${r1(-W)} ${yb - 3}`;
      for (let i = 0; i < nombre; i++) {
        const xa = -W + 2 * W * i / nombre, xb = -W + 2 * W * (i + 1) / nombre;
        d += ` Q${r1((xa + xb) / 2)} ${r1(yb + 9)} ${r1(xb)} ${yb - 3}`;
      }
      return `${d} Q${r1(W * .95)} ${y0 + 2} ${r1(taille)} ${y0} Q0 ${y0 + 4} ${r1(-taille)} ${y0} Z`;
    };
    const bond = clamp01(Math.abs(rebond) / 22), W = 36 * wf + 8;
    poser(q1(tutu, "arriere"), "d", festons(W + 5, -8, 17, 6));
    poser(q1(tutu, "forme"), "d", festons(W, -5, 20, 7));
    poser(q1(tutu, "ombre"), "d", `M${r1(W * .5)} 2 Q${r1(W * .97)} 4 ${r1(W)} 14 Q${r1(W * .8)} 18 ${r1(W * .55)} 17 Q${r1(W * .75)} 10 ${r1(W * .5)} 2 Z`);
    poser(q1(tutu, "bande"), "d", `M${r1(-W * .5)} -5 Q0 2 ${r1(W * .5)} -5`);
    deplacer(tutu, `scale(${r3(1 + bond * .08)} ${r3(1 + bond * .18)})`);
    deplacer(n("haut"), `rotate(${r1(p.torse)})`);
    habit.suivre({ cw, sw, torse: p.torse });
    // jambes (attachées aux hanches), un peu allongées sur les demi-pointes
    dessinerLaJambe(n("jambe-g"), "g", { x: -9 * wf, y: 4 }, lGt, lGs, fG * (1 + .06 * p.pointe), sw, 1);
    dessinerLaJambe(n("jambe-d"), "d", { x: 9 * wf, y: 4 }, lDt, lDs, fD * (1 + .06 * p.pointe), sw, p.tD);
    // le bras loin derrière le torse, le bras proche devant
    const proche = sw > .05 ? "d" : "g", emplacementAvant = n("bras-avant"), emplacementArriere = n("bras-arriere");
    for (const c of ["g", "d"] as const) {
      const cible = c === proche || Math.abs(sw) <= .05 ? emplacementAvant : emplacementArriere;
      if (bras[c].parentNode !== cible) cible.append(bras[c]);
      const S = { x: (c === "g" ? -1 : 1) * 18 * wf + 4 * sw, y: -38 };
      dessinerLeBras(bras[c], c, S, c === "g" ? p.aGu : p.aDu, c === "g" ? p.aGl : p.aDl, Math.round(c === "g" ? p.mG : p.mD));
    }
    deplacer(n("tete"), `translate(0 -48) rotate(${r1(p.tete)})`);
    deplacer(n("tete-forme"), `translate(0 -26)`);
    const ex = expressionA(scenario.expressions, t), A = EMOS[ex.prec], B = EMOS[ex.emo], u = ex.u;
    const lidBase = Math.max(lerp(A.lid, B.lid, u), clignement(t));
    dessinerLaTete(p, ex, lidBase, lerp(A.pup, B.pup, u));
    const dvueBrut = p.vue - pAvant.vue, dvue = Math.abs(dvueBrut) > 300 ? 0 : dvueBrut / .06;
    queue.dessiner(p, t, (p.x - pAvant.x) / .06, (p.y - pAvant.y) / .06, dvue);
    // ombre au sol
    const sol = p.y + 58 * BASE, haut = Math.max(0, sol - (y + 58 * BASE)), ombre = n("ombre-de-lili");
    poser(ombre, "cx", r1(p.x));
    poser(ombre, "cy", r1(sol + 2));
    poser(ombre, "rx", r1(34 * BASE + haut * .2));
    poser(ombre, "ry", r1(8 * BASE));
    poser(ombre, "opacity", r3(Math.max(.07, .25 - haut * .003)));
    return p;
  }

  return { dessiner };
}
