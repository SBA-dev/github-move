/**
 * Les tracés des quatre tenues (#102), en chaînes SVG : la source unique du dessin fixe (`personnages/tenues.tsx`, qui les affiche tels quels)
 * et des scènes de célébration (qui les attachent aux articulations des personnages guides).
 * Chaque tenue a son origine au centre de l'endroit où elle se porte (cou, dos, cheville) : le repère de Coach Léo.
 * Aucune tenue ne se porte sur la tête ni dans les mains, et aucune n'a d'étoile : le nœud et le fermoir sont des rectangles arrondis.
 */
import type { CleUnivers } from "@domain/motivation";

const CONTOUR = "#33304A";
const ROUGE_DE_L_ECHARPE = "#E8604C";
const CREME_DE_L_ECHARPE = "#FFF4DC";
const BANDE_DU_COL = "M-19 -6 Q0 4 19 -6 L19 4 Q0 14 -19 4 Z";
const QUEUE_DE_L_ECHARPE = "M-19 2 L-6 4 L-7 25 L-20 24 Z";

/** Où poser une tenue sur un personnage guide : position et taille relative au dessin de Coach Léo. */
type Repere = { readonly x: number; readonly y: number; readonly echelle: number };

/** Les points d'accroche des tenues sur un personnage guide : le cou, le dos et les pieds (le repère du dessin fixe et des scènes). */
export type Ancrage = {
  readonly cou: Repere;
  readonly dos: Repere & { readonly elargissement: number };
  readonly pieds: { readonly gauche: Repere; readonly droit: Repere; readonly tige: number };
};

const CORPS_DE_COACH_LEO: Ancrage = {
  cou: { x: 0, y: -41, echelle: 1 },
  dos: { x: 0, y: -16, echelle: 1.15, elargissement: 1.55 },
  pieds: { gauche: { x: -14.7, y: 60, echelle: 1 }, droit: { x: 14.7, y: 60, echelle: 1 }, tige: 24 },
};

/** Coach Léo, Lili, Agent Max et Capitaine Sam ont le même corps ; Lumi flotte et ses ailes battent dans le dos ; Noisette est petite et ronde. */
export const ANCRAGES_DES_TENUES: Readonly<Record<CleUnivers, Ancrage>> = {
  sports: CORPS_DE_COACH_LEO,
  danse: CORPS_DE_COACH_LEO,
  police: CORPS_DE_COACH_LEO,
  pompier: CORPS_DE_COACH_LEO,
  animaux: {
    cou: { x: 0, y: -79, echelle: 1.5 },
    dos: { x: 0, y: -50, echelle: 1.5, elargissement: 1.35 },
    pieds: { gauche: { x: -17, y: -4, echelle: 0.9 }, droit: { x: 17, y: -4, echelle: 0.9 }, tige: 12 },
  },
  princesse: {
    cou: { x: 0, y: -107, echelle: 1.1 },
    dos: { x: 0, y: -84, echelle: 1.0, elargissement: 2 },
    pieds: { gauche: { x: -12, y: 0, echelle: 0.75 }, droit: { x: 12, y: 0, echelle: 0.75 }, tige: 18 },
  },
};

const bandes = (largeurs: readonly number[], rectangle: (position: number, couleur: string) => string) =>
  largeurs.map((position, i) => rectangle(position, i % 2 === 0 ? ROUGE_DE_L_ECHARPE : CREME_DE_L_ECHARPE)).join("");

/** L'écharpe rayée : le tour du cou (`col-de-l-echarpe`) et la queue qui pend sur le devant (`queue-de-l-echarpe`). */
export function dessinDeLEcharpe(id: string): string {
  const bandesDuCol = bandes([-19, -13, -7, -1, 5, 11, 17], (x, couleur) => `<rect x="${x}" y="-8" width="6" height="24" fill="${couleur}"/>`);
  const bandesDeLaQueue = bandes([3, 8.5, 14, 19.5], (y, couleur) => `<rect x="-20" y="${y}" width="14" height="5.5" fill="${couleur}"/>`);
  return `<g data-tenue-dessin="echarpe-rayee" stroke-linejoin="round">
    <clipPath id="${id}queue"><path d="${QUEUE_DE_L_ECHARPE}"/></clipPath>
    <clipPath id="${id}col"><path d="${BANDE_DU_COL}"/></clipPath>
    <g class="queue-de-l-echarpe">
      <g clip-path="url(#${id}queue)">${bandesDeLaQueue}</g>
      <path d="${QUEUE_DE_L_ECHARPE}" fill="none" stroke="${CONTOUR}" stroke-width="2.4"/>
      <path d="M-19 25 v4 M-15 25 v4 M-11 25 v4" stroke="${ROUGE_DE_L_ECHARPE}" stroke-width="2" stroke-linecap="round"/>
    </g>
    <g class="col-de-l-echarpe">
      <g clip-path="url(#${id}col)">${bandesDuCol}</g>
      <path d="${BANDE_DU_COL}" fill="none" stroke="${CONTOUR}" stroke-width="2.4"/>
    </g>
  </g>`;
}

export const DESSIN_DU_NOEUD_PAPILLON = `<g data-tenue-dessin="noeud-papillon" stroke="${CONTOUR}" stroke-width="2.4" stroke-linejoin="round">
    <path d="M-2 0 Q-8 -9 -15 -8 Q-18 0 -15 8 Q-8 9 -2 0 Z" fill="#7A4FD6"/>
    <path d="M2 0 Q8 -9 15 -8 Q18 0 15 8 Q8 9 2 0 Z" fill="#7A4FD6"/>
    <g stroke="none" fill="#FFFFFF" opacity=".85"><circle cx="-10" cy="-2.5" r="1.7"/><circle cx="-10" cy="3" r="1.7"/><circle cx="10" cy="-2.5" r="1.7"/><circle cx="10" cy="3" r="1.7"/></g>
    <rect x="-4.5" y="-5" width="9" height="10" rx="3.5" fill="#FFC93C"/>
  </g>`;

