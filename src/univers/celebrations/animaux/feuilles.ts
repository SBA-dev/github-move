import { au } from "../commun/tableaux.ts";
import { suiteDeNombres } from "../commun/suite-de-nombres.ts";

const COULEURS = ["#8FD98A", "#F7D86A", "#FFC93C", "#F4A83C", "#6CBF84"];
const NOMBRE_DE_FEUILLES = 56;
/** Toute la scène est visible : 360 de large sur 450 de haut. */
const VUE = { largeur: 360, hauteur: 450 };
const UNE_ETINCELLE_SUR = 5;
const POINTES_DE_L_ETINCELLE = 4;

type Feuille = {
  x: number;
  y: number;
  readonly vx: number;
  vy: number;
  readonly etincelle: boolean;
  readonly w: number;
  readonly h: number;
  rot: number;
  readonly vrot: number;
  phase: number;
  readonly sol: number;
  readonly couleur: string;
  pose: boolean;
  retard: number;
};

function semer(): Feuille[] {
  const suite = suiteDeNombres(106);
  return Array.from({ length: NOMBRE_DE_FEUILLES }, (_, i) => ({
    x: 20 + suite() * 320,
    y: -20 - suite() * 240,
    vx: (suite() - .5) * 30,
    vy: 30 + suite() * 30,
    etincelle: i % UNE_ETINCELLE_SUR === 0,
    w: 9 + suite() * 4,
    h: 4.5 + suite() * 2.5,
    rot: suite() * Math.PI,
    vrot: (suite() - .5) * 4,
    phase: suite() * 6.3,
    sol: 300 + suite() * 150,
    couleur: au(COULEURS, i % COULEURS.length),
    pose: false,
    retard: suite() * 1.2,
  }));
}

/** Les feuilles de la forêt et les petites étincelles à quatre branches : elles tombent doucement du ciel et se posent sur la prairie. */
export function creerLesFeuilles(toile: HTMLCanvasElement) {
  const contexte = toile.getContext("2d");
  const feuilles = semer();

  function avancer(dt: number) {
    for (const f of feuilles) {
      if (f.pose) continue;
      if (f.retard > 0) {
        f.retard -= dt;
        continue;
      }
      f.vy = Math.min(f.etincelle ? 110 : 80, f.vy + 70 * dt);
      f.phase += dt * 4;
      f.x += f.vx * dt + Math.sin(f.phase) * 30 * dt;
      f.y += f.vy * dt;
      f.rot += f.vrot * dt + Math.cos(f.phase) * .05;
      if (f.y >= f.sol) {
        f.y = f.sol;
        f.pose = true;
      }
    }
  }

  function dessinerUneEtincelle(c: CanvasRenderingContext2D) {
    c.fillStyle = "#FFE9A8";
    c.beginPath();
    for (let k = 0; k < POINTES_DE_L_ETINCELLE * 2; k++) {
      const rayon = k % 2 ? 1.6 : 6, angle = k * Math.PI / POINTES_DE_L_ETINCELLE - Math.PI / 2;
      c.lineTo(Math.cos(angle) * rayon, Math.sin(angle) * rayon);
    }
    c.closePath();
    c.fill();
    c.stroke();
  }

  function dessiner() {
    if (!contexte) return;
    const largeur = toile.clientWidth, dpr = Math.min(2, devicePixelRatio || 1);
    if (toile.width !== Math.round(largeur * dpr)) {
      toile.width = Math.round(largeur * dpr);
      toile.height = Math.round(largeur * VUE.hauteur / VUE.largeur * dpr);
    }
    const echelle = toile.width / VUE.largeur;
    contexte.setTransform(echelle, 0, 0, echelle, 0, 0);
    contexte.clearRect(0, 0, VUE.largeur, VUE.hauteur);
    for (const f of feuilles) {
      if (f.retard > 0 || f.y < -12) continue;
      contexte.save();
      contexte.translate(f.x, f.y);
      contexte.rotate(f.rot);
      contexte.strokeStyle = "#33304A";
      contexte.lineWidth = .8;
      contexte.globalAlpha = f.pose ? .85 : .95;
      if (f.etincelle) dessinerUneEtincelle(contexte);
      else {
        const repli = f.pose ? .7 : .5 + .5 * Math.abs(Math.cos(f.phase));
        contexte.fillStyle = f.couleur;
        contexte.beginPath();
        contexte.ellipse(0, 0, f.w / 2, Math.max(1, f.h * repli / 2), 0, 0, Math.PI * 2);
        contexte.fill();
        contexte.stroke();
      }
      contexte.restore();
    }
  }

  return { avancer, dessiner };
}
