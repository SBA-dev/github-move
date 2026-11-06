import { E, fenetre, lerp, r1, r3 } from "../commun/courbes.ts";
import { deplacer, elementsDe, poser } from "../commun/dom.ts";
import { au } from "../commun/tableaux.ts";
import { CASQUETTE, loupeAuSol } from "./dessin-de-max.ts";
import { BUISSON_DESSINE, COULEURS_DES_VOITURES, dessinDeLaVoiture, PATTE, PISTE } from "./dessin-des-objets.ts";
import type { DessinDeMax } from "./personnage.ts";
import {
  BUISSON,
  DUREE_D_UNE_BULLE,
  DUREE_DU_PASSAGE,
  ECART_ENTRE_DEUX_TRACES,
  ECHELLE_DE_BASE as BASE,
  poseA,
  type ScenarioDeLaPolice,
  SOL,
  X_MAX,
} from "./poses.ts";

const COULEURS_DES_RAYONS = ["#3450C8", "#FFC93C", "#FFFFFF", "#86A5F2"];
/** Une étincelle à quatre branches : jamais une étoile à cinq branches. */
const ETINCELLE_DE_LA_TETE = `<path d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z"/>`;
const ETINCELLE_DES_GANTS = `<path d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8 Z"/>`;

/**
 * Les traces, le buisson qui bouge, la loupe posée au sol, les petites voitures, la casquette lancée, les bulles écrites « tuut ! » et « dring ! »,
 * les étincelles, le cri de victoire et ses rayons (ils s'ouvrent une seule fois, puis s'effacent : ils ne tournent pas en boucle).
 * Aucune lumière ne clignote, aucun son n'est joué.
 */
