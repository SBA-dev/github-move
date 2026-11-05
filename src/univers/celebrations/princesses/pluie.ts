import { suiteDeNombres } from "../commun/suite-de-nombres.ts";
import { couleurDeLEtincelle, traceDeLEtincelle } from "./magie.ts";

const COULEURS_DES_PETALES = ["#FF8FB8", "#FFC9DE", "#FFFFFF", "#F3C9F2", "#FFB3D1"];
const NOMBRE_DE_PIECES = 56;
const UN_ECLAT_SUR = 3;
const LARGEUR_DE_LA_SCENE = 360;
const HAUTEUR_DE_LA_SCENE = 450;

type Piece = {
  x: number;
  y: number;
  readonly vx: number;
  vy: number;
  readonly eclat: boolean;
  readonly w: number;
  readonly h: number;
  rot: number;
  readonly vrot: number;
  phase: number;
  readonly sol: number;
  readonly petale: string;
  readonly rang: number;
  pose: boolean;
  retard: number;
};

function semer(): Piece[] {
  const suite = suiteDeNombres(106);
  return Array.from({ length: NOMBRE_DE_PIECES }, (_, i) => ({
    x: 20 + suite() * 320,
    y: -20 - suite() * 240,
    vx: (suite() - .5) * 30,
    vy: 30 + suite() * 30,
    eclat: i % UN_ECLAT_SUR === 0,
    w: 8 + suite() * 4,
    h: 4.5 + suite() * 2.5,
    rot: suite() * Math.PI,
    vrot: (suite() - .5) * 4,
    phase: suite() * 6.3,
    sol: 300 + suite() * 150,
    petale: COULEURS_DES_PETALES[i % COULEURS_DES_PETALES.length] ?? "#FFFFFF",
    rang: i,
    pose: false,
    retard: suite() * 1.2,
  }));
}

/** Les étincelles du jardin et les pétales qui tombent du ciel, puis se posent. Rien n'est tiré au hasard : la pluie est toujours la même. */
export function creerLaPluie(toile: HTMLCanvasElement) {
  const contexte = toile.getContext("2d");
  const pieces = semer();
  const eclat = new Path2D(traceDeLEtincelle(5.5));

  function avancer(dt: number) {
    for (const c of pieces) {
      if (c.pose) continue;
      if (c.retard > 0) {
        c.retard -= dt;
        continue;
      }
      c.vy = Math.min(c.eclat ? 100 : 80, c.vy + 70 * dt);
      c.phase += dt * 4;
      c.x += c.vx * dt + Math.sin(c.phase) * 30 * dt;
      c.y += c.vy * dt;
      c.rot += c.vrot * dt + Math.cos(c.phase) * .05;
      if (c.y >= c.sol) {
        c.y = c.sol;
        c.pose = true;
      }
    }
  }

  function dessiner() {
    if (!contexte) return;
    const largeur = toile.clientWidth, dpr = Math.min(2, devicePixelRatio || 1);
    if (toile.width !== Math.round(largeur * dpr)) {
      toile.width = Math.round(largeur * dpr);
      toile.height = Math.round(largeur * HAUTEUR_DE_LA_SCENE / LARGEUR_DE_LA_SCENE * dpr);
    }
    const echelle = toile.width / LARGEUR_DE_LA_SCENE;
    contexte.setTransform(echelle, 0, 0, echelle, 0, 0);
    contexte.clearRect(0, 0, LARGEUR_DE_LA_SCENE, HAUTEUR_DE_LA_SCENE);
    for (const c of pieces) {
      if (c.retard > 0 || c.y < -12) continue;
      contexte.save();
      contexte.translate(c.x, c.y);
      contexte.rotate(c.rot);
      contexte.lineWidth = .8;
      contexte.globalAlpha = c.pose ? .85 : .95;
      if (c.eclat) {
        contexte.fillStyle = couleurDeLEtincelle(c.rang);
        contexte.strokeStyle = "#C79BD9";
        contexte.fill(eclat);
        contexte.stroke(eclat);
      } else {
        const repli = c.pose ? .7 : .5 + .5 * Math.abs(Math.cos(c.phase));
        contexte.fillStyle = c.petale;
        contexte.strokeStyle = "#B57AAE";
        contexte.beginPath();
        contexte.ellipse(0, 0, c.w / 2, Math.max(1, c.h * repli / 2), 0, 0, Math.PI * 2);
        contexte.fill();
        contexte.stroke();
      }
      contexte.restore();
    }
  }

  return { avancer, dessiner };
}
