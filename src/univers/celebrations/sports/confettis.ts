import { suiteDeNombres } from "../commun/suite-de-nombres.ts";

const COULEURS = ["#1F63D8", "#FFC93C", "#FFFFFF", "#4C8FF5", "#E8604C"];
const NOMBRE_DE_CONFETTIS = 70;
const LARGEUR_DE_LA_SCENE = 360;
const HAUTEUR_DE_LA_SCENE = 450;

type Confetti = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  readonly w: number;
  readonly h: number;
  rot: number;
  readonly vrot: number;
  phase: number;
  readonly sol: number;
  readonly couleur: string;
  pose: boolean;
};

function semer(): Confetti[] {
  const suite = suiteDeNombres(106);
  return Array.from({ length: NOMBRE_DE_CONFETTIS }, (_, i) => {
    const ang = -Math.PI / 2 + (suite() - .5) * 2.4, v = 240 + suite() * 280, origine = i % 2 ? { x: 105, y: 236 } : { x: 255, y: 236 };
    return {
      x: origine.x + (suite() - .5) * 10,
      y: origine.y,
      vx: Math.cos(ang) * v * .9 + (i % 2 ? -50 : 50) + (suite() - .5) * 160,
      vy: Math.sin(ang) * v,
      w: 5 + suite() * 4,
      h: 3 + suite() * 3,
      rot: suite() * Math.PI,
      vrot: (suite() - .5) * 10,
      phase: suite() * 6.3,
      sol: 330 + suite() * 115,
      couleur: COULEURS[i % COULEURS.length] ?? "#FFFFFF",
      pose: false,
    };
  });
}

/** Les confettis des deux côtés du but : ils jaillissent, retombent et se posent au sol. */
export function creerLesConfettis(toile: HTMLCanvasElement) {
  const contexte = toile.getContext("2d");
  const confettis = semer();

  function avancer(dt: number) {
    for (const c of confettis) {
      if (c.pose) continue;
      c.vy += 760 * dt;
      c.vx *= 1 - 2.4 * dt;
      c.vy *= 1 - 1.6 * dt;
      c.x += c.vx * dt + Math.sin(c.phase + c.y * .05) * 22 * dt;
      c.y += c.vy * dt;
      c.rot += c.vrot * dt;
      c.phase += dt * 9;
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
    for (const c of confettis) {
      contexte.save();
      contexte.translate(c.x, c.y);
      contexte.rotate(c.rot);
      const repli = c.pose ? .55 : Math.abs(Math.cos(c.phase));
      contexte.fillStyle = c.couleur;
      contexte.globalAlpha = c.pose ? .85 : 1;
      contexte.fillRect(-c.w / 2, -c.h * repli / 2, c.w, Math.max(1.2, c.h * repli));
      contexte.restore();
    }
  }

  return { avancer, dessiner };
}