export function creerLesEffets(racine: SVGSVGElement, scenario: ScenarioDeLaPolice) {
  const n = elementsDe(racine, "police");
  n("etincelles-de-la-tete").innerHTML = [0, 1, 2].map(() => ETINCELLE_DE_LA_TETE).join("");
  n("etincelles-des-gants").innerHTML = [0, 1, 2, 3].map(() => ETINCELLE_DES_GANTS).join("");
  n("rayons").innerHTML = Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-40" x2="0" y2="-64" transform="rotate(${i * 30})" stroke="${COULEURS_DES_RAYONS[i % 4]}" stroke-width="5" stroke-linecap="round"/>`).join("");
  n("buisson").innerHTML = BUISSON_DESSINE;
  n("traces").innerHTML = PISTE.map(([x, y], i) => `<g transform="translate(${x} ${y}) rotate(${i % 2 ? 14 : -14})" fill="#8E9BBE" opacity="0">${PATTE}</g>`).join("");
  n("loupe-sol").innerHTML = loupeAuSol();
  n("casquette-vol").innerHTML = `<g transform="scale(${r3(BASE * .7)})">${CASQUETTE}</g>`;
  n("voitures").innerHTML = scenario.voitures.map((_, i) => `<g>${dessinDeLaVoiture(...au(COULEURS_DES_VOITURES, i % COULEURS_DES_VOITURES.length))}</g>`).join("");
  const roues = [...n("voitures").children].map((voiture) =>
    [...voiture.querySelectorAll(".roue")].map((roue) => ({ roue, base: /translate\([^)]+\)/.exec(roue.getAttribute("transform") ?? "")?.[0] ?? "" }))
  );
  const texteDeLaBulle = n("bulle").querySelector("text");

  function dessinerLesTraces(t: number) {
    [...n("traces").children].forEach((g, i) => poser(g, "opacity", r3(fenetre(t, scenario.tTraces + i * ECART_ENTRE_DEUX_TRACES, .25) * .9)));
  }

  function dessinerLeBuisson(t: number) {
    const s = t - scenario.tBuisson, secoue = s > 0 && s < .5;
    const angle = secoue ? Math.sin(s * 40) * Math.exp(-4 * s) * 7 : 0, k = secoue ? 1 + Math.abs(Math.sin(s * 40)) * .06 : 1;
    deplacer(n("buisson"), `translate(${BUISSON.x} ${BUISSON.y}) rotate(${r1(angle)}) scale(${r3(2 - k)} ${r3(k)})`);
  }

  function dessinerLaLoupeAuSol(max: DessinDeMax) {
    const posee = max.pose.loupeSol > .5;
    poser(n("loupe-sol"), "opacity", posee ? 1 : 0);
    if (posee) deplacer(n("loupe-sol"), `translate(${r1(X_MAX + 46)} ${SOL - 4}) scale(${r3(BASE * .7)})`);
  }

  /** Une voiture par coup de sifflet, à vitesse douce, toutes pareilles : elles ne se suivent pas de près. */
  function dessinerLesVoitures(t: number) {
    [...n("voitures").children].forEach((g, i) => {
      const u = (t - (scenario.voitures[i] ?? 0)) / DUREE_DU_PASSAGE;
      if (u < 0 || u > 1) {
        poser(g, "opacity", 0);
        return;
      }
      poser(g, "opacity", 1);
      const x = lerp(-70, 430, E.douce(u)), depart = u < .12 ? 1 + Math.sin(u / .12 * Math.PI) * .08 : 1;
      deplacer(g, `translate(${r1(x)} 432) scale(${r3(depart)} ${r3(2 - depart)})`);
      roues[i]?.forEach(({ roue, base }) => deplacer(roue, `${base} rotate(${r1(x * 6)})`));
    });
  }

  /** La casquette lancée retombe sur la tête de Max, sans heurter personne. */
  function dessinerLaCasquetteLancee(t: number, max: DessinDeMax) {
    const { tLance, tRattrape } = scenario;
    if (tLance === null || tRattrape === null || t < tLance || t >= tRattrape) {
      poser(n("casquette-vol"), "opacity", 0);
      return;
    }
    const u = (t - tLance) / (tRattrape - tLance), tete = (q: { x: number; y: number; s: number; sy: number }) => ({ x: q.x, y: q.y - 74 * BASE * q.s * q.sy });
    const a = tete(poseA(scenario.poses, tLance)), b = tete(max.pose);
    poser(n("casquette-vol"), "opacity", 1);
    deplacer(n("casquette-vol"), `translate(${r1(lerp(a.x, b.x, u))} ${r1(lerp(a.y, b.y, u) - 120 * 4 * u * (1 - u))}) rotate(${r1(u * 360)})`);
  }

  /** Les bulles écrites : « tuut ! » et « dring ! ». Elles font partie du dessin caché aux lecteurs d'écran. */
  function dessinerLaBulle(t: number, max: DessinDeMax) {
    const bulle = scenario.bulles.find((b) => t >= b.t && t < b.t + DUREE_D_UNE_BULLE);
    if (!bulle || !texteDeLaBulle) {
      poser(n("bulle"), "opacity", 0);
      return;
    }
    const u = fenetre(t, bulle.t, .15, E.rebond), fondu = 1 - fenetre(t, bulle.t + DUREE_D_UNE_BULLE - .15, .15, E.entree);
    if (texteDeLaBulle.textContent !== bulle.texte) texteDeLaBulle.textContent = bulle.texte;
    poser(n("bulle"), "opacity", r3(fondu));
    deplacer(n("bulle"), `translate(${r1(max.pose.x + bulle.dx)} ${r1(max.pose.y + bulle.dy - 6 * u)}) scale(${r3(u)})`);
  }

  function dessinerLeCri(t: number) {
    const u = fenetre(t, scenario.tCri, .5, E.rebond), r = fenetre(t, scenario.tCri, .55);
    poser(n("cri"), "opacity", r3(fenetre(t, scenario.tCri, .12)));
    deplacer(n("cri"), `rotate(${r1(lerp(-8, 0, u))}) scale(${r3(.2 + .8 * u)})`);
    poser(n("rayons"), "opacity", r3((1 - fenetre(t, scenario.tCri + .25, .35, E.entree)) * fenetre(t, scenario.tCri, .08)));
    deplacer(n("rayons"), `scale(${r3(.6 + r * .9)}) rotate(${r1(r * 25)})`);
  }

  function dessinerLesEtincellesDeLaTete(t: number, max: DessinDeMax) {
    const d = scenario.tJoie;
    if (t < d || t > d + 1) {
      poser(n("etincelles-de-la-tete"), "opacity", 0);
      return;
    }
    poser(n("etincelles-de-la-tete"), "opacity", 1);
    const cx = max.pose.x, cy = max.pose.y - 100 * BASE;
    [...n("etincelles-de-la-tete").children].forEach((e, i) => {
      const u = fenetre(t, d + i * .1, .7), k = Math.sin(Math.min(1, u) * Math.PI), a = -2.4 + i * 1.1;
      deplacer(e, `translate(${r1(cx + Math.cos(a) * (44 + u * 22))} ${r1(cy + Math.sin(a) * (28 + u * 14))}) rotate(${r1(u * 120)}) scale(${r3(k * 1.4)})`);
    });
  }

  function dessinerLesEtincellesDesGants(t: number, max: DessinDeMax) {
    const d = scenario.tGants;
    if (d === null || t < d || t > d + 1) {
      poser(n("etincelles-des-gants"), "opacity", 0);
      return;
    }
    poser(n("etincelles-des-gants"), "opacity", 1);
    const base = { x: max.pose.x, y: max.pose.y - 26 * BASE };
    [...n("etincelles-des-gants").children].forEach((e, i) => {
      const u = fenetre(t, d + i * .08, .6), a = -1.2 + i * 1.3, k = Math.sin(Math.min(1, u) * Math.PI);
      deplacer(e, `translate(${r1(base.x + Math.cos(a) * (12 + u * 20))} ${r1(base.y + Math.sin(a) * (12 + u * 16) - u * 6)}) rotate(${r1(u * 90)}) scale(${r3(k * 2.6)})`);
    });
  }

  function dessiner(t: number, max: DessinDeMax) {
    dessinerLesTraces(t);
    dessinerLeBuisson(t);
    dessinerLaLoupeAuSol(max);
    dessinerLesVoitures(t);
    dessinerLaCasquetteLancee(t, max);
    dessinerLaBulle(t, max);
    dessinerLeCri(t);
    dessinerLesEtincellesDeLaTete(t, max);
    dessinerLesEtincellesDesGants(t, max);
  }

  return { dessiner };
}
