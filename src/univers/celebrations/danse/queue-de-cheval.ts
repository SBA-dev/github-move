import { clamp01, DEG, lerp, r1, r3 } from "../commun/courbes.ts";
import { deplacer, poser, trouver } from "../commun/dom.ts";
import { courbe, type Point } from "../commun/membres.ts";
import { au } from "../commun/tableaux.ts";
import type { Pose } from "./poses.ts";

const LONGUEURS = [18, 17, 16, 15, 14];
const LARGEURS = [8, 13, 12, 10, 6.5, 2.6];
const NOMBRE_DE_SEGMENTS = LONGUEURS.length;

type Segment = { angle: number; vitesse: number };

const lisse = (x: number, a: number, b: number) => {
  const u = clamp01((x - a) / (b - a));
  return u * u * (3 - 2 * u);
};

/**
 * La queue de cheval haute de Lili : une chaîne de 5 segments à ressorts. Chaque segment suit le précédent avec du retard,
 * la gravité, la portance et l'écart en rotation la font voler pendant les pirouettes. L'état des ressorts vit dans cette fermeture.
 */
export function creerLaQueueDeCheval(racine: SVGSVGElement, ids: { readonly avant: string; readonly arriere: string }) {
  const segments: Segment[] = Array.from({ length: NOMBRE_DE_SEGMENTS }, () => ({ angle: 0, vitesse: 0 }));
  let portance = 0, ecart = 0, tPrecedent: number | null = null;
  const piece = (id: string) => {
    const g = trouver(racine, `#${id}`);
    return { g, queue: trouver(g, ".queue"), ombre: trouver(g, ".queue-ombre"), lumiere: trouver(g, ".queue-lumiere"), meches: trouver(g, ".queue-meches"), chouchou: trouver(g, ".chouchou") };
  };
  const avant = piece(ids.avant), arriere = piece(ids.arriere);

  /** vx et vy : vitesse du corps ; dvue : vitesse de rotation. */
  function dessiner(p: Pose, t: number, vx: number, vy: number, dvue: number) {
    let dt = tPrecedent === null ? 0 : t - tPrecedent;
    const chauffe = dt < 0 || dt > .25 || tPrecedent === null;
    if (chauffe) {
      dt = 0;
      for (const s of segments) {
        s.angle = 0;
        s.vitesse = 0;
      }
      portance = 0;
      ecart = 0;
    }
    tPrecedent = t;
    const w = p.vue, cw = Math.cos(w * DEG), sw = Math.sin(w * DEG), dos = cw < -.15;
    // de face la queue tombe sur l'épaule, de trois-quarts du côté proche de la caméra
    const face = lisse(cw, .2, .75), cote = sw > 0 ? 1 : -1, drape = sw > .08 ? -1 : 1;
    const portanceCible = Math.max(-10, Math.min(40, vy * .16)), ecartCible = Math.min(1, Math.abs(dvue) / 520);
    portance += (portanceCible - portance) * Math.min(1, dt * 9);
    ecart += (ecartCible - ecart) * Math.min(1, dt * 12);
    // angle visé du premier segment : balancement selon la vitesse, inclinaison du corps, drapé sur l'épaule de face, écart derrière en rotation
    let suivi = Math.max(-55, Math.min(55, -vx * .32)) - p.rot * .6 + 26 * face * drape - cote * ecart * 60 - sw * 10 - (dos ? 9 : 0);
    // chaque segment suit le précédent (retard et ondulation), avec un repos qui courbe doucement
    const pas = chauffe ? 160 : 4, h = chauffe ? 1 / 60 : dt / 4;
    for (const [i, s] of segments.entries()) {
      const repos = (1 - face) * (-4 - 3 * i) * (dos ? 1 : .4) + face * drape * (12 - 4 * i) + cote * ecart * (14 - 9 * i) - portance * (.4 + .25 * i) * (i ? cote : 0);
      const cible = suivi + repos;
      const raideur = 170 - i * 22, amortissement = 10 - i * .8;
      for (let k = 0; k < pas; k++) {
        s.vitesse += ((cible - s.angle) * raideur - s.vitesse * amortissement) * h;
        s.angle += s.vitesse * h;
      }
      suivi = s.angle * .78;
    }
    // articulations, puis bords gauche et droit de la mèche
    const attache = { x: -13 * sw, y: -27 };
    const J: Point[] = [attache];
    for (const [i, s] of segments.entries()) {
      const q = au(J, i);
      J.push({ x: q.x + Math.sin(s.angle * DEG) * au(LONGUEURS, i), y: q.y + Math.cos(s.angle * DEG) * au(LONGUEURS, i) * (1 - portance / 90) });
    }
    const G: Point[] = [], D: Point[] = [];
    for (let i = 0; i <= NOMBRE_DE_SEGMENTS; i++) {
      const a = au(J, Math.max(0, i - 1)), b = au(J, Math.min(NOMBRE_DE_SEGMENTS, i + 1)), tx = b.x - a.x, ty = b.y - a.y;
      const tl = Math.hypot(tx, ty) || 1, nx = -ty / tl, ny = tx / tl, largeur = au(LARGEURS, i), centre = au(J, i);
      G.push({ x: centre.x + nx * largeur, y: centre.y + ny * largeur });
      D.push({ x: centre.x - nx * largeur, y: centre.y - ny * largeur });
    }
    // pointe : deux mèches qui se détachent
    const bout = au(J, NOMBRE_DE_SEGMENTS), avantBout = au(J, NOMBRE_DE_SEGMENTS - 1);
    const dirX = bout.x - avantBout.x, dirY = bout.y - avantBout.y, tl = Math.hypot(dirX, dirY) || 1, ux = dirX / tl, uy = dirY / tl, px = -uy, py = ux;
    const P1 = { x: bout.x + ux * 9 + px * 5, y: bout.y + uy * 9 + py * 5 }, Pm = { x: bout.x - ux * 3, y: bout.y - uy * 3 }, P2 = { x: bout.x + ux * 6 - px * 6, y: bout.y + uy * 6 - py * 6 };
    const G5 = au(G, NOMBRE_DE_SEGMENTS), D5 = au(D, NOMBRE_DE_SEGMENTS), D4 = au(D, NOMBRE_DE_SEGMENTS - 1);
    const dessin = courbe(G.slice(0, 5))
      + ` Q${r1(G5.x)} ${r1(G5.y)} ${r1(P1.x)} ${r1(P1.y)} L${r1(Pm.x)} ${r1(Pm.y)} L${r1(P2.x)} ${r1(P2.y)} Q${r1(D5.x)} ${r1(D5.y)} ${r1(D4.x)} ${r1(D4.y)}`
      + courbe(D.slice(0, 5).reverse(), "L") + " Z";
    // volume en haut (ombre sous le chouchou, lumière) et mèches intérieures (3 traits fins) : des points entre le bord gauche et le bord droit
    const entre = (debut: number, fin: number, k: number) => G.slice(debut, fin).map((g, i) => {
      const d = au(D, debut + i);
      return { x: lerp(g.x, d.x, k), y: lerp(g.y, d.y, k) };
    });
    const ombre = courbe(entre(1, 6, .22));
    const lumiere = courbe(entre(0, 4, .72));
    const meches = `${courbe(entre(1, 5, .42))} ${courbe(entre(1, 5, .6))} ${courbe(entre(2, 6, .82))}`;
    for (const { queue, ombre: ombreDeLaQueue, lumiere: lumiereDeLaQueue, meches: mechesDeLaQueue, chouchou } of [avant, arriere]) {
      poser(queue, "d", dessin);
      poser(ombreDeLaQueue, "d", ombre);
      poser(lumiereDeLaQueue, "d", lumiere);
      poser(mechesDeLaQueue, "d", meches);
      deplacer(chouchou, `translate(${r1(attache.x)} ${r1(attache.y)}) rotate(${r1(au(segments, 0).angle * .3)}) scale(${r3(Math.max(.35, Math.abs(cw) * .4 + .6))} 1)`);
    }
    poser(avant.g, "opacity", dos ? 1 : 0);
    poser(arriere.g, "opacity", dos ? 0 : 1);
    deplacer(arriere.g, `translate(0 -48) rotate(${r1(p.tete)}) translate(0 -26)`);
  }

  return { dessiner };
}
