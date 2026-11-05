import { DEG, lerp, r1 } from "../commun/courbes.ts";
import { poser, trouver } from "../commun/dom.ts";
import type { Point } from "../commun/membres.ts";
import { au } from "../commun/tableaux.ts";
import type { Pose } from "./poses.ts";

const LONGUEURS = [26, 26, 24, 22, 20];
const LARGEURS = [15, 23, 28, 27, 21, 10];
/** De combien chaque segment se courbe par rapport au précédent : la queue s'enroule vers le haut. */
const COURBURES = [0, 22, 28, 32, 28];
const NOMBRE_DE_SEGMENTS = LONGUEURS.length;
const ATTACHE: Point = { x: -4, y: -32 };
const PROLONGEMENT_DE_LA_POINTE = 14;
const FESTONS_PAR_SEGMENT = 3;

type Segment = { angle: number; vitesse: number };

/** Une courbe lisse qui passe entre les points : chaque point est un point de contrôle, la courbe va aux milieux. Elle démarre par `M` (nouveau tracé) ou par `L` (suite d'un tracé). */
function courbe(P: readonly Point[], depart: "M" | "L" = "M"): string {
  const premier = au(P, 0);
  let d = `${depart}${r1(premier.x)} ${r1(premier.y)}`;
  for (let i = 1; i < P.length - 1; i++) {
    const a = au(P, i), b = au(P, i + 1);
    d += ` Q${r1(a.x)} ${r1(a.y)} ${r1((a.x + b.x) / 2)} ${r1((a.y + b.y) / 2)}`;
  }
  const fin = au(P, P.length - 1);
  return `${d} L${r1(fin.x)} ${r1(fin.y)}`;
}

/** Le bord de la queue, découpé en petits festons qui donnent l'aspect du poil. */
function festons(P: readonly Point[], normales: readonly Point[], signe: 1 | -1): string {
  let d = "";
  for (let i = 0; i < P.length - 1; i++) {
    const a = au(P, i), b = au(P, i + 1), na = au(normales, i), nb = au(normales, i + 1);
    const nx = (na.x + nb.x) / 2 * signe, ny = (na.y + nb.y) / 2 * signe;
    for (let k = 0; k < FESTONS_PAR_SEGMENT; k++) {
      const p0 = { x: lerp(a.x, b.x, k / FESTONS_PAR_SEGMENT), y: lerp(a.y, b.y, k / FESTONS_PAR_SEGMENT) };
      const p1 = { x: lerp(a.x, b.x, (k + 1) / FESTONS_PAR_SEGMENT), y: lerp(a.y, b.y, (k + 1) / FESTONS_PAR_SEGMENT) };
      d += ` Q${r1((p0.x + p1.x) / 2 + nx * 7)} ${r1((p0.y + p1.y) / 2 + ny * 7)} ${r1(p1.x)} ${r1(p1.y)}`;
    }
  }
  return d;
}

/**
 * La queue en panache de Noisette : une chaîne de 5 segments à ressorts. Chaque segment suit le précédent avec du retard,
 * elle se balance avec les sauts et les déplacements. L'état des ressorts vit dans cette fermeture.
 */
