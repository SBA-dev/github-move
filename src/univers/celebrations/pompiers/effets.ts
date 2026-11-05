import { clamp01, DEG, E, fenetre, lerp, r1, r3 } from "../commun/courbes.ts";
import { deplacer, elementsDe, poser, trouver } from "../commun/dom.ts";
import { au } from "../commun/tableaux.ts";
import {
  ARC_EN_CIEL_DESSINE,
  CLOCHE,
  CLOCHE_DESSINEE,
  COULEURS_DES_NOTES,
  COULEURS_DES_RAYONS,
  CORDE_AU_REPOS,
  dessinDeLaFleur,
  EAU,
  EAU_CONTOUR,
  ETINCELLE_DE_LA_PLUIE,
  ETINCELLE_DE_LA_TETE,
  ETINCELLE_DU_POUCE,
  FIL_DE_LA_CLOCHE,
  FLEURS,
  GOUTTE,
  NOTE,
} from "./dessin-du-jardin.ts";
import { OR } from "./dessin-de-sam.ts";
import type { CapitaineSam } from "./personnage.ts";
import { ECHELLE_DE_BASE as BASE, type Pose, type ScenarioDesPompiers } from "./poses.ts";
import type { Repere } from "./repere.ts";

const NOMBRE_DE_GOUTTES_DE_PLUIE = 34;
const NOMBRE_DE_GOUTTES_DE_L_EBROUEMENT = 10;
const DUREE_D_UNE_BULLE = .6;
/** Le cri se range un peu plus haut, là où le titre arrivait dans la maquette : il ne dépasse jamais de la scène. */
const DEBUT_DU_REPLI = .2;
/** Les étincelles de la joie, une fois que la dernière fleur s'est ouverte. */
const APRES_LA_DERNIERE_FLEUR = .12;

/** Un nombre entre 0 et 1 toujours le même pour un rang donné : la pluie est identique à chaque image. */
const alea = (i: number) => {
  const s = Math.sin(i * 12.9898 + 4.1) * 43758.5453;
  return s - Math.floor(s);
};

/**
 * Les fleurs qui s'ouvrent, la cloche de la caserne et sa corde, les notes, l'arc-en-ciel, la pluie joyeuse, l'ébrouement, les bulles écrites « ding ! » et « dong ! »,
 * les étincelles, le cri de victoire et ses rayons (ils s'ouvrent une seule fois, puis s'effacent : ils ne tournent pas, ne clignotent pas).
 * Ni flamme, ni fumée, ni lumière qui clignote, et aucun son n'est joué.
 */