/** Le sac à dos d'explorateur, posé derrière le corps ; `elargissement` l'élargit pour les personnages à large dos (Lumi, Noisette). */
export function dessinDuSacADos(id: string, elargissement: number): string {
  const demiLargeur = 23 * elargissement;
  return `<g data-tenue-dessin="sac-a-dos-d-explorateur" stroke="${CONTOUR}" stroke-width="2.6" stroke-linejoin="round">
    <defs><radialGradient id="${id}sac" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#8FDDA8"/><stop offset="1" stop-color="#4FB37A"/></radialGradient></defs>
    <rect x="${-demiLargeur}" y="-24" width="${2 * demiLargeur}" height="48" rx="15" fill="url(#${id}sac)"/>
    <path d="M${-demiLargeur} -6 Q${-demiLargeur} -24 -8 -24 H8 Q${demiLargeur} -24 ${demiLargeur} -6 Q0 4 ${-demiLargeur} -6 Z" fill="#3E9466"/>
    <rect x="${-demiLargeur * 0.6}" y="9" width="${demiLargeur * 1.2}" height="13" rx="6" fill="#A8703A"/>
    <rect x="-4" y="-4" width="8" height="7" rx="2.5" fill="#FFC93C" stroke-width="1.8"/>
  </g>`;
}

/** Les bretelles du sac, devant le corps. */
export const DESSIN_DES_BRETELLES = `<g data-tenue-dessin="sac-a-dos-d-explorateur-bretelles" fill="none" stroke="${CONTOUR}" stroke-linecap="round">
    <path d="M-12 -18 Q-16 0 -14 18 M12 -18 Q16 0 14 18" stroke-width="8"/>
    <path d="M-12 -18 Q-16 0 -14 18 M12 -18 Q16 0 14 18" stroke-width="4.4" stroke="#A8703A"/>
  </g>`;

const JAUNE_DE_LA_BOTTE = "#FFC93C";
const ROUGE_DE_LA_BOTTE = "#E8604C";
const SEMELLE_DE_LA_BOTTE = "#B9831A";

const TRAIT_DES_BOTTES = `stroke="${CONTOUR}" stroke-width="2.6" stroke-linejoin="round"`;

/** Le corps d'une botte vue de face (la tige, son revers rouge, la semelle), la cheville à l'origine ; `tige` est la hauteur de la tige au-dessus de la cheville. */
const corpsDeLaBotte = (tige: number) => `<path d="M-9 ${-tige} H9 V0 Q14 1 14 8 Q14 15 7 16 H-7 Q-14 15 -14 8 Q-14 1 -9 0 Z" fill="${JAUNE_DE_LA_BOTTE}"/>
    <path d="M-9 ${-tige} H9 V${6 - tige} H-9 Z" fill="${ROUGE_DE_LA_BOTTE}"/>
    <path d="M-14 12 H14" stroke-width="1.6" stroke="${SEMELLE_DE_LA_BOTTE}"/>`;

const refletDeLaBotte = (tige: number) => `<path d="M-5 ${10 - tige} V3" stroke="#FFF3B8" stroke-width="2.4" stroke-linecap="round" fill="none"/>`;

/** Une botte de pluie vue de face. */
export function dessinDeLaBotte(tige: number): string {
  return `<g ${TRAIT_DES_BOTTES}>${corpsDeLaBotte(tige)}${refletDeLaBotte(tige)}</g>`;
}

/**
 * Une botte dans les trois vues des scènes, à la place de la chaussure : `face` (avec `devant` et `talon`, selon que le personnage est de face ou de dos),
 * `profil` (la pointe vers +x) et `semelle` (le pied levé, vu de dessous).
 */
export function vuesDeLaBotte(tige: number): { readonly face: string; readonly profil: string; readonly semelle: string } {
  const haut = -tige;
  return {
    face: `<g ${TRAIT_DES_BOTTES}>${corpsDeLaBotte(tige)}</g><g class="devant">${refletDeLaBotte(tige)}</g><g class="talon"/>`,
    profil: `<g ${TRAIT_DES_BOTTES}>
    <path d="M-9 ${haut} H8 V0 Q9 -1 14 0 Q25 1 25 9 Q25 15 18 16 H-9 Q-14 16 -14 10 Q-14 3 -9 1 Z" fill="${JAUNE_DE_LA_BOTTE}"/>
    <path d="M-9 ${haut} H8 V${haut + 6} H-9 Z" fill="${ROUGE_DE_LA_BOTTE}"/>
    <path d="M-14 12 H25" stroke-width="1.6" stroke="${SEMELLE_DE_LA_BOTTE}" fill="none"/>
    <path d="M-4 ${haut + 10} V4" stroke="#FFF3B8" stroke-width="2.4" stroke-linecap="round" fill="none"/></g>`,
    semelle: `<path d="M-10 -10 Q-14 0 -11 10 Q-4 16 3 16 Q12 16 14 8 Q15 -2 11 -10 Q0 -14 -10 -10 Z" fill="${SEMELLE_DE_LA_BOTTE}" stroke="${CONTOUR}" stroke-width="2.4" stroke-linejoin="round"/>
    <g fill="none" stroke="#FFF3B8" stroke-width="1.8" stroke-linecap="round"><path d="M-6 -4 H7 M-6 2 H8 M-5 8 H7"/></g>`,
  };
}
