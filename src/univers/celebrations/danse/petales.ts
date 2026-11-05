import { suiteDeNombres } from "../commun/suite-de-nombres.ts";

const COULEURS = ["#FF8FB8", "#FFC9DE", "#FFFFFF", "#F3C9F2", "#FFB3D1"];
const NOMBRE_DE_PETALES = 70;
/** La partie de la scène qu'on voit (le `viewBox` du décor) : 300 de large sur 375 de haut, à partir de (30, 110). */
const VUE = { x: 30, y: 110, largeur: 300, hauteur: 375 };
const BAS_DE_LA_VUE = VUE.y + VUE.hauteur;
const UNE_FLEUR_SUR = 6;

type Petale = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  readonly fleur: boolean;
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

function semer(): Petale[] {
  const suite = suiteDeNombres(106);
  return Array.from({ length: NOMBRE_DE_PETALES }, (_, i) => {
    const x = 30 + suite() * 300, fleur = i % UNE_FLEUR_SUR === 0;
    return {
      x,
      y: BAS_DE_LA_VUE + 1 + suite() * 20,
      vx: (180 - x) * .9 + (suite() - .5) * 120,
      vy: -(300 + suite() * 170),
      fleur,
      w: fleur ? 9 : 7 + suite() * 4,
      h: fleur ? 9 : 4.5 + suite() * 2.5,
      rot: suite() * Math.PI,
      vrot: (suite() - .5) * 5,
      phase: suite() * 6.3,
      sol: 318 + suite() * 128,
      couleur: COULEURS[i % COULEURS.length] ?? "#FFFFFF",
      pose: false,
      retard: suite() * .9,
    };
  });
}

/** Les pétales de rose et les fleurs lancés depuis la salle : ils montent, retombent en tournoyant et se posent sur la scène. */
export function creerLesPetales(toile: HTMLCanvasElement) {
  const contexte = toile.getContext("2d");
  const petales = semer();

  function avancer(dt: number) {
    for (const c of petales) {
      if (c.pose) continue;
      if (c.retard > 0) {
        c.retard -= dt;
        continue;
      }
      c.vy += (c.vy < 0 ? 520 : 140) * dt;
      c.vy = Math.min(c.fleur ? 150 : 95, c.vy);
      c.vx *= 1 - 1.4 * dt;
      c.phase += dt * 4;
      c.x += c.vx * dt + (c.vy > 0 ? Math.sin(c.phase) * 26 * dt : 0);
      c.y += c.vy * dt;
      c.rot += c.vrot * dt;
      if (c.vy > 0 && c.y >= c.sol) {
        c.y = c.sol;
        c.pose = true;
      }
    }
  }

  function dessinerUneFleur() {
    if (!contexte) return;
    contexte.fillStyle = "#FF8FB8";
    for (let k = 0; k < 5; k++) {
      contexte.beginPath();
      contexte.ellipse(Math.cos(k * 1.2566) * 3.2, Math.sin(k * 1.2566) * 3.2, 2.6, 2.6, 0, 0, Math.PI * 2);
      contexte.fill();
      contexte.stroke();
    }
    contexte.fillStyle = "#FFC93C";
    contexte.beginPath();
    contexte.arc(0, 0, 2, 0, Math.PI * 2);
    contexte.fill();
  }

  function dessiner() {
    if (!contexte) return;
    const largeur = toile.clientWidth, dpr = Math.min(2, devicePixelRatio || 1);
    if (toile.width !== Math.round(largeur * dpr)) {
      toile.width = Math.round(largeur * dpr);
      toile.height = Math.round(largeur * VUE.hauteur / VUE.largeur * dpr);
    }
    const echelle = toile.width / VUE.largeur;
    contexte.setTransform(echelle, 0, 0, echelle, -VUE.x * echelle, -VUE.y * echelle);
    contexte.clearRect(VUE.x, VUE.y, VUE.largeur, VUE.hauteur);
    for (const c of petales) {
      if (c.retard > 0 || c.y > BAS_DE_LA_VUE) continue;
      contexte.save();
      contexte.translate(c.x, c.y);
      contexte.rotate(c.rot);
      contexte.strokeStyle = "#B57AAE";
      contexte.lineWidth = .8;
      contexte.globalAlpha = c.pose ? .85 : .95;
      if (c.fleur) dessinerUneFleur();
      else {
        const repli = c.pose ? .7 : .5 + .5 * Math.abs(Math.cos(c.phase));
        contexte.fillStyle = c.couleur;
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
