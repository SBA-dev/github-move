import { clamp01, DEG, E, fenetre, lerp, r1, r3 } from "../commun/courbes.ts";
import { deplacer, elementsDe, poser, trouver } from "../commun/dom.ts";
import type { Point } from "../commun/membres.ts";
import { ECHELLE_DE_BASE } from "./personnage.ts";
import { type Pose, type ScenarioDeDanse, T_PIROUETTE, T_VARIANTE } from "./poses.ts";

const COULEURS_DES_RAYONS = ["#7A35C8", "#FFC93C", "#FFFFFF", "#FF8FB8"];
/** Le centre et le rayon de l'étoile que le ruban dessine autour de Lili. */
const CENTRE_DE_L_ETOILE = { x: 180, y: 244 };
const RAYON_DE_L_ETOILE = 74;
const BRANCHES_DE_L_ETOILE = 5;

const AU_DESSUS_DE_LA_MAIN: Point = { x: 0, y: -20 };

function auPoint(matrice: DOMMatrix, p: Point): Point {
  const image = new DOMPoint(p.x, p.y).matrixTransform(matrice);
  return { x: image.x, y: image.y };
}

/**
 * Le cri de victoire, les rayons, l'étoile et les gouttes de joie, les traits de vitesse de la pirouette,
 * la lumière des projecteurs et, pour la variante du ruban, le ruban qui dessine une étoile.
 */
