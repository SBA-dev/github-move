import { ECHELLE_DE_BASE } from "./personnage.ts";
import { E, fenetre, lerp, r1, r3 } from "../commun/courbes.ts";
import { deplacer, elementsDe, poser } from "../commun/dom.ts";
import { POINT_DU_FILET } from "./ballon-et-filet.ts";
import { type Pose, poseA, type ScenarioDeBut, T_IMPACT, T_VARIANTE } from "./poses.ts";

const COULEURS_DES_RAYONS = ["#1F63D8", "#FFC93C", "#FFFFFF", "#4C8FF5"];

/** Le cri de victoire, les rayons, l'étoile et les gouttes de joie, la poussière de la glissade, l'impact, les traits de vitesse. */
export function creerLesEffets(racine: SVGSVGElement) {
  const n = elementsDe(racine, "sports");
  n("etoiles").innerHTML = [0, 1, 2].map(() => `<path d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z"/>`).join("");
  n("gouttes").innerHTML = [0, 1].map(() => `<path d="M0 -4 Q3 0 0 3 Q-3 0 0 -4 Z"/>`).join("");
  n("impact").innerHTML = Array.from({ length: 8 }, (_, i) => `<line x1="0" y1="-10" x2="0" y2="-18" transform="rotate(${i * 45})"/>`).join("");
  n("vitesse").innerHTML = [0, 1, 2].map((i) => `<path d="M0 ${-22 + i * 14} q-14 6 -22 20" opacity="${.8 - i * .2}"/>`).join("");
  n("rayons").innerHTML = Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-40" x2="0" y2="-64" transform="rotate(${i * 30})" stroke="${COULEURS_DES_RAYONS[i % 4]}" stroke-width="5" stroke-linecap="round"/>`).join("");
  n("poussiere").innerHTML = Array.from({ length: 10 }, () => `<circle r="4"/>`).join("");

  function dessinerLeCri(scenario: ScenarioDeBut, t: number) {
    const u = fenetre(t, scenario.tCri, .5, E.rebond), r = fenetre(t, scenario.tCri, .55);
    poser(n("cri"), "opacity", r3(fenetre(t, scenario.tCri, .12)));
    deplacer(n("cri"), `rotate(${r1(lerp(-8, 0, u))}) scale(${r3(.2 + .8 * u)})`);
    poser(n("rayons"), "opacity", r3((1 - fenetre(t, scenario.tCri + .25, .35, E.entree)) * fenetre(t, scenario.tCri, .08)));
    deplacer(n("rayons"), `scale(${r3(.6 + r * .9)}) rotate(${r1(r * 25)})`);
  }

  function dessinerLaPoussiere(scenario: ScenarioDeBut, t: number) {
    const actif = scenario.variante === "glissade";
    [...n("poussiere").children].forEach((c, i) => {
      const instant = T_VARIANTE + .8 + i * .07, u = actif ? Math.max(0, Math.min(1, (t - instant) / .5)) : 0;
      if (u <= 0 || u >= 1) {
        poser(c, "opacity", 0);
        return;
      }
      const pn = poseA(scenario.poses, instant);
      const x = pn.x - 18 * pn.s * ECHELLE_DE_BASE - u * (14 + (i % 3) * 10) * (i % 2 ? -1 : 1) * .5 - u * 10;
      const y = pn.y + 30 * pn.s * ECHELLE_DE_BASE - u * (10 + (i % 3) * 6);
      deplacer(c, `translate(${r1(x)} ${r1(y)}) scale(${r3(.5 + u * 1.8)})`);
      poser(c, "opacity", r3((1 - u) * .8));
    });
  }

  function dessinerLaJoie(scenario: ScenarioDeBut, t: number, p: Pose) {
    const d = scenario.tJoie;
    if (t < d || t > d + 1) {
      poser(n("etoiles"), "opacity", 0);
      poser(n("gouttes"), "opacity", 0);
      return;
    }
    poser(n("etoiles"), "opacity", 1);
    poser(n("gouttes"), "opacity", 1);
    const cx = p.x, cy = p.y - 100 * p.s * ECHELLE_DE_BASE;
    [...n("etoiles").children].forEach((e, i) => {
      const u = fenetre(t, d + i * .1, .7, E.sortie), k = Math.sin(Math.min(1, u) * Math.PI), a = -2.4 + i * 1.1;
      deplacer(e, `translate(${r1(cx + Math.cos(a) * (34 + u * 22) * p.s)} ${r1(cy + Math.sin(a) * (26 + u * 14) * p.s)}) rotate(${r1(u * 120)}) scale(${r3(k * 1.3)})`);
    });
    [...n("gouttes").children].forEach((g, i) => {
      const u = fenetre(t, d + .05 + i * .08, .5, E.sortie), s = i ? 1 : -1;
      deplacer(g, `translate(${r1(cx + s * (22 + u * 16) * p.s)} ${r1(cy + 6 - u * 10 + u * u * 16)}) rotate(${s * 30}) scale(${r3((1 - u) * 1.4)})`);
    });
  }

  function dessinerLImpact(t: number) {
    const s = t - T_IMPACT;
    if (s < 0 || s > .22) {
      poser(n("impact"), "opacity", 0);
      return;
    }
    const u = s / .22;
    poser(n("impact"), "opacity", r3(1 - u));
    deplacer(n("impact"), `translate(${POINT_DU_FILET.x} ${POINT_DU_FILET.y}) scale(${r3((.5 + u) * .55)})`);
  }

  function dessinerLaVitesse(scenario: ScenarioDeBut, t: number, p: Pose) {
    const s = t - scenario.tTour;
    if (s < .06 || s > .46) {
      poser(n("vitesse"), "opacity", 0);
      return;
    }
    const u = (s - .06) / .4;
    poser(n("vitesse"), "opacity", r3(Math.sin(u * Math.PI) * .9));
    deplacer(n("vitesse"), `translate(${r1(p.x - 30 * p.s * ECHELLE_DE_BASE)} ${r1(p.y - 44 * p.s * ECHELLE_DE_BASE)}) scale(${r3(.8 + u * .5)} 1)`);
  }

  function dessiner(scenario: ScenarioDeBut, t: number, p: Pose) {
    dessinerLImpact(t);
    dessinerLeCri(scenario, t);
    dessinerLaPoussiere(scenario, t);
    dessinerLaJoie(scenario, t, p);
    dessinerLaVitesse(scenario, t, p);
  }

  return { dessiner };
}
