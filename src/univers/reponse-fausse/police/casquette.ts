import { clamp01, DEG, E, fenetre, lerp, r1, r3 } from "../../celebrations/commun/courbes.ts";
import { deplacer, elementsDe, poser } from "../../celebrations/commun/dom.ts";
import { CASQUETTE } from "../../celebrations/police/dessin-de-max.ts";
import type { DessinDeMax } from "../../celebrations/police/personnage.ts";
import { ECHELLE_DE_BASE as BASE, type Pose, poseA, poseDuChiotA, type PoseDuChiot, SOL } from "../../celebrations/police/poses.ts";
import { PREFIXE_DE_MAX } from "./reglages.ts";
import { SCENARIO_DE_MAX, T } from "./scenario.ts";

type Point = { readonly x: number; readonly y: number };

/** La casquette est plus petite pendant que le chiot la porte. */
const TAILLE_PORTEE = .65;
const SOL_DE_LA_CASQUETTE: Point = { x: 232, y: SOL - 14 };

/** Le centre de la casquette sur la tête de Max, dans le repère de la place du moteur. */
const surLaTete = (p: Pose): Point => ({ x: p.x + BASE * 111.8 * Math.sin(p.torse * DEG), y: p.y - BASE * 111.8 * Math.cos(p.torse * DEG) });

/** La gueule du chiot, là où il tient la casquette. */
function gueule(c: PoseDuChiot): Point {
  const lx = lerp(14 + 9, 1.7 + 9, c.assis), ly = lerp(-28 + 6, -37.2 + 7, c.assis);
  return { x: c.x + c.dir * c.sx * 1.05 * lx, y: SOL + 2 + c.y + c.sy * 1.05 * ly };
}

/** La main de Max, dans le repère de la place du moteur. */
function mainDeMax({ pose: p, mains }: DessinDeMax, cote: "g" | "d"): Point {
  const { W } = mains[cote], th = p.torse * DEG;
  return { x: p.x + BASE * p.s * p.sx * (W.x * Math.cos(th) - W.y * Math.sin(th)), y: p.y + BASE * p.s * p.sy * (W.x * Math.sin(th) + W.y * Math.cos(th)) };
}

type Casquette = { readonly position: Point; readonly rotation: number; readonly taille: number };

/** Glisse de la tête de Max jusqu'au sol, où elle rebondit une fois. */
function casquetteQuiTombe(t: number): Casquette {
  const depart = surLaTete(poseA(SCENARIO_DE_MAX.poses, T.glisse));
  if (t < T.atterrit) {
    const u = (t - T.glisse) / (T.atterrit - T.glisse);
    return { position: { x: lerp(depart.x, SOL_DE_LA_CASQUETTE.x, E.sortie(u)), y: lerp(depart.y, SOL_DE_LA_CASQUETTE.y, u * u) }, rotation: lerp(12, 24, u), taille: 1 };
  }
  const rebond = Math.sin(clamp01((t - T.atterrit) / (T.chiotPrend - T.atterrit)) * Math.PI) * 5;
  return { position: { x: SOL_DE_LA_CASQUETTE.x, y: SOL_DE_LA_CASQUETTE.y - rebond }, rotation: 24 - rebond * 2, taille: 1 };
}

/** Dans la gueule du chiot, puis tendue vers Max, qui la prend et la remet sur sa tête. */
function casquetteRapportee(t: number, dessin: DessinDeMax): Casquette {
  const c = poseDuChiotA(SCENARIO_DE_MAX.chiot, t), prise = fenetre(t, T.chiotPrend, .08);
  const dansLaGueule = gueule(c), sol = SOL_DE_LA_CASQUETTE;
  const avantMax = { x: lerp(sol.x, dansLaGueule.x + c.dir * 14, prise), y: lerp(sol.y, dansLaGueule.y - 8, prise) };
  const tendue = fenetre(t, T.maxTend, T.maxPrend - T.maxTend, E.douce), main = mainDeMax(dessin, "d");
  const dansLaMain = { x: lerp(avantMax.x, main.x, tendue), y: lerp(avantMax.y, main.y - 6, tendue) };
  const remise = fenetre(t, T.maxPrend, T.surLaTete - T.maxPrend, E.douce), dessus = surLaTete(dessin.pose);
  return {
    position: { x: lerp(dansLaMain.x, dessus.x, remise), y: lerp(dansLaMain.y, dessus.y, remise) - 14 * Math.sin(remise * Math.PI) },
    rotation: lerp(lerp(24, c.dir * 18, prise), 0, remise),
    taille: lerp(lerp(1, TAILLE_PORTEE, fenetre(t, T.chiotPrend, .12, E.douce)), 1, remise),
  };
}

/**
 * La casquette qui n'est plus sur la tête de Max : elle glisse, reste au sol, passe par la gueule du chiot et la main de Max, puis revient sur sa tête.
 * Le relais avec la casquette de la tête est exact : elle paraît quand celle de la tête disparaît (`casq` passe sous la moitié), et inversement.
 */
function casquetteHorsDeLaTete(t: number, dessin: DessinDeMax): Casquette | undefined {
  if (dessin.pose.casq > .5) return undefined;
  if (t < T.glisse) return { position: surLaTete(dessin.pose), rotation: 0, taille: 1 };
  return t < T.chiotPrend ? casquetteQuiTombe(t) : casquetteRapportee(t, dessin);
}

export function creerLaCasquette(racine: SVGSVGElement) {
  const casquette = elementsDe(racine, PREFIXE_DE_MAX)("casquette-vol");
  casquette.innerHTML = `<g transform="scale(${r3(BASE * .7)}) translate(0 54)">${CASQUETTE}</g>`;

  function dessiner(t: number, dessin: DessinDeMax) {
    const c = casquetteHorsDeLaTete(t, dessin);
    poser(casquette, "opacity", c ? 1 : 0);
    if (c) deplacer(casquette, `translate(${r1(c.position.x)} ${r1(c.position.y)}) rotate(${r1(c.rotation)}) scale(${Math.round(c.taille * 100) / 100})`);
  }

  return { dessiner };
}
