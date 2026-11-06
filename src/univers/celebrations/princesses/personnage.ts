import type { CleDeTenue } from "@domain/motivation";
import { habillerLePersonnage } from "../commun/habiller.ts";
import { ANCRAGES_DES_TENUES, dessinDeLaBotte } from "../commun/tenues.ts";
import { clamp01, DEG, E, lerp, r1, r3 } from "../commun/courbes.ts";
import { creerUnGroupe, deplacer, elementsDe, type PrefixeDeScene, poser, trouver } from "../commun/dom.ts";
import { type Expression, expressionA } from "../commun/expressions.ts";
import type { CoteDeMain, PoseDeMain } from "../commun/mains.ts";
import { decaler, membre, type Point, trace } from "../commun/membres.ts";
import { clignement } from "../commun/visage.ts";
import { creerLesCheveux } from "./cheveux.ts";
import { dessinDuBras, MAINS, OR, structureDeLumi } from "./dessin-de-lumi.ts";
import { fleurMagique } from "./magie.ts";
import { type Emotion, type Pose, poseA, SOL, type ScenarioDesPrincesses } from "./poses.ts";

const ECHELLE_DE_BASE = 1.3;
const BASE = ECHELLE_DE_BASE;

const EMOS: Record<Emotion, { readonly s: readonly [number, number]; readonly lid: number; readonly pup: number }> = {
  sourire: { s: [0, 0], lid: 0, pup: 1 },
  joie: { s: [-4, 0], lid: 0, pup: 1.05 },
  concentration: { s: [-2, 3], lid: .2, pup: 1 },
  surprise: { s: [-7, -4], lid: 0, pup: .85 },
  souffle: { s: [-1, 2], lid: .35, pup: 1 },
};

const couple = (a: readonly [number, number], b: readonly [number, number], u: number): [number, number] => [lerp(a[0], b[0], u), lerp(a[1], b[1], u)];

/** Un point du dessin de Lumi, rendu dans l'espace de la scène. */
function dansLaScene(racine: SVGSVGElement, element: SVGElement, p: Point): Point | null {
  const scene = racine.getScreenCTM(), pieceSurEcran = element instanceof SVGGraphicsElement ? element.getScreenCTM() : null;
  if (!scene || !pieceSurEcran) return null;
  const image = new DOMPoint(p.x, p.y).matrixTransform(scene.inverse().multiply(pieceSurEcran));
  return { x: image.x, y: image.y };
}

export type LumiDessinee = { readonly pose: Pose; /** Le bout de la baguette dans l'espace de la scène (rien si la scène n'est pas affichée). */ readonly boutDeLaBaguette: Point | null };

/**
 * Lumi, dessinée image par image à partir des poses du scénario (portage du moteur de la maquette).
 * Ses identifiants portent `prefixe` : la célébration des Princesses ou la scène de réponse fausse. `solY` est la hauteur du sol, d'où se mesure son ombre.
 */