export function creerLesEffets(racine: SVGSVGElement, monde: Repere, sam: CapitaineSam, scenario: ScenarioDesPompiers, instantsDesFleurs: readonly number[]) {
  const n = elementsDe(racine, "pompier");
  const q1 = (g: ParentNode, classe: string) => trouver(g, `.${classe}`);
  const tJoie = Math.max(...instantsDesFleurs) + APRES_LA_DERNIERE_FLEUR;
  n("fleurs").innerHTML = FLEURS.map(dessinDeLaFleur).join("");
  n("cloche").innerHTML = CLOCHE_DESSINEE;
  n("fil-derriere").innerHTML = `<g id="pompier-fil">${FIL_DE_LA_CLOCHE}</g>`;
  n("arc-en-ciel").innerHTML = ARC_EN_CIEL_DESSINE;
  n("notes").innerHTML = COULEURS_DES_NOTES.map((c) => `<g opacity="0">${NOTE(c)}</g>`).join("");
  n("pluie").innerHTML = Array.from({ length: NOMBRE_DE_GOUTTES_DE_PLUIE }, (_, i) =>
    i % 5 === 2
      ? `<g class="scintille">${ETINCELLE_DE_LA_PLUIE(i % 2 ? "#FFFFFF" : OR)}</g>`
      : `<g fill="${EAU}" stroke="${EAU_CONTOUR}" stroke-width="1.3">${GOUTTE}</g>`).join("");
  n("ebroue").innerHTML = Array.from({ length: NOMBRE_DE_GOUTTES_DE_L_EBROUEMENT }, () => `<g>${GOUTTE}</g>`).join("");
  n("etincelles-de-la-tete").innerHTML = [0, 1, 2].map(() => ETINCELLE_DE_LA_TETE).join("");
  n("etincelles-du-pouce").innerHTML = [0, 1, 2, 3].map(() => ETINCELLE_DU_POUCE).join("");
  n("rayons").innerHTML = Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-40" x2="0" y2="-64" transform="rotate(${i * 30})" stroke="${au(COULEURS_DES_RAYONS, i % 4)}" stroke-width="5" stroke-linecap="round"/>`).join("");

  function dessinerLesFleurs(t: number) {
    [...n("fleurs").children].forEach((g, i) => {
      const d = au(instantsDesFleurs, i), u = fenetre(t, d, .42, E.rebond), b = fenetre(t, d, .18), s = t - d, oscille = s > 0 && s < .6 ? Math.sin(s * 18) * Math.exp(-5 * s) * 10 : 0;
      deplacer(q1(g, "tete-fleur"), `translate(0 -23) rotate(${r1(oscille)})`);
      poser(q1(g, "bouton"), "opacity", r3(1 - b));
      deplacer(q1(g, "corolle"), `scale(${r3(Math.max(.001, u))}) rotate(${r1(lerp(-40, 0, clamp01(u)))})`);
    });
  }

  /** La cloche se balance quand Sam tire la corde, puis s'arrête en douceur. */
  function angleDeLaCloche(t: number): number {
    const d = scenario.tTire;
    if (d === null || t < d) return 0;
    const s = t - d;
    return 30 * Math.sin(s / .8 * Math.PI * 2) * Math.exp(-s * 1.1);
  }

  /** Le bas de la corde : dans la main de Sam quand il la tient, sinon il pend et rebondit un peu quand il la lâche. */
  function boutDeLaCorde(t: number, p: Pose, a: number) {
    if (p.corde > .5) return monde(sam.mainDroite, 0, -4);
    const s = scenario.tLache === null || t < scenario.tLache ? 9 : t - scenario.tLache, ressort = 26 * Math.exp(-5 * s) * Math.cos(s * 13);
    return { x: CLOCHE.x - Math.sin(a * DEG) * 8, y: CORDE_AU_REPOS + ressort };
  }

  function dessinerLaCloche(t: number, p: Pose) {
    const a = angleDeLaCloche(t);
    deplacer(n("cloche"), `translate(${CLOCHE.x} ${CLOCHE.y}) rotate(${r1(a)})`);
    deplacer(q1(n("cloche"), "battant"), `rotate(${r1(-a * .5)} 0 4)`);
    const haut = { x: CLOCHE.x - Math.sin(a * DEG) * 31, y: CLOCHE.y + Math.cos(a * DEG) * 31 }, bout = boutDeLaCorde(t, p, a);
    const d = `M${r1(haut.x)} ${r1(haut.y)} Q${r1((haut.x + bout.x) / 2 + 3)} ${r1((haut.y + bout.y) / 2)} ${r1(bout.x)} ${r1(bout.y)}`;
    poser(n("corde"), "d", d);
    poser(n("corde-in"), "d", d);
    deplacer(n("pompon"), `translate(${r1(bout.x)} ${r1(bout.y + 3)})`);
    // le pompon passe devant Sam quand il tient la corde
    const emplacement = p.corde > .5 ? n("fil-devant") : n("fil-derriere");
    if (n("fil").parentNode !== emplacement) emplacement.append(n("fil"));
  }

  /** Des petites notes de musique dessinées s'envolent de la cloche, de part et d'autre. */
  function dessinerLesNotes(t: number) {
    [...n("notes").children].forEach((g, i) => {
      const s = scenario.tTire === null ? -1 : (t - scenario.tTire - .1 - i * .22) / 1.1;
      if (s < 0 || s > 1) {
        poser(g, "opacity", 0);
        return;
      }
      const sens = i % 2 ? 1 : -1;
      poser(g, "opacity", r3(Math.min(1, Math.sin(s * Math.PI) * 1.6)));
      deplacer(g, `translate(${r1(CLOCHE.x + sens * (20 + s * 34) + Math.sin(s * 7) * 5)} ${r1(CLOCHE.y + 14 - s * 52)}) rotate(${r1(sens * 12 + Math.sin(s * 6) * 10)}) scale(${r3(.9 + s * .3)})`);
    });
  }

  function dessinerLArcEnCiel(p: Pose) {
    poser(n("arc-en-ciel"), "opacity", p.arc > .001 ? .9 : 0);
    [...n("arc-en-ciel").children].forEach((b, i) => poser(b, "stroke-dashoffset", r3(1 - clamp01(p.arc * 1.08 - i * .016))));
  }

  /** Une petite pluie joyeuse : quelques gouttes douces et des étincelles, qui retombent sur le jardin et sur Sam, sans l'inquiéter. */
  function dessinerLaPluie(t: number, p: Pose) {
    const d = scenario.tPluie;
    if (d === null || t < d) {
      poser(n("pluie"), "opacity", 0);
      return;
    }
    poser(n("pluie"), "opacity", 1);
    const casqueY = p.y - 152 * BASE * p.sy * .99;
    [...n("pluie").children].forEach((g, i) => {
      const debut = d + (i % 17) / 17 * 1.15 + alea(i) * .12, x0 = 70 + alea(i + 40) * 284, v = 360 + alea(i + 80) * 80, y0 = -10 - alea(i + 120) * 40;
      const surSam = Math.abs(x0 - p.x - 4) < 24, solY = surSam ? casqueY : 376 + alea(i + 160) * 30, duree = (solY - y0) / v, s = t - debut;
      if (s < 0 || s > duree + .22) {
        poser(g, "opacity", 0);
        return;
      }
      if (s <= duree) {
        poser(g, "opacity", 1);
        deplacer(g, `translate(${r1(x0 - s * 14)} ${r1(y0 + v * s)}) ${g.classList.contains("scintille") ? `rotate(${r1(s * 120)}) scale(.8)` : "scale(.9 1.1)"}`);
        return;
      }
      const k = (s - duree) / .22;
      poser(g, "opacity", r3(1 - k));
      deplacer(g, `translate(${r1(x0 - duree * 14)} ${r1(solY - 4 * k)}) scale(${r3(1.2 + k * .6)} ${r3(.5 - k * .3)})`);
    });
  }

  function dessinerLEbrouement(t: number, p: Pose) {
    const d = scenario.tEbroue, s = d === null ? -1 : (t - d) / .7;
    if (s < 0 || s > 1) {
      poser(n("ebroue"), "opacity", 0);
      return;
    }
    poser(n("ebroue"), "opacity", 1);
    const cx = p.x, cy = p.y - 90 * BASE;
    [...n("ebroue").children].forEach((g, i) => {
      const a = -Math.PI + (i / 9) * Math.PI + (i % 2 ? .15 : -.15), u = clamp01(s * 1.3 - (i % 3) * .1), r = 30 + u * 46;
      poser(g, "opacity", r3(Math.sin(Math.min(1, u) * Math.PI)));
      deplacer(g, `translate(${r1(cx + Math.cos(a) * r)} ${r1(cy + Math.sin(a) * r * .8 + u * u * 26)}) rotate(${r1(a / DEG + 90)}) scale(.9)`);
    });
  }

  /** Les bulles écrites : « ding ! » et « dong ! ». Elles font partie du dessin caché aux lecteurs d'écran. */
  function dessinerLesBulles(t: number) {
    [0, 1].forEach((k) => {
      const el = n(`bulle-${k}`), b = scenario.bulles[k];
      if (!b || t < b.t || t >= b.t + DUREE_D_UNE_BULLE) {
        poser(el, "opacity", 0);
        return;
      }
      const u = fenetre(t, b.t, .2, E.rebond), fondu = 1 - fenetre(t, b.t + .42, .18, E.entree), texte = trouver(el, "text");
      if (texte.textContent !== b.texte) texte.textContent = b.texte;
      poser(el, "opacity", r3(fondu));
      deplacer(el, `translate(${r1(b.x)} ${r1(b.y - 6 * u)}) scale(${r3(u)})`);
    });
  }

  function dessinerLeCri(t: number) {
    const u = fenetre(t, scenario.tCri, .5, E.rebond), repli = fenetre(t, scenario.tCri + DEBUT_DU_REPLI, .5, E.douce), r = fenetre(t, scenario.tCri, .55);
    poser(n("cri"), "opacity", r3(fenetre(t, scenario.tCri, .12)));
    deplacer(n("cri"), `translate(0 ${r1(lerp(0, -14, repli))}) rotate(${r1(lerp(-8, 0, u))}) scale(${r3((.2 + .8 * u) * lerp(1, .82, repli))})`);
    poser(n("rayons"), "opacity", r3((1 - fenetre(t, scenario.tCri + .25, .35, E.entree)) * fenetre(t, scenario.tCri, .08)));
    deplacer(n("rayons"), `scale(${r3(.6 + r * .9)})`);
  }

  function dessinerLesEtincellesDeLaTete(t: number, p: Pose) {
    if (t < tJoie || t > tJoie + 1) {
      poser(n("etincelles-de-la-tete"), "opacity", 0);
      return;
    }
    poser(n("etincelles-de-la-tete"), "opacity", 1);
    const cx = p.x, cy = p.y - 100 * BASE;
    [...n("etincelles-de-la-tete").children].forEach((e, i) => {
      const u = fenetre(t, tJoie + i * .1, .7), k = Math.sin(Math.min(1, u) * Math.PI), a = -2.4 + i * 1.1;
      deplacer(e, `translate(${r1(cx + Math.cos(a) * (44 + u * 22))} ${r1(cy + Math.sin(a) * (28 + u * 14))}) rotate(${r1(u * 120)}) scale(${r3(k * 1.4)})`);
    });
  }

  function dessinerLesEtincellesDuPouce(t: number) {
    const d = scenario.tPouce;
    if (d === null || t < d || t > d + 1) {
      poser(n("etincelles-du-pouce"), "opacity", 0);
      return;
    }
    poser(n("etincelles-du-pouce"), "opacity", 1);
    const base = monde(sam.mainDroite, 0, -12);
    [...n("etincelles-du-pouce").children].forEach((e, i) => {
      const u = fenetre(t, d + i * .08, .6), a = -2.4 + i * 1.1, k = Math.sin(Math.min(1, u) * Math.PI);
      deplacer(e, `translate(${r1(base.x + Math.cos(a) * (12 + u * 20))} ${r1(base.y + Math.sin(a) * (12 + u * 16) - u * 6)}) rotate(${r1(u * 90)}) scale(${r3(k * 2.6)})`);
    });
  }

  function dessiner(t: number, p: Pose) {
    dessinerLesFleurs(t);
    dessinerLaCloche(t, p);
    dessinerLesNotes(t);
    dessinerLArcEnCiel(p);
    dessinerLaPluie(t, p);
    dessinerLEbrouement(t, p);
    dessinerLesBulles(t);
    dessinerLeCri(t);
    dessinerLesEtincellesDeLaTete(t, p);
    dessinerLesEtincellesDuPouce(t);
  }

  return { dessiner };
}