export function creerLaQueue(racine: SVGSVGElement) {
  const segments: Segment[] = Array.from({ length: NOMBRE_DE_SEGMENTS }, () => ({ angle: 0, vitesse: 0 }));
  const groupe = trouver(racine, "#animaux-queue");
  const piece = (classe: string) => trouver(groupe, `.${classe}`);
  const forme = piece("queue"), ventre = piece("queue-ventre"), ombre = piece("queue-ombre"), lumiere = piece("queue-lumiere"), meches = piece("queue-meches");
  let tPrecedent: number | null = null;

  /** vx et vy : vitesse du corps. */
  function dessiner(p: Pose, t: number, vx: number, vy: number) {
    let dt = tPrecedent === null ? 0 : t - tPrecedent;
    const chauffe = dt < 0 || dt > .25 || tPrecedent === null;
    if (chauffe) {
      dt = 0;
      for (const s of segments) {
        s.angle = 0;
        s.vitesse = 0;
      }
    }
    tPrecedent = t;
    const base = -148 + p.vue * 10 + Math.max(-18, Math.min(18, vx * .14)) + Math.max(-10, Math.min(10, vy * .05)) - p.rot * .5;
    const pas = chauffe ? 160 : 4, h = chauffe ? 1 / 60 : dt / 4;
    for (const [i, s] of segments.entries()) {
      const cible = (i === 0 ? base : au(segments, i - 1).angle) + au(COURBURES, i);
      const raideur = 260 - i * 24, amortissement = 16 - i * 1.2;
      for (let k = 0; k < pas; k++) {
        s.vitesse += ((cible - s.angle) * raideur - s.vitesse * amortissement) * h;
        s.angle += s.vitesse * h;
      }
    }
    // articulations, puis bords gauche et droit
    const J: Point[] = [ATTACHE];
    for (const [i, s] of segments.entries()) {
      const q = au(J, i), a = s.angle * DEG;
      J.push({ x: q.x + Math.sin(a) * au(LONGUEURS, i), y: q.y + Math.cos(a) * au(LONGUEURS, i) });
    }
    const G: Point[] = [], D: Point[] = [], normales: Point[] = [];
    for (let i = 0; i <= NOMBRE_DE_SEGMENTS; i++) {
      const a = au(J, Math.max(0, i - 1)), b = au(J, Math.min(NOMBRE_DE_SEGMENTS, i + 1)), tx = b.x - a.x, ty = b.y - a.y;
      const tl = Math.hypot(tx, ty) || 1, nx = -ty / tl, ny = tx / tl, largeur = au(LARGEURS, i), centre = au(J, i);
      normales.push({ x: nx, y: ny });
      G.push({ x: centre.x + nx * largeur, y: centre.y + ny * largeur });
      D.push({ x: centre.x - nx * largeur, y: centre.y - ny * largeur });
    }
    const dernier = NOMBRE_DE_SEGMENTS, bout = au(J, dernier), avantBout = au(J, dernier - 1), longueur = au(LONGUEURS, dernier - 1);
    const ux = (bout.x - avantBout.x) / longueur, uy = (bout.y - avantBout.y) / longueur;
    const pointe = { x: bout.x + ux * PROLONGEMENT_DE_LA_POINTE, y: bout.y + uy * PROLONGEMENT_DE_LA_POINTE };
    const G5 = au(G, dernier), D5 = au(D, dernier);
    const dessin = `M${r1(au(G, 0).x)} ${r1(au(G, 0).y)}` + festons(G, normales, 1)
      + ` Q${r1(G5.x + ux * 10)} ${r1(G5.y + uy * 10)} ${r1(pointe.x)} ${r1(pointe.y)} Q${r1(D5.x + ux * 10)} ${r1(D5.y + uy * 10)} ${r1(D5.x)} ${r1(D5.y)}`
      + festons(D.slice().reverse(), normales.slice().reverse(), -1) + " Z";
    // le ventre de la queue (plus clair), l'ombre, la lumière et les mèches : des points entre le bord gauche et le bord droit
    const bande = (k: number) => J.map((_, i) => ({ x: lerp(au(G, i).x, au(D, i).x, k), y: lerp(au(G, i).y, au(D, i).y, k) }));
    const dedans = bande(.6), dehors = bande(.92), retour = dehors.slice(1, 6).reverse();
    const premierDuRetour = au(retour, 0);
    const dessinDuVentre = courbe(dedans.slice(1, 6)) + ` L${r1(premierDuRetour.x)} ${r1(premierDuRetour.y)}`
      + courbe(retour, "L") + " Z";
    poser(forme, "d", dessin);
    poser(ventre, "d", dessinDuVentre);
    poser(ombre, "d", courbe(bande(.18).slice(1, 6)));
    poser(lumiere, "d", courbe(bande(.4).slice(0, 4)));
    poser(meches, "d", `${courbe(bande(.3).slice(2, 6))} ${courbe(bande(.5).slice(1, 5))}`);
  }

  return { dessiner };
}
