import { DEG, r1 } from "../commun/courbes.ts";
import { CONTOUR, OR } from "./dessin-de-sam.ts";

export const EAU = "#BDE8FF";
export const EAU_CONTOUR = "#3C8DDA";
const TUYAU = "#EFE3C6";
const METAL = "#C8D2E6";

/** Le dévidoir rouge posé à gauche (un tambour de tuyau sur deux roues) : d'où part le tuyau de la lance. */
export const DEVIDOIR = { x: 50, y: 382 };
export const SORTIE_DU_TUYAU = { x: 70, y: 362 };

export const DEVIDOIR_DESSINE = `<g transform="translate(${DEVIDOIR.x} ${DEVIDOIR.y})" stroke="${CONTOUR}" stroke-linejoin="round">
      <path d="M-26 -62 Q-30 -66 -24 -68 H-12" fill="none" stroke-width="6" stroke-linecap="round"/><path d="M-26 -62 Q-30 -66 -24 -68 H-12" fill="none" stroke="#931F0C" stroke-width="3" stroke-linecap="round"/>
      <path d="M-22 -2 L-14 -58 M22 -2 L14 -58" fill="none" stroke-width="7" stroke-linecap="round"/><path d="M-22 -2 L-14 -58 M22 -2 L14 -58" fill="none" stroke="#C2341B" stroke-width="4" stroke-linecap="round"/>
      <circle cy="-34" r="25" fill="#C2341B" stroke-width="2.8"/>
      <circle cy="-34" r="19" fill="${TUYAU}" stroke-width="2.2"/><g fill="none" stroke="#D2C29C" stroke-width="1.6"><circle cy="-34" r="15"/><circle cy="-34" r="11"/></g>
      <circle cy="-34" r="7" fill="${OR}" stroke-width="2.2"/><circle cx="-2" cy="-36" r="2" fill="#FFF1A8" stroke="none"/>
      <path d="M-16 -50 Q-8 -56 4 -56" fill="none" stroke="#E8604C" stroke-width="2.4" stroke-linecap="round" opacity=".9"/>
      <g fill="#4A4A5E" stroke-width="2.4"><circle cx="-22" cy="-6" r="7"/><circle cx="22" cy="-6" r="7"/></g><g fill="${METAL}" stroke="none"><circle cx="-22" cy="-6" r="2.4"/><circle cx="22" cy="-6" r="2.4"/></g>
    </g>`;

/** La cloche dorée de la caserne (le pivot est au crochet, en haut), sous sa petite arche. */
export const CLOCHE = { x: 152, y: 110 };
export const CORDE_AU_REPOS = 150;

export const CLOCHE_DESSINEE = `<g stroke="${CONTOUR}" stroke-linejoin="round"><circle r="3.5" fill="none" stroke-width="2.4"/>
      <path d="M-4 3 Q-13 5 -13 17 Q-13 23 -17 27 H17 Q13 23 13 17 Q13 5 4 3 Z" fill="${OR}" stroke-width="2.6"/>
      <path d="M5 4 Q11 7 11 17 Q11 23 14 27 H6 Q8 18 5 4 Z" fill="#E0A72A" stroke="none"/><path d="M-7 8 Q-9 12 -9 18" fill="none" stroke="#FFF1A8" stroke-width="2.2" stroke-linecap="round"/>
      <path d="M-17 27 Q0 31 17 27" fill="none" stroke-width="2.4"/><circle class="battant" cy="30" r="3.6" fill="#E0A72A" stroke-width="2"/></g>`;

/** La corde de la cloche et son pompon doré : la corde pend au repos, ou suit la main de Sam quand il la tient. */
export const FIL_DE_LA_CLOCHE =
  `<path id="pompier-corde" fill="none" stroke="${CONTOUR}" stroke-width="5" stroke-linecap="round"/><path id="pompier-corde-in" fill="none" stroke="#E7C58C" stroke-width="2.6" stroke-linecap="round"/>
      <g id="pompier-pompon"><circle r="5" fill="${OR}" stroke="${CONTOUR}" stroke-width="2.2"/><path d="M-3 4 L-4 11 M0 5 V12 M3 4 L4 11" stroke="${CONTOUR}" stroke-width="2.6" stroke-linecap="round"/><path d="M-3 4 L-4 11 M0 5 V12 M3 4 L4 11" stroke="${OR}" stroke-width="1.2" stroke-linecap="round"/></g>`;

/** Le jardin : cinq boutons de fleurs fermés qui s'ouvrent sous l'eau (six pétales ronds, couleurs vives). */
export const FLEURS: readonly { readonly x: number; readonly y: number; readonly c: string }[] = [
  { x: 252, y: 382, c: "#FF7FB0" },
  { x: 274, y: 376, c: "#A47BFF" },
  { x: 296, y: 383, c: "#FFD23F" },
  { x: 318, y: 375, c: "#5FA8FF" },
  { x: 340, y: 382, c: "#FF9ED0" },
];