export function creerLumi(racine: SVGSVGElement, tenue?: CleDeTenue, prefixe: PrefixeDeScene = "princesse", solY: number = SOL.y) {
  const n = elementsDe(racine, prefixe);
  n("lumi").innerHTML = structureDeLumi(prefixe);
  n("baguette").innerHTML = `<line x1="0" y1="0" x2="0" y2="-34" stroke="#33304A" stroke-width="7" stroke-linecap="round"/><line x1="0" y1="0" x2="0" y2="-34" stroke="#FFFFFF" stroke-width="3.6" stroke-linecap="round"/><line x1="0" y1="-4" x2="0" y2="-30" stroke="${OR}" stroke-width="1.4" stroke-dasharray="3 3"/><g transform="translate(0 -40)"><circle r="12" fill="url(#${prefixe}-lueur)"/>${fleurMagique(9, "rosePale")}</g>`;
  const habit = habillerLePersonnage("princesse", tenue, ANCRAGES_DES_TENUES.princesse, {
    derriere: (groupe) => n("cheveux-arriere").after(groupe),
    devant: (groupe) => n("tete").after(groupe),
    auCou: (groupe) => n("bras-avant").after(groupe),
  }, prefixe);
  if (tenue === "bottes-de-pluie") habillerLesPiedsDeBottes();
  const cheveux = creerLesCheveux(racine, prefixe);
  const bras = { g: creerLeBras("g"), d: creerLeBras("d") };
  const bouches = [...n("bouche").children];
  const q1 = (g: ParentNode, classe: string) => trouver(g, `.${classe}`);
  let mainDroite: { readonly W: Point; readonly dir: number } = { W: { x: 0, y: 0 }, dir: 0 };

  /** Les bottes de pluie remplacent les ballerines : elles pendent au bout des jambes, comme elles, et suivent leur inclinaison. */
  function habillerLesPiedsDeBottes() {
    const { gauche, droit, tige } = ANCRAGES_DES_TENUES.princesse.pieds;
    for (const [c, pied] of [["g", gauche], ["d", droit]] as const) n(`pied-${c}`).innerHTML = `<g data-tenue-dessin="bottes-de-pluie" transform="translate(0 -2) scale(${pied.echelle})">${dessinDeLaBotte(tige)}</g>`;
  }

  function creerLeBras(c: "g" | "d"): SVGElement {
    const enveloppe = creerUnGroupe();
    enveloppe.innerHTML = dessinDuBras(c, prefixe);
    const b = enveloppe.firstElementChild;
    if (!(b instanceof SVGElement)) throw new Error("Le bras de Lumi n'a pas pu être dessiné");
    return b;
  }

  function dessinerLeBras(g: SVGElement, c: "g" | "d", S: Point, a1: number, a2: number, pose: number) {
    const m = membre(S, a1, a2, 20, 17);
    poser(q1(g, "contour"), "d", trace(m, .06, 1));
    poser(q1(g, "rempli"), "d", trace(m, 0, 1));
    poser(q1(g, "ombre"), "d", trace(decaler(m, 3, 1.2), .3, .92));
    poser(q1(g, "lumiere"), "d", trace(decaler(m, -3, -1.2), .3, .85));
    deplacer(q1(g, "manche"), `translate(${r1(S.x)} ${r1(S.y + 2)}) rotate(${r1(-a1 * .5)})`);
    const mainG = trouver(g, `#${prefixe}-main-${c}`);
    deplacer(mainG, `translate(${r1(m.W.x)} ${r1(m.W.y)}) rotate(${r1(m.dir)}) scale(.8)`);
    const versCentre = c === "g" ? 1 : -1, score = Math.cos(m.dir * DEG) * versCentre - Math.sin(m.dir * DEG) * .8;
    const cote: CoteDeMain = score > 0 ? "miroir" : "droit";
    const cle = cote + pose, emplacement = mainG.firstElementChild;
    if (emplacement instanceof SVGElement && emplacement.dataset["pose"] !== cle) {
      emplacement.innerHTML = MAINS[cote][pose as PoseDeMain] ?? "";
      emplacement.dataset["pose"] = cle;
    }
    return { W: m.W, dir: m.dir };
  }

  function dessinerLaJambe(c: "g" | "d", S: Point, a1: number, a2: number) {
    const g = n(`jambe-${c}`), m = membre(S, a1, a2, 20, 18);
    poser(q1(g, "contour"), "d", trace(m, .06, 1));
    poser(q1(g, "rempli"), "d", trace(m, 0, 1));
    poser(q1(g, "ombre"), "d", trace(decaler(m, 2.8, 1), .3, .9));
    deplacer(n(`pied-${c}`), `translate(${r1(m.W.x)} ${r1(m.W.y + 4)}) rotate(${r1(m.dir * .4)})`);
  }

  /** La frange, au-dessus des sourcils : elle s'arrête aux tempes (rien ne descend à côté des yeux). */
  function dessinerLaFrange(fx: number) {
    poser(n("frange-forme"), "d", `M${r1(-42 + fx)} -24 Q-44 -46 -26 -52 Q-12 -58 0 -54 Q12 -58 26 -52 Q44 -46 ${r1(42 + fx)} -24 Q${r1(36 + fx)} -34 ${r1(30 + fx)} -29 Q${r1(22 + fx)} -40 ${r1(12 + fx)} -30 Q${r1(4 + fx)} -42 ${r1(-6 + fx)} -30 Q${r1(-14 + fx)} -42 ${r1(-24 + fx)} -30 Q${r1(-34 + fx)} -36 ${r1(-42 + fx)} -24 Z`);
    poser(n("frange-ombre"), "d", `M${r1(-6 + fx)} -52 Q${r1(-2 + fx)} -44 ${r1(-8 + fx)} -32 M${r1(14 + fx)} -50 Q${r1(18 + fx)} -42 ${r1(13 + fx)} -31 M${r1(-26 + fx)} -46 Q${r1(-24 + fx)} -40 ${r1(-25 + fx)} -31`);
    poser(n("frange-lumiere"), "d", `M${r1(-30 + fx)} -44 Q${r1(-20 + fx)} -52 ${r1(-10 + fx)} -46 M${r1(2 + fx)} -48 Q${r1(10 + fx)} -54 ${r1(20 + fx)} -46`);
  }

  function dessinerLaTete(p: Pose, ex: Expression<Emotion>, lidBase: number, pup: number) {
    const v = p.vue, dx = v * 9;
    for (const [id, sg] of [["oreille-g", -1], ["oreille-d", 1]] as const) {
      poser(n(id), "opacity", sg * v < .5 ? 1 : 0);
      deplacer(n(id), `translate(${r1(sg * 39 + dx * 1.3)} 2) scale(${r3(Math.max(.3, 1 - Math.max(0, sg * v) * .9))} 1)`);
    }
    deplacer(n("joue-g"), `translate(${r1(-22 + dx * 1.5)} 11) scale(${r3(1 + Math.min(0, v) * .25)} 1)`);
    deplacer(n("joue-d"), `translate(${r1(22 + dx * 1.5)} 11) scale(${r3(1 - Math.max(0, v) * .25)} 1)`);
    deplacer(n("nez"), `translate(${r1(dx * 1.7)} 6)`);
    deplacer(n("bouche"), `translate(${r1(dx * 1.6)} 18)`);
    const A = EMOS[ex.prec], B = EMOS[ex.emo], u = ex.u, s = couple(A.s, B.s, u);
    for (const m of bouches) {
      const e = m.getAttribute("data-emo");
      poser(m, "opacity", e === ex.emo ? u : e === ex.prec ? 1 - u : 0);
      if (e === ex.emo) deplacer(m, `scale(${r3(lerp(.7, 1, E.retour(u)))})`);
    }
    for (const [c, sg, lidExtra] of [["g", -1, 0], ["d", 1, p.clin]] as const) {
      const x = sg * 15 + dx * 1.4, kx = 1 - Math.abs(v) * (sg * v > 0 ? .05 : .22);
      deplacer(n(`oeil-${c}`), `translate(${r1(x)} -6) scale(${r3(kx)} 1)`);
      deplacer(n(`sourcil-${c}`), `translate(${r1(x)} ${r1(-24 + s[0])}) scale(${r3(kx)} 1) rotate(${r1(s[1] * sg)})`);
      deplacer(n(`paupiere-${c}`), `translate(0 ${r1(-23 * (1 - Math.max(lidBase, lidExtra)))})`);
      deplacer(n(`regard-${c}`), `translate(${r1(p.regardX + v * 2 - .5 * (pup - 1))} ${r1(p.regardY - 2.5 * (pup - 1))}) scale(${pup})`);
    }
    dessinerLaFrange(dx * .6);
    deplacer(n("tiare"), `translate(${r1(dx * .8)} -40) rotate(${r1(v * 6)})`);
  }

  function dessinerLesAiles(p: Pose, t: number) {
    const vitesse = lerp(2.2, 14, p.vol), amplitude = lerp(.12, .42, p.vol), k = Math.sin(t * Math.PI * 2 * vitesse);
    const ouverture = r3(1 - amplitude * (k + 1) / 2);
    deplacer(n("aile-g"), `translate(${r1(-12 + p.vue * 10)} -104) scale(${ouverture} 1) rotate(${r1(k * 6)})`);
    deplacer(n("aile-d"), `translate(${r1(12 + p.vue * 10)} -104) scale(${ouverture} 1) rotate(${r1(-k * 6)})`);
  }

  /** La robe : corsage et jupe évasée à plis, jusqu'aux genoux ; la jupe gonfle quand Lumi monte. */
  function dessinerLaRobe(p: Pose, t: number, vy: number) {
    const robe = n("robe"), v = p.vue, w = 1 - Math.abs(v) * .15, J = 46 * w, T = 22 * w, dxr = v * 6;
    const lift = clamp01(-vy * .004) * .6 + p.vol * .5, balance = Math.sin(t * 2.2) * 1.6 * (1 - p.vol) + Math.sin(t * 9) * 1.2 * p.vol;
    const sxJ = 1 + lift * .22, syJ = 1 - lift * .14, Jy = (y: number) => -82 + (y + 82) * syJ;
    const PLIS = 4, plisX = Array.from({ length: PLIS + 1 }, (_, i) => -J + 2 * J * i / PLIS);
    const x = (i: number) => plisX[i] ?? 0;
    let jupe = `M${r1(-T + dxr)} -82 Q${r1(-J)} -56 ${r1(-J)} ${r1(Jy(-34))}`;
    for (let i = 0; i < PLIS; i++) jupe += ` Q${r1((x(i) + x(i + 1)) / 2)} ${r1(Jy(-24))} ${r1(x(i + 1))} ${r1(Jy(-34))}`;
    jupe += ` Q${r1(J)} -56 ${r1(T + dxr)} -82 Z`;
    poser(q1(robe, "jupe"), "d", jupe);
    poser(q1(robe, "jupe-arriere"), "d", `M${r1(-T + dxr)} -80 Q${r1(-J - 4)} -52 ${r1(-J - 2)} ${r1(Jy(-30))} Q0 ${r1(Jy(-20))} ${r1(J + 2)} ${r1(Jy(-30))} Q${r1(J + 4)} -52 ${r1(T + dxr)} -80 Z`);
    const interieurs = plisX.slice(1, PLIS);
    poser(q1(robe, "jupe-plis"), "d", interieurs.map((px) => {
      const xt = dxr + (px / J) * T * .9;
      return `M${r1(xt - 2)} -80 Q${r1(px * .7)} -56 ${r1(px - 7)} ${r1(Jy(-33))} Q${r1(px)} ${r1(Jy(-30))} ${r1(px + 6)} ${r1(Jy(-33))} Q${r1(px * .75)} -56 ${r1(xt + 2)} -80 Z`;
    }).join(" "));
    poser(q1(robe, "jupe-ombre"), "d", interieurs.map((px) => `M${r1(dxr + (px / J) * T * .9)} -79 Q${r1(px * .72)} -56 ${r1(px - 1)} ${r1(Jy(-36))}`).join(" "));
    poser(q1(robe, "jupe-lumiere"), "d", [0, 1].map((i) => {
      const xc = x(i) + J / PLIS, xt = dxr + (xc / J) * T * .8;
      return `M${r1(xt - 4)} -76 Q${r1(xc - 8)} -58 ${r1(xc - 7)} ${r1(Jy(-44))} Q${r1(xc - 2)} ${r1(Jy(-46))} ${r1(xc + 1)} ${r1(Jy(-48))} Q${r1(xc - 2)} -60 ${r1(xt + 2)} -76 Z`;
    }).join(" "));
    for (const classe of ["jupe", "jupe-arriere", "jupe-plis", "jupe-ombre", "jupe-lumiere"]) {
      deplacer(q1(robe, classe), `translate(${r1(dxr)} -82) skewX(${r1(balance)}) scale(${r3(sxJ)} 1) translate(${r1(-dxr)} 82)`);
    }
    poser(q1(robe, "corsage"), "d", `M${r1(-20 * w + dxr)} -108 Q${r1(-24 * w + dxr)} -94 ${r1(-T + dxr)} -80 H${r1(T + dxr)} Q${r1(24 * w + dxr)} -94 ${r1(20 * w + dxr)} -108 Q0 -112 ${r1(-20 * w + dxr)} -108 Z`);
    poser(q1(robe, "corsage-ombre"), "d", `M${r1(8 * w + dxr)} -108 Q${r1(22 * w + dxr)} -96 ${r1(T + dxr)} -80 H${r1(T * .5 + dxr)} Q${r1(12 * w + dxr)} -96 ${r1(8 * w + dxr)} -108 Z`);
    poser(q1(robe, "ceinture"), "d", `M${r1(-T + 2 + dxr)} -82 Q0 -76 ${r1(T - 2 + dxr)} -82`);
    poser(q1(robe, "col"), "d", `M${r1(-9 + dxr)} -109 Q0 -100 ${r1(9 + dxr)} -109 Q0 -113 ${r1(-9 + dxr)} -109 Z`);
    deplacer(q1(robe, "etincelle-du-corsage"), `translate(${r1(dxr)} -94)`);
  }

  /** Le bras loin de la caméra passe derrière la robe. */
  function placerLesBras(p: Pose, v: number, w: number, dxr: number) {
    for (const c of ["g", "d"] as const) {
      const cote = c === "g" ? -1 : 1, derriere = v * cote < -.3, cible = derriere ? n("bras-arriere") : n("bras-avant");
      if (bras[c].parentNode !== cible) cible.append(bras[c]);
      const S = { x: cote * 23 * w + dxr, y: -100 };
      const r = dessinerLeBras(bras[c], c, S, c === "g" ? p.aGu : -p.aDu, c === "g" ? p.aGl : -p.aDl, Math.round(c === "g" ? p.mG : p.mD));
      if (c === "d") mainDroite = r;
    }
  }

  /** La baguette est dans la main droite, dans le prolongement de l'avant-bras ; rend son bout. */
  function dessinerLaBaguette(p: Pose): Point | null {
    const main = dansLaScene(racine, n("lumi"), mainDroite.W);
    const angle = mainDroite.dir + p.rot, echelle = BASE * .9;
    let bout: Point | null = null;
    if (main) {
      deplacer(n("baguette"), `translate(${r1(main.x)} ${r1(main.y)}) rotate(${r1(angle)}) scale(${r3(echelle)})`);
      const sens = angle * DEG;
      bout = { x: main.x + Math.sin(sens) * 40 * echelle, y: main.y - Math.cos(sens) * 40 * echelle };
    }
    return bout;
  }

  /** Dessine Lumi à l'instant `t` du scénario ; rend sa pose et le bout de sa baguette (les effets s'y accrochent). */
  function dessiner(scenario: ScenarioDesPrincesses, t: number): LumiDessinee {
    const p = poseA(scenario.poses, t), pAvant = poseA(scenario.poses, t - .06);
    const vx = (p.x - pAvant.x) / .06, vy = (p.y - pAvant.y) / .06;
    const flotte = Math.sin(t * 2.2) * 4 - 10 * (1 - p.vol);
    deplacer(n("lumi"), `translate(${r1(p.x)} ${r1(p.y + flotte)}) rotate(${r1(p.rot)}) scale(${r3(BASE * p.sx)} ${r3(BASE * p.sy)})`);
    dessinerLesAiles(p, t);
    cheveux.dessiner(p, t, vx, vy);
    deplacer(n("cheveux-arriere"), `translate(${r1(p.vue * 4)} -150) rotate(${r1(p.tete)}) translate(0 150)`);
    dessinerLaRobe(p, t, vy);
    const v = p.vue, w = 1 - Math.abs(v) * .15, dxr = v * 6;
    habit.suivre({ cw: w, sw: 0, dx: dxr });
    dessinerLaJambe("g", { x: -10 * w + dxr, y: -40 }, 4 - p.vol * 10, -2 + p.vol * 30);
    dessinerLaJambe("d", { x: 10 * w + dxr, y: -40 }, -4 - p.vol * 6, 2 + p.vol * 24);
    placerLesBras(p, v, w, dxr);
    deplacer(n("tete"), `translate(${r1(v * 4)} -150) rotate(${r1(p.tete)})`);
    const ex = expressionA(scenario.expressions, t), A = EMOS[ex.prec], B = EMOS[ex.emo], u = ex.u;
    dessinerLaTete(p, ex, Math.max(lerp(A.lid, B.lid, u), clignement(t)), lerp(A.pup, B.pup, u));
    const bout = dessinerLaBaguette(p);
    const haut = Math.max(0, solY - p.y - flotte), ombre = n("ombre-sol");
    poser(ombre, "cx", r1(p.x));
    poser(ombre, "rx", r1(Math.max(16, 40 - haut * .12)));
    poser(ombre, "opacity", r3(Math.max(.04, .2 - haut * .0008)));
    return { pose: p, boutDeLaBaguette: bout };
  }

  return { dessiner };
}
