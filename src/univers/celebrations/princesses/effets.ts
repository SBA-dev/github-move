import { clamp01, E, fenetre, lerp, r1, r3 } from "../commun/courbes.ts";
import { deplacer, elementsDe, poser, trouver } from "../commun/dom.ts";
import type { Point } from "../commun/membres.ts";
import { suiteDeNombres } from "../commun/suite-de-nombres.ts";
import { CONTOUR } from "./dessin-de-lumi.ts";
import { etincelle, fleurMagique, type Teinte } from "./magie.ts";
import { FLEUR, SOL, T_ECLOT, T_SORT, type Pose, type ScenarioDesPrincesses } from "./poses.ts";
import type { LumiDessinee } from "./personnage.ts";

const COULEURS_DES_RAYONS = ["#A23BB8", "#FFC93C", "#FFFFFF", "#FF8FB8"];
const COULEURS_DE_L_ARC_EN_CIEL = ["#FF6B6B", "#FFB84D", "#FFE66D", "#6BCB77", "#4D96FF", "#B07CF0"];
const SIGNES: readonly { readonly signe: string; readonly couleur: string; readonly teinte: Teinte }[] = [
  { signe: "1", couleur: "#FFC93C", teinte: "rosePale" },
  { signe: "2", couleur: "#FF8FB8", teinte: "rose" },
  { signe: "3", couleur: "#9FD3FF", teinte: "bleu" },
  { signe: "A", couleur: "#B07CF0", teinte: "violet" },
  { signe: "B", couleur: "#6BCB77", teinte: "vert" },
  { signe: "C", couleur: "#FFB84D", teinte: "orange" },
];
const NOMBRE_DE_FLEURS_DE_LA_COURONNE = 7;
const NOMBRE_D_ETINCELLES_DE_L_ENVOL = 24;
const DUREE_DE_LA_TRAINEE = .55;
const CENTRE_DE_L_ARC_EN_CIEL: Point = { x: SOL.x, y: 156 };
const NOMBRE_D_ETINCELLES_DE_LA_TRAINEE = 12;

type Etincelle = { readonly x: number; readonly y: number; readonly t: number; readonly r: number };

/**
 * Tout ce qui entoure Lumi : le sort et la fleur qui éclot, l'arc-en-ciel et sa couronne, l'envol, les chiffres et les lettres,
 * le cri de victoire et les gouttes de joie. `animee` : sans elle (mouvements réduits), rien de ce qui bouge à part la scène elle-même : pas de traînée, pas d'étincelles d'envol.
 */