const corolle = (c: string) =>
  [0, 1, 2, 3, 4, 5].map((k) => `<circle cx="${r1(Math.cos(k * 60 * DEG) * 6.4)}" cy="${r1(Math.sin(k * 60 * DEG) * 6.4)}" r="5.2" fill="${c}" stroke="${CONTOUR}" stroke-width="1.6"/>`).join("");

export const dessinDeLaFleur = ({ x, y, c }: (typeof FLEURS)[number], i: number) =>
  `<g class="fleur" transform="translate(${x} ${y})">
      <path d="M0 0 Q-2 -10 0 -21" fill="none" stroke="${CONTOUR}" stroke-width="5" stroke-linecap="round"/><path d="M0 0 Q-2 -10 0 -21" fill="none" stroke="#4FB37A" stroke-width="2.6" stroke-linecap="round"/>
      <path d="M-1 -8 Q${i % 2 ? -9 : 9} -15 ${i % 2 ? -11 : 11} -8 Q${i % 2 ? -6 : 6} -4 -1 -8 Z" fill="#5BC37C" stroke="${CONTOUR}" stroke-width="1.6"/>
      <g class="tete-fleur" transform="translate(0 -23)">
        <g class="bouton"><path d="M0 -9 Q6 -3 5 2 Q0 6 -5 2 Q-6 -3 0 -9 Z" fill="${c}" stroke="${CONTOUR}" stroke-width="1.8"/><path d="M-5 2 Q0 7 5 2 Q3 -2 0 1 Q-3 -2 -5 2 Z" fill="#4FB37A" stroke="${CONTOUR}" stroke-width="1.4"/></g>
        <g class="corolle">${corolle(c)}<circle r="4.2" fill="${c === "#FFD23F" ? "#FFF7D6" : "#FFD54A"}" stroke="${CONTOUR}" stroke-width="1.6"/><circle cx="-1.2" cy="-1.2" r="1.2" fill="#FFFFFF" opacity=".8"/></g>
      </g></g>`;

/** L'arc-en-ciel : six bandes, dévoilées de droite à gauche. */
const ARC_EN_CIEL = { x: 176, y: 330, r: 214 };
const COULEURS_DE_L_ARC = ["#FF6B6B", "#FFA94D", "#FFE066", "#69DB7C", "#4DABF7", "#9775FA"];

export const ARC_EN_CIEL_DESSINE = COULEURS_DE_L_ARC.map((c, i) => {
  const r = ARC_EN_CIEL.r - i * 7;
  return `<path pathLength="1" stroke-dasharray="1 1" d="M${ARC_EN_CIEL.x + r} ${ARC_EN_CIEL.y} A${r} ${r} 0 0 0 ${ARC_EN_CIEL.x - r} ${ARC_EN_CIEL.y}" stroke="${c}" stroke-width="7.4"/>`;
}).join("");

/** Une goutte, et une étincelle à quatre branches (jamais une étoile à cinq branches) : l'eau et les éclats de la fête. */
export const GOUTTE = `<path d="M0 -5 Q3.6 -0.5 3.6 2.2 A3.6 3.6 0 0 1 -3.6 2.2 Q-3.6 -0.5 0 -5 Z"/>`;
export const ETINCELLE_DE_LA_PLUIE = (couleur: string) =>
  `<path d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8 Z" fill="${couleur}" stroke="${CONTOUR}" stroke-width="1.3" stroke-linejoin="round"/>`;
export const ETINCELLE_DE_LA_TETE = `<path d="M0 -7 L2 -2 L7 0 L2 2 L0 7 L-2 2 L-7 0 L-2 -2 Z"/>`;
export const ETINCELLE_DU_POUCE = `<path d="M0 -6 L1.8 -1.8 L6 0 L1.8 1.8 L0 6 L-1.8 1.8 L-6 0 L-1.8 -1.8 Z"/>`;

/** Une petite note de musique, dessinée et jamais écrite : elle s'envole de la cloche. */
export const NOTE = (couleur: string) =>
  `<g stroke="${CONTOUR}" stroke-linejoin="round"><path d="M3.6 -1 V-16 Q10 -13 9 -6" fill="none" stroke-width="4.4" stroke-linecap="round"/><path d="M3.6 -1 V-16 Q10 -13 9 -6" fill="none" stroke="${couleur}" stroke-width="2" stroke-linecap="round"/><ellipse rx="4.6" ry="3.4" transform="rotate(-20)" fill="${couleur}" stroke-width="2"/></g>`;
export const COULEURS_DES_NOTES = ["#7A4FD6", "#FFC93C", "#4C8FF5"];
export const COULEURS_DES_RAYONS = ["#C2341B", "#FFC93C", "#FFFFFF", "#7CC6FF"];