export function creerLesEffets(racine: SVGSVGElement) {
  const n = elementsDe(racine, "danse");
  n("etoiles").innerHTML = [0, 1, 2].map(() => `<path d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z"/>`).join("");
  n("gouttes").innerHTML = [0, 1].map(() => `<path d="M0 -4 Q3 0 0 3 Q-3 0 0 -4 Z"/>`).join("");
  n("vitesse").innerHTML = [0, 1, 2].map((i) => `<path d="M0 ${-22 + i * 14} q-14 6 -22 20" opacity="${.8 - i * .2}"/>`).join("");
  n("rayons").innerHTML = Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-40" x2="0" y2="-64" transform="rotate(${i * 30})" stroke="${COULEURS_DES_RAYONS[i % 4]}" stroke-width="5" stroke-linecap="round"/>`).join("");
  const traceDuRuban: { x: number; y: number; t: number }[] = [];

  function dessinerLeCri(scenario: ScenarioDeDanse, t: number) {
    const u = fenetre(t, scenario.tCri, .5, E.rebond), r = fenetre(t, scenario.tCri, .55);
    poser(n("cri"), "opacity", r3(fenetre(t, scenario.tCri, .12)));
    deplacer(n("cri"), `rotate(${r1(lerp(-8, 0, u))}) scale(${r3(.2 + .8 * u)})`);
    poser(n("rayons"), "opacity", r3((1 - fenetre(t, scenario.tCri + .25, .35, E.entree)) * fenetre(t, scenario.tCri, .08)));
    deplacer(n("rayons"), `scale(${r3(.6 + r * .9)}) rotate(${r1(r * 25)})`);
  }

  function dessinerLaJoie(scenario: ScenarioDeDanse, t: number, p: Pose) {
    const d = scenario.tJoie;
    if (t < d || t > d + 1) {
      poser(n("etoiles"), "opacity", 0);
      poser(n("gouttes"), "opacity", 0);
      return;
    }
    poser(n("etoiles"), "opacity", 1);
    poser(n("gouttes"), "opacity", 1);
    const cx = p.x, cy = p.y - 100 * ECHELLE_DE_BASE;
    [...n("etoiles").children].forEach((e, i) => {
      const u = fenetre(t, d + i * .1, .7, E.sortie), k = Math.sin(Math.min(1, u) * Math.PI), a = -2.4 + i * 1.1;
      deplacer(e, `translate(${r1(cx + Math.cos(a) * (34 + u * 22))} ${r1(cy + Math.sin(a) * (26 + u * 14))}) rotate(${r1(u * 120)}) scale(${r3(k * 1.3)})`);
    });
    [...n("gouttes").children].forEach((g, i) => {
      const u = fenetre(t, d + .05 + i * .08, .5, E.sortie), s = i ? 1 : -1;
      deplacer(g, `translate(${r1(cx + s * (22 + u * 16))} ${r1(cy + 6 - u * 10 + u * u * 16)}) rotate(${s * 30}) scale(${r3((1 - u) * 1.4)})`);
    });
  }

  function dessinerLaVitesse(t: number, p: Pose) {
    const s = t - T_PIROUETTE;
    if (s < .04 || s > .46) {
      poser(n("vitesse"), "opacity", 0);
      return;
    }
    const u = (s - .04) / .42;
    poser(n("vitesse"), "opacity", r3(Math.sin(u * Math.PI) * .9));
    deplacer(n("vitesse"), `translate(${r1(p.x - 30 * ECHELLE_DE_BASE)} ${r1(p.y - 44 * ECHELLE_DE_BASE)}) scale(${r3(.8 + u * .5)} 1)`);
  }

  /** Les projecteurs s'intensifient au cri ; le cercle de lumière suit Lili. */
  function dessinerLaLumiere(scenario: ScenarioDeDanse, t: number, p: Pose) {
    poser(n("faisceaux"), "opacity", r3(t > scenario.tCri ? .85 + .15 * fenetre(t, scenario.tCri, .6) : .85));
    poser(n("cercle-lumiere"), "cx", r1(p.x));
    poser(n("cercle-lumiere"), "cy", r1(p.y + 58 * ECHELLE_DE_BASE + 4));
  }

  /** Le bout du ruban : la main droite de Lili, dans l'espace de la scène (rien si la scène n'est pas affichée). */
  function positionDeLaMain(): Point | null {
    const main = n("main-d"), image = racine.getScreenCTM(), mainSurEcran = main instanceof SVGGraphicsElement ? main.getScreenCTM() : null;
    if (!image || !mainSurEcran) return null;
    return auPoint(image.inverse().multiply(mainSurEcran), AU_DESSUS_DE_LA_MAIN);
  }

  /** Le ruban suit la main droite et, pendant la rotation, la pointe dessine une étoile à cinq branches autour de Lili ; l'étoile brille ensuite. */
  function dessinerLeRuban(scenario: ScenarioDeDanse, t: number) {
    const main = scenario.variante === "ruban" && t >= T_VARIANTE ? positionDeLaMain() : null;
    if (!main) {
      poser(n("ruban"), "opacity", 0);
      poser(n("etoile-ruban"), "opacity", 0);
      traceDuRuban.length = 0;
      return;
    }
    const u = clamp01((t - (T_VARIANTE + .4)) / 1.8), C = CENTRE_DE_L_ETOILE;
    const k = u * BRANCHES_DE_L_ETOILE, i = Math.floor(k), f = k - i;
    const sommet = (j: number): Point => {
      const angle = (-90 + j * 144) * DEG;
      return { x: C.x + Math.cos(angle) * RAYON_DE_L_ETOILE, y: C.y + Math.sin(angle) * RAYON_DE_L_ETOILE };
    };
    const A = sommet(i), B = sommet(i + 1);
    const pointe = u < 1 ? { x: lerp(A.x, B.x, f), y: lerp(A.y, B.y, f) } : { x: main.x, y: main.y - 24 };
    const derniere = traceDuRuban[traceDuRuban.length - 1];
    if (!derniere || Math.hypot(pointe.x - derniere.x, pointe.y - derniere.y) > 2) traceDuRuban.push({ ...pointe, t });
    while (traceDuRuban.length && t - (traceDuRuban[0]?.t ?? t) > (u < 1 ? 2.2 : .8)) traceDuRuban.shift();
    const points = traceDuRuban.map((q) => `${r1(q.x)} ${r1(q.y)}`);
    const d = points.length ? `M${r1(main.x)} ${r1(main.y)} L${points.slice().reverse().join(" L")}` : "";
    poser(n("ruban"), "opacity", 1);
    poser(trouver(n("ruban"), ".trace"), "d", d);
    poser(trouver(n("ruban"), ".eclat"), "d", d);
    const brille = fenetre(t, T_VARIANTE + 2.25, .5, E.rebond);
    poser(n("etoile-ruban"), "opacity", r3(brille));
    deplacer(n("etoile-ruban"), `translate(${C.x} ${C.y}) rotate(${r1(-20 + brille * 20)}) scale(${r3(Math.max(.01, brille * 1.3 * (0.8 + .2 * Math.sin(t * 9))))})`);
  }

  function dessiner(scenario: ScenarioDeDanse, t: number, p: Pose) {
    dessinerLeCri(scenario, t);
    dessinerLaJoie(scenario, t, p);
    dessinerLaVitesse(t, p);
    dessinerLaLumiere(scenario, t, p);
    dessinerLeRuban(scenario, t);
  }

  return { dessiner };
}
