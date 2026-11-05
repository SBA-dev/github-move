import { clamp01, E, fenetre, lerp, r1, r3 } from "../commun/courbes.ts";
import { deplacer, elementsDe, poser } from "../commun/dom.ts";
import type { Point } from "../commun/membres.ts";
import { dessinDeLaNoisette } from "./dessin-de-noisette.ts";
import { ECHELLE_DE_BASE, type Dessin } from "./personnage.ts";
import { BATTEMENT_DU_JONGLAGE, CHUTE, type ScenarioDesAnimaux, T_ATTRAPE } from "./poses.ts";

const COULEURS_DES_RAYONS = ["#C9452F", "#FFC93C", "#FFFFFF", "#6CBF84"];
const NOISETTES_DE_L_ARBRE: readonly (readonly [number, number])[] = [[30, 200], [108, 240], [74, 150]];
const NOISETTES_DE_L_HERBE: readonly (readonly [number, number, number])[] = [[150, 410, .55], [246, 418, .5], [318, 440, .5]];
const NOISETTES_DU_JONGLAGE = 3;
/** Une noisette lancée monte à cette hauteur, en pixels de la scène. */
const HAUTEUR_DU_LANCER = 95;
const NOMBRE_DE_MIETTES = 6;
const NOMBRE_D_ETOILES = 3;
const TRAITS_DE_L_ECLAT = 6;
const NOMBRE_DE_RAYONS = 12;
const DUREE_DE_LA_CROQUEE = 1.3;
/** Le temps entre deux bouchées, en secondes du temps de la maquette. */
const TEMPS_D_UNE_BOUCHEE = .24;

const etoile = `<path d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z"/>`;
const milieuDe = (a: Point, b: Point): Point => ({ x: (a.x + b.x) / 2, y: (a.y + b.y) / 2 });

/**
 * Les noisettes (dans l'arbre, dans l'herbe, qui tombe, tenue, jonglée), les miettes et l'éclat de la noisette croquée,
 * le cri de victoire, les rayons et les petites étoiles de joie.
 */