export function creerLesEffets(racine: SVGSVGElement, animee: boolean) {
  const n = elementsDe(racine, "princesse");
  const suite = suiteDeNombres(106);
  n("trainee").innerHTML = Array.from({ length: NOMBRE_D_ETINCELLES_DE_LA_TRAINEE }, () => `<circle r="2"/>`).join("");
  poser(n("trainee"), "fill", "#FFF3B0");
  poser(n("trainee"), "stroke", "none");
  n("sort").innerHTML = `<circle r="16" fill="url(#princesse-lueur)" transform="scale(1.6)"/>${etincelle(14)}`;
  n("fleur").innerHTML = `<g class="tige"><path d="M0 0 Q-4 -20 0 -44" fill="none" stroke="#3F9A63" stroke-width="5" stroke-linecap="round"/><path d="M0 -20 Q-16 -24 -18 -36 Q-6 -36 0 -22 Z M0 -28 Q16 -32 18 -44 Q6 -44 0 -30 Z" fill="#6CBF84" stroke="${CONTOUR}" stroke-width="2.2" stroke-linejoin="round"/></g><g class="corolle" transform="translate(0 -46)">${[0, 1, 2, 3, 4, 5, 6, 7].map((k) => `<ellipse class="petale" rx="9" ry="20" transform="rotate(${k * 45}) translate(0 -16)" fill="${k % 2 ? "#FF8FB8" : "#FFB3D1"}" stroke="${CONTOUR}" stroke-width="2.2"/>`).join("")}<circle r="11" fill="#FFC93C" stroke="${CONTOUR}" stroke-width="2.4"/><circle cx="-3" cy="-3" r="3" fill="#FFF1A8"/></g>`;
  n("arc-en-ciel").innerHTML = COULEURS_DE_L_ARC_EN_CIEL.map((c, i) => `<path d="M${-118 + i * 8} 0 A${118 - i * 8} ${118 - i * 8} 0 0 1 ${118 - i * 8} 0" stroke="${c}" stroke-width="8" pathLength="100" stroke-dasharray="100" stroke-dashoffset="100"/>`).join("");
  n("couronne").innerHTML = Array.from({ length: NOMBRE_DE_FLEURS_DE_LA_COURONNE }, (_, i) => `<g>${fleurMagique(i === 3 ? 9 : 6, i % 2 ? "blanc" : "rosePale")}</g>`).join("");
  n("etincelles-d-envol").innerHTML = Array.from({ length: NOMBRE_D_ETINCELLES_DE_L_ENVOL }, (_, i) => `<g>${etincelle(4, i)}</g>`).join("");
  n("signes").innerHTML = SIGNES.map(({ signe, couleur, teinte }) => `<g><text class="signe-magique" text-anchor="middle" dominant-baseline="middle" font-weight="800" font-size="30" fill="${couleur}" stroke="${CONTOUR}" stroke-width="5" stroke-linejoin="round" paint-order="stroke">${signe}</text><g class="devenu-forme" opacity="0">${fleurMagique(10, teinte)}</g></g>`).join("");
  n("joie").innerHTML = [0, 1, 2].map((i) => `<g>${etincelle(7, i)}</g>`).join("");
  n("rayons").innerHTML = Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-40" x2="0" y2="-64" transform="rotate(${i * 30})" stroke="${COULEURS_DES_RAYONS[i % 4]}" stroke-width="5" stroke-linecap="round"/>`).join("");
  const enfants = (id: string) => [...n(id).children];
  const trace: { x: number; y: number; t: number }[] = [];
  const etincellesDEnvol: Etincelle[] = [];
  let departDuSort: Point = { x: 0, y: 0 };

  /** La trace de la baguette : des points qui s'éteignent. Jamais affichée avec les mouvements réduits. */
  function dessinerLaTrainee(t: number, bout: Point | null) {
    poser(n("trainee"), "opacity", animee && bout ? 1 : 0);
    if (!animee || !bout) return;
    const derniere = trace[trace.length - 1];
    if (!derniere || Math.hypot(bout.x - derniere.x, bout.y - derniere.y) > 3) trace.push({ ...bout, t });
    while (trace.length && t - (trace[0]?.t ?? t) > DUREE_DE_LA_TRAINEE) trace.shift();
    enfants("trainee").forEach((c, i) => {
      const q = trace[trace.length - 1 - i * 2];
      if (!q) return poser(c, "opacity", 0);
      const age = clamp01((t - q.t) / DUREE_DE_LA_TRAINEE);
      poser(c, "opacity", r3((1 - age) * .9));
      poser(c, "r", r1(2.6 * (1 - age) + .4));
      poser(c, "cx", r1(q.x + Math.sin(i * 2.1 + t * 3) * 3));
      poser(c, "cy", r1(q.y - age * 10));
    });
  }

  /** L'étincelle quitte la baguette, flotte en un grand arc jusqu'à la fleur, qui éclot. */
  function dessinerLeSortEtLaFleur(t: number, bout: Point | null) {
    if (bout && t <= T_SORT + .02) departDuSort = bout;
    const enVol = t >= T_SORT && t < T_ECLOT;
    poser(n("sort"), "opacity", enVol ? 1 : 0);
    if (enVol) {
      const u = fenetre(t, T_SORT, T_ECLOT - T_SORT, E.douce), x = lerp(departDuSort.x, FLEUR.x, u), y = lerp(departDuSort.y, FLEUR.y - 46, u) - 70 * Math.sin(u * Math.PI);
      deplacer(n("sort"), `translate(${r1(x)} ${r1(y)}) rotate(${r1(u * 180)}) scale(${r3(.6 + .4 * Math.sin(u * Math.PI))})`);
    }
    poser(n("fleur"), "opacity", t < T_ECLOT ? 0 : 1);
    if (t < T_ECLOT) return;
    const tige = fenetre(t, T_ECLOT, .35), corolle = fenetre(t, T_ECLOT + .2, .45, E.rebond);
    deplacer(n("fleur"), `translate(${FLEUR.x} ${FLEUR.y})`);
    deplacer(trouver(n("fleur"), ".tige"), `scale(1 ${r3(Math.max(.02, tige))})`);
    deplacer(trouver(n("fleur"), ".corolle"), `translate(0 ${r1(-46 * tige)}) scale(${r3(Math.max(.02, corolle))}) rotate(${r1((1 - corolle) * 90 + Math.sin(t * 2) * 3)})`);
  }

  function dessinerLArcEnCiel(scenario: ScenarioDesPrincesses, t: number) {
    const d = scenario.tVariante, visible = scenario.variante === "arc" && t >= d;
    poser(n("arc-en-ciel"), "opacity", visible ? 1 : 0);
    poser(n("couronne"), "opacity", visible ? fenetre(t, d + 1.5, .1) : 0);
    if (!visible) return;
    deplacer(n("arc-en-ciel"), `translate(${CENTRE_DE_L_ARC_EN_CIEL.x} ${CENTRE_DE_L_ARC_EN_CIEL.y})`);
    enfants("arc-en-ciel").forEach((a, i) => poser(a, "stroke-dashoffset", r1(100 * (1 - fenetre(t, d + i * .08, 1.1, E.douce)))));
    enfants("couronne").forEach((e, i) => {
      const u = fenetre(t, d + 1.5 + i * .07, .45, E.rebond), a = Math.PI + (i / 6) * Math.PI;
      const x = SOL.x + Math.cos(a) * 52, y = 124 + Math.sin(a) * 26;
      deplacer(e, `translate(${r1(x)} ${r1(y + Math.sin(t * 4 + i) * 2)}) rotate(${r1(Math.sin(t * 3 + i) * 10)}) scale(${r3(u * 1.3)})`);
    });
  }

  /** Pendant l'envol, Lumi laisse derrière elle des étincelles qui s'éteignent. */
  function dessinerLEnvol(scenario: ScenarioDesPrincesses, t: number, p: Pose) {
    const toutes = enfants("etincelles-d-envol");
    if (!animee || scenario.variante !== "envol" || t < scenario.tVariante) {
      toutes.forEach((e) => poser(e, "opacity", 0));
      etincellesDEnvol.length = 0;
      return;
    }
    const derniere = etincellesDEnvol[etincellesDEnvol.length - 1];
    if (p.vol > .5 && (!derniere || t - derniere.t > .07)) {
      etincellesDEnvol.push({ x: p.x + (suite() - .5) * 24, y: p.y - 90 + (suite() - .5) * 30, t, r: .8 + suite() * .8 });
    }
    while (etincellesDEnvol.length > NOMBRE_D_ETINCELLES_DE_L_ENVOL) etincellesDEnvol.shift();
    toutes.forEach((e, i) => {
      const q = etincellesDEnvol[i];
      if (!q) return poser(e, "opacity", 0);
      const age = clamp01((t - q.t) / 1.6);
      poser(e, "opacity", r3(1 - age));
      deplacer(e, `translate(${r1(q.x)} ${r1(q.y + age * 18)}) rotate(${r1(age * 180)}) scale(${r3(q.r * (1 + age * .4))})`);
    });
  }

  /**
   * Les chiffres et les lettres lumineux dansent autour de Lumi, puis deviennent de petites formes brillantes
   * qui se rangent en arc au-dessus de sa tête : l'image finale ne cache pas son visage.
   */
  function dessinerLesSignes(scenario: ScenarioDesPrincesses, t: number, p: Pose) {
    const d = scenario.tVariante, visible = scenario.variante === "signes" && t >= d;
    poser(n("signes"), "opacity", visible ? 1 : 0);
    if (!visible) return;
    const cx = p.x, cy = p.y - 150, transformation = fenetre(t, d + 1.75, .35, E.rebond), rangement = fenetre(t, d + 2.1, .6, E.douce);
    enfants("signes").forEach((g, i) => {
      const u = fenetre(t, d + i * .18, .5, E.rebond), a = (t - d) * 1.4 + i * Math.PI / 3;
      const ecart = (i - (SIGNES.length - 1) / 2) / ((SIGNES.length - 1) / 2);
      const x = lerp(cx + Math.cos(a) * 92, cx + ecart * 115, rangement), y = lerp(cy + Math.sin(a) * 44 - 10, 84 + ecart * ecart * 22, rangement);
      deplacer(g, `translate(${r1(x)} ${r1(y)}) scale(${r3(u)}) rotate(${r1(Math.sin(t * 3 + i) * 10 * (1 - rangement))})`);
      const [signe, forme] = [g.firstElementChild, g.lastElementChild];
      if (!signe || !forme) return;
      poser(signe, "opacity", r3(1 - transformation));
      poser(forme, "opacity", r3(transformation));
      deplacer(forme, `rotate(${r1(transformation * 180)})`);
    });
  }

  function dessinerLeCri(scenario: ScenarioDesPrincesses, t: number) {
    const u = fenetre(t, scenario.tCri, .5, E.rebond), r = fenetre(t, scenario.tCri, .55);
    poser(n("cri"), "opacity", r3(fenetre(t, scenario.tCri, .12)));
    deplacer(n("cri"), `rotate(${r1(lerp(-8, 0, u))}) scale(${r3(.2 + .8 * u)})`);
    poser(n("rayons"), "opacity", r3((1 - fenetre(t, scenario.tCri + .25, .35, E.entree)) * fenetre(t, scenario.tCri, .08)));
    deplacer(n("rayons"), `scale(${r3(.6 + r * .9)}) rotate(${r1(r * 25)})`);
  }

  /** Trois petites étincelles jaillissent au-dessus de Lumi quand elle se réjouit. */
  function dessinerLaJoie(scenario: ScenarioDesPrincesses, t: number, p: Pose) {
    const d = scenario.tJoie, visible = t >= d && t <= d + 1;
    poser(n("joie"), "opacity", visible ? 1 : 0);
    if (!visible) return;
    enfants("joie").forEach((e, i) => {
      const u = fenetre(t, d + i * .1, .7), k = Math.sin(Math.min(1, u) * Math.PI), a = -2.4 + i * 1.1;
      deplacer(e, `translate(${r1(p.x + Math.cos(a) * (56 + u * 26))} ${r1(p.y - 240 + Math.sin(a) * (30 + u * 16))}) rotate(${r1(u * 120)}) scale(${r3(k * 1.4)})`);
    });
  }

  function dessiner(scenario: ScenarioDesPrincesses, t: number, { pose, boutDeLaBaguette }: LumiDessinee) {
    dessinerLaTrainee(t, boutDeLaBaguette);
    dessinerLeSortEtLaFleur(t, boutDeLaBaguette);
    dessinerLArcEnCiel(scenario, t);
    dessinerLEnvol(scenario, t, pose);
    dessinerLesSignes(scenario, t, pose);
    dessinerLeCri(scenario, t);
    dessinerLaJoie(scenario, t, pose);
  }

  return { dessiner };
}
