import { suiteDeNombres } from "../commun/suite-de-nombres.ts";
import { CONTOUR, OR } from "./dessin-de-sam.ts";
import { EAU, EAU_CONTOUR } from "./dessin-du-jardin.ts";

const COULEURS = ["#FF7FB0", "#A47BFF", "#FFD23F", "#FFFFFF", "#5FA8FF", "#FF9ED0"];
const NOMBRE_DE_PETALES = 64;
const LARGEUR_DE_LA_SCENE = 360;
const HAUTEUR_DE_LA_SCENE = 450;
/** D'où jaillissent les pétales : le dévidoir et le parterre (un côté sur deux). */
const ORIGINES = [{ x: 60, y: 330, poussee: 60 }, { x: 296, y: 356, poussee: -50 }] as const;

type Genre = "petale" | "goutte" | "etincelle";

type Petale = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  readonly taille: number;
  rot: number;
  readonly vrot: number;
  phase: number;
  readonly sol: number;
  readonly genre: Genre;
  readonly couleur: string;
  pose: boolean;
};

const genreDe = (i: number): Genre => i % 8 === 3 ? "etincelle" : i % 4 === 1 ? "goutte" : "petale";

function semer(): Petale[] {
  const suite = suiteDeNombres(106);
  return Array.from({ length: NOMBRE_DE_PETALES }, (_, i) => {
    const origine = ORIGINES[i % 2] ?? ORIGINES[0], ang = -Math.PI / 2 + (suite() - .5) * 2.2, v = 240 + suite() * 260;
    return {
      x: origine.x + (suite() - .5) * 40,
      y: origine.y,
      vx: Math.cos(ang) * v * .8 + origine.poussee + (suite() - .5) * 120,
      vy: Math.sin(ang) * v,
      taille: 4 + suite() * 2.5,
      rot: suite() * Math.PI,
      vrot: (suite() - .5) * 6,
      phase: suite() * 6.3,
      sol: 330 + suite() * 115,
      genre: genreDe(i),
      couleur: COULEURS[i % COULEURS.length] ?? "#FFFFFF",
      pose: false,
    };
  });
}

/** Les pétales de la caserne : des pétales de fleurs, des gouttelettes et des étincelles à quatre branches, qui jaillissent du jardin et retombent doucement dans la cour. */
export function creerLesPetalesDeLaCaserne(toile: HTMLCanvasElement) {
  const contexte = toile.getContext("2d");
  const petales = semer();

  function avancer(dt: number) {
    for (const c of petales) {
      if (c.pose) continue;
      c.vy += 700 * dt;
      c.vx *= 1 - 2.4 * dt;
      c.vy *= 1 - (c.genre === "petale" ? 2.2 : 1.4) * dt;
      c.x += c.vx * dt + Math.sin(c.phase + c.y * .05) * 26 * dt;
      c.y += c.vy * dt;
      c.rot += c.vrot * dt;
      c.phase += dt * 7;
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
    contexte.lineJoin = "round";
    for (const c of petales) {
      contexte.save();
      contexte.translate(c.x, c.y);
      contexte.rotate(c.rot);
      contexte.globalAlpha = c.pose ? .9 : 1;
      const s = c.taille, repli = c.pose ? .7 : .45 + .55 * Math.abs(Math.cos(c.phase));
      contexte.strokeStyle = CONTOUR;
      contexte.lineWidth = 1.2;
      if (c.genre === "petale") {
        contexte.fillStyle = c.couleur;
        contexte.beginPath();
        contexte.ellipse(0, 0, s, s * .62 * repli, 0, 0, Math.PI * 2);
      } else if (c.genre === "goutte") {
        contexte.fillStyle = EAU;
        contexte.strokeStyle = EAU_CONTOUR;
        contexte.rotate(-c.rot);
        contexte.beginPath();
        contexte.moveTo(0, -s);
        contexte.quadraticCurveTo(s * .75, -s * .1, s * .7, s * .45);
        contexte.arc(0, s * .45, s * .7, 0, Math.PI);
        contexte.quadraticCurveTo(-s * .75, -s * .1, 0, -s);
      } else {
        contexte.fillStyle = OR;
        contexte.beginPath();
        const b = s * 1.2, m = s * .35;
        contexte.moveTo(0, -b);
        contexte.lineTo(m, -m);
        contexte.lineTo(b, 0);
        contexte.lineTo(m, m);
        contexte.lineTo(0, b);
        contexte.lineTo(-m, m);
        contexte.lineTo(-b, 0);
        contexte.lineTo(-m, -m);
        contexte.closePath();
      }
      contexte.fill();
      contexte.stroke();
      contexte.restore();
    }
  }

  return { avancer, dessiner };
}