export function creerLesEffets(racine: SVGSVGElement) {
  const n = elementsDe(racine, "animaux");
  n("noisettes-arbre").innerHTML = NOISETTES_DE_L_ARBRE.map(([x, y]) => `<g transform="translate(${x} ${y})">${dessinDeLaNoisette(.5)}</g>`).join("");
  n("noisettes-herbe").innerHTML = NOISETTES_DE_L_HERBE.map(([x, y, e]) => `<g transform="translate(${x} ${y})">${dessinDeLaNoisette(e)}</g>`).join("");
  n("noisette-vol").innerHTML = dessinDeLaNoisette(1);
  n("noisette-devant").innerHTML = dessinDeLaNoisette(1);
  n("jonglage").innerHTML = Array.from({ length: NOISETTES_DU_JONGLAGE }, () => `<g>${dessinDeLaNoisette(.85)}</g>`).join("");
  n("miettes").innerHTML = Array.from({ length: NOMBRE_DE_MIETTES }, () => `<circle r="2"/>`).join("");
  n("crunch").innerHTML = Array.from({ length: TRAITS_DE_L_ECLAT }, (_, i) => `<line x1="0" y1="-14" x2="0" y2="-22" transform="rotate(${-60 + i * 24})"/>`).join("");
  n("etoiles").innerHTML = Array.from({ length: NOMBRE_D_ETOILES }, () => etoile).join("");
  n("rayons").innerHTML = Array.from({ length: NOMBRE_DE_RAYONS }, (_, i) => `<line x1="0" y1="-40" x2="0" y2="-64" transform="rotate(${i * 30})" stroke="${COULEURS_DES_RAYONS[i % 4]}" stroke-width="5" stroke-linecap="round"/>`).join("");

  /** La noisette dorée : elle tombe de l'arbre, Noisette l'attrape, puis la tient (entre les deux mains ou dans une seule) ou la croque. */
  function dessinerLaNoisetteDoree(scenario: ScenarioDesAnimaux, t: number, { pose: p, mains }: Dessin) {
    const vol = n("noisette-vol"), devant = n("noisette-devant");
    poser(vol, "opacity", 0);
    poser(devant, "opacity", 0);
    if (t < CHUTE.t0) {
      poser(vol, "opacity", 1);
      deplacer(vol, `translate(${CHUTE.x0} ${CHUTE.y0}) rotate(${r1(Math.sin(t * 3) * 6)})`);
      return;
    }
    const entreLesMains = milieuDe(mains.g, mains.d);
    if (t < T_ATTRAPE) {
      const u = clamp01((t - CHUTE.t0) / (T_ATTRAPE - CHUTE.t0));
      poser(vol, "opacity", 1);
      deplacer(vol, `translate(${r1(lerp(CHUTE.x0, entreLesMains.x, u))} ${r1(lerp(CHUTE.y0, entreLesMains.y, u * u))}) rotate(${r1(u * 300)})`);
      return;
    }
    const dansUneMain = p.tenirG > .5 ? mains.g : p.tenirD > .5 ? mains.d : null;
    if (dansUneMain) {
      poser(devant, "opacity", 1);
      deplacer(devant, `translate(${r1(dansUneMain.x)} ${r1(dansUneMain.y)}) scale(.8)`);
    } else if (p.tenir > .5) {
      // croquée, la noisette rapetisse jusqu'à disparaître
      const reste = scenario.tCroque !== null && t > scenario.tCroque ? Math.max(.15, 1 - fenetre(t, scenario.tCroque, 1.1, E.lineaire)) : 1;
      poser(devant, "opacity", 1);
      deplacer(devant, `translate(${r1(entreLesMains.x)} ${r1(entreLesMains.y - 4)}) scale(${r3(reste)})`);
    }
  }

  /** Le jonglage : trois noisettes en cascade d'une main à l'autre. */
  function dessinerLeJonglage(scenario: ScenarioDesAnimaux, t: number, { pose: p, mains }: Dessin) {
    const d = scenario.tJongle;
    if (d === null || t < d || p.bras < .5) {
      poser(n("jonglage"), "opacity", 0);
      return;
    }
    poser(n("jonglage"), "opacity", 1);
    const battement = BATTEMENT_DU_JONGLAGE;
    [...n("jonglage").children].forEach((noisette, i) => {
      const local = t - d + i * battement, cycle = Math.floor(local / (3 * battement)), u = (local % (3 * battement)) / (2 * battement);
      const depart = (i + cycle) % 2 === 0 ? mains.g : mains.d, arrivee = depart === mains.g ? mains.d : mains.g;
      if (u < 1) {
        const x = lerp(depart.x, arrivee.x, u), y = lerp(depart.y, arrivee.y, u) - 4 * HAUTEUR_DU_LANCER * u * (1 - u);
        deplacer(noisette, `translate(${r1(x)} ${r1(y - 6)}) rotate(${r1(u * 360)})`);
      } else deplacer(noisette, `translate(${r1(arrivee.x)} ${r1(arrivee.y - 6)})`);
    });
  }

  /** La noisette croquée : à chaque bouchée, un petit éclat lumineux et quelques miettes dorées qui retombent aussitôt. */
  function dessinerLaCroquee(scenario: ScenarioDesAnimaux, t: number, { mains, bouche }: Dessin) {
    const d = scenario.tCroque;
    const miettes = [...n("miettes").children];
    if (d === null || t < d || t > d + DUREE_DE_LA_CROQUEE) {
      poser(n("crunch"), "opacity", 0);
      miettes.forEach((m) => poser(m, "opacity", 0));
      return;
    }
    const s = (t - d) % TEMPS_D_UNE_BOUCHEE, bouchee = Math.floor((t - d) / TEMPS_D_UNE_BOUCHEE), noisette = milieuDe(mains.g, mains.d);
    poser(n("crunch"), "opacity", r3(Math.max(0, 1 - s / .14)));
    deplacer(n("crunch"), `translate(${r1(bouche.x + 24)} ${r1(bouche.y)}) rotate(70) scale(${r3(.6 + s * 3)})`);
    miettes.forEach((m, i) => {
      const u = clamp01((s + (i % 2) * .1) / .3), angle = -2.6 + i * .5 + bouchee * .3, vx = Math.cos(angle) * 50, vy = Math.sin(angle) * 40 - 30;
      poser(m, "opacity", u >= 1 ? 0 : 1);
      deplacer(m, `translate(${r1(noisette.x + vx * u)} ${r1(noisette.y + vy * u + 120 * u * u)})`);
    });
  }

  function dessinerLeCri(scenario: ScenarioDesAnimaux, t: number) {
    const u = fenetre(t, scenario.tCri, .5, E.rebond), r = fenetre(t, scenario.tCri, .55);
    poser(n("cri"), "opacity", r3(fenetre(t, scenario.tCri, .12)));
    deplacer(n("cri"), `rotate(${r1(lerp(-8, 0, u))}) scale(${r3(.2 + .8 * u)})`);
    poser(n("rayons"), "opacity", r3((1 - fenetre(t, scenario.tCri + .25, .35, E.entree)) * fenetre(t, scenario.tCri, .08)));
    deplacer(n("rayons"), `scale(${r3(.6 + r * .9)}) rotate(${r1(r * 25)})`);
  }

  function dessinerLaJoie(scenario: ScenarioDesAnimaux, t: number, { pose: p }: Dessin) {
    const d = scenario.tJoie;
    if (t < d || t > d + 1) {
      poser(n("etoiles"), "opacity", 0);
      return;
    }
    poser(n("etoiles"), "opacity", 1);
    const cx = p.x, cy = p.y - 160 * ECHELLE_DE_BASE;
    [...n("etoiles").children].forEach((e, i) => {
      const u = fenetre(t, d + i * .1, .7), k = Math.sin(Math.min(1, u) * Math.PI), a = -2.4 + i * 1.1;
      deplacer(e, `translate(${r1(cx + Math.cos(a) * (56 + u * 26))} ${r1(cy + Math.sin(a) * (30 + u * 16))}) rotate(${r1(u * 120)}) scale(${r3(k * 1.4)})`);
    });
  }

  function dessiner(scenario: ScenarioDesAnimaux, t: number, dessin: Dessin) {
    dessinerLaNoisetteDoree(scenario, t, dessin);
    dessinerLeJonglage(scenario, t, dessin);
    dessinerLaCroquee(scenario, t, dessin);
    dessinerLeCri(scenario, t);
    dessinerLaJoie(scenario, t, dessin);
  }

  return { dessiner };
}
