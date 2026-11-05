import { type CoteDeMain, dessinDesMains } from "../commun/mains.ts";
import { ligne } from "../commun/trait.ts";

export const CONTOUR = "#33304A";
export const OR = "#FFC93C";
const OR_OMBRE = "#D99A12";
const PEAU = "#ffd9b8";
const PEAU_OMBRE = "#E8B48C";
const PEAU_LUMIERE = "#FFF0E0";
const CHEVEUX = "#f7cc4f";
const CHEVEUX_OMBRE = "#D9A92C";
const CHEVEUX_LUMIERE = "#FFE992";
const ROBE = "#ff9cbc";
const ROBE_OMBRE = "#E07AA0";
const ROBE_LUMIERE = "#FFC4D6";
const LEGGING = "#EBD9F7";
const LEGGING_OMBRE = "#CDB3E3";
const BALLERINE = "#C86BD6";

export const MAINS: Record<CoteDeMain, readonly string[]> = dessinDesMains({ contour: CONTOUR, peau: PEAU, peauOmbre: PEAU_OMBRE });

/** Un bras de Lumi : la manche bouffante est une ellipse posée sur l'épaule, la main est changée par le moteur. */
export const dessinDuBras = (c: "g" | "d") =>
  `<g id="princesse-bras-${c}">${ligne("contour", CONTOUR, 19)}${ligne("rempli", PEAU, 13)}${ligne("ombre", PEAU_OMBRE, 4.5)}${ligne("lumiere", PEAU_LUMIERE, 3)}<g class="manche"><ellipse rx="13" ry="10" fill="${ROBE}" stroke="${CONTOUR}" stroke-width="2.8"/><path d="M-9 4 Q0 10 9 4" fill="none" stroke="${ROBE_OMBRE}" stroke-width="3" stroke-linecap="round"/><ellipse cx="-4" cy="-4" rx="4" ry="2.4" fill="${ROBE_LUMIERE}" opacity=".9"/></g><g id="princesse-main-${c}"><g class="pose-main"></g></g></g>`;

/** Une jambe en legging et sa ballerine. */
const dessinDeLaJambe = (c: "g" | "d") =>
  `<g id="princesse-jambe-${c}">${ligne("contour", CONTOUR, 18)}${ligne("rempli", LEGGING, 12)}${ligne("ombre", LEGGING_OMBRE, 4)}<g id="princesse-pied-${c}"><path d="M-10 -4 Q-12 6 -2 8 H6 Q14 8 12 1 Q10 -6 2 -7 Q-6 -8 -10 -4 Z" fill="${BALLERINE}" stroke="${CONTOUR}" stroke-width="2.6" stroke-linejoin="round"/><path d="M-6 -4 Q0 -1 6 -4" fill="none" stroke="${CONTOUR}" stroke-width="1.2" opacity=".6"/><path d="M0 -6 l-3 -3 l3 1 l3 -1 Z" fill="${OR}" stroke="${CONTOUR}" stroke-width="1"/></g></g>`;

const dessinDeLOeil = (c: "g" | "d") =>
  `<g id="princesse-oeil-${c}"><ellipse rx="9" ry="11" fill="#FFFFFF" stroke="${PEAU_OMBRE}" stroke-width="1"/>
      <g id="princesse-regard-${c}"><circle cx=".5" cy="3" r="5.4" fill="#2F5F8A"/><circle cx=".5" cy="3" r="4.4" fill="#4C8FF5"/><circle cx=".5" cy="3" r="2.6" fill="#1B1530"/><circle cx="-1.6" cy=".4" r="2" fill="#FFFFFF"/><circle cx="2.8" cy="5" r="1" fill="#FFFFFF"/></g>
      <g clip-path="url(#princesse-clip-oeil)"><ellipse id="princesse-paupiere-${c}" rx="11" ry="12" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="2.6"/></g>
      <path d="M-8.5 0 A9 11 0 0 1 8.5 0" fill="none" stroke="${CONTOUR}" stroke-width="3" stroke-linecap="round"/>
      <path d="M-5 10.2 Q0 12 5 10.2" fill="none" stroke="${CONTOUR}" stroke-width="1" stroke-linecap="round" opacity=".4"/>
      <path d="${c === "g" ? "M-7 -8 l-2.6 -2.4 M-8.6 -4 l-3 -1.2" : "M7 -8 l2.6 -2.4 M8.6 -4 l3 -1.2"}" fill="none" stroke="${CONTOUR}" stroke-width="2.2" stroke-linecap="round"/></g>`;

const dessinDuSourcil = (c: "g" | "d") =>
  `<g id="princesse-sourcil-${c}"><path d="M-8 0 Q0 -5 8 0" fill="none" stroke="${CHEVEUX_OMBRE}" stroke-width="3.4" stroke-linecap="round"/></g>`;

/** Une aile translucide ; m = -1 pour l'aile gauche, 1 pour la droite. */
const dessinDeLAile = (m: -1 | 1) =>
  `<path d="M0 0 Q${18 * m} -34 ${44 * m} -40 Q${58 * m} -36 ${50 * m} -18 Q${42 * m} -4 ${12 * m} 2 Q${44 * m} 6 ${48 * m} 22 Q${44 * m} 36 ${26 * m} 32 Q${8 * m} 26 0 8 Z" fill="url(#princesse-aile)" stroke="#9CCFFF" stroke-width="2.4" stroke-linejoin="round"/><path d="M${6 * m} -2 Q${26 * m} -22 ${42 * m} -30 M${8 * m} 6 Q${26 * m} 14 ${38 * m} 22" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity=".8"/>`;

const MECHE = `<path class="meche" fill="${CHEVEUX}" stroke="${CONTOUR}" stroke-width="2.8" stroke-linejoin="round"/><path class="meche-ombre" fill="none" stroke="${CHEVEUX_OMBRE}" stroke-width="1.4" stroke-linecap="round"/><path class="meche-lumiere" fill="none" stroke="${CHEVEUX_LUMIERE}" stroke-width="2.2" stroke-linecap="round"/>`;

const dessinDesBouches = `
        <path data-emo="sourire" d="M-8 0 Q0 8 8 0" fill="none" stroke="${CONTOUR}" stroke-width="2.4" stroke-linecap="round"/>
        <g data-emo="joie"><path d="M-11 0 Q0 20 11 0 Z" fill="#C9475A"/><g clip-path="url(#princesse-clip-bouche)"><ellipse cy="17" rx="7" ry="4.5" fill="#FF8FA8"/><path d="M-11 -.5 Q0 7 11 -.5 Z" fill="#FFFFFF"/></g><path d="M-11 0 Q0 20 11 0 Z" fill="none" stroke="${CONTOUR}" stroke-width="1.8" stroke-linejoin="round"/></g>
        <path data-emo="concentration" d="M-5 1 Q0 6 5 1" fill="none" stroke="${CONTOUR}" stroke-width="2.4" stroke-linecap="round"/>
        <ellipse data-emo="surprise" cy="4" rx="4.5" ry="6" fill="#C9475A" stroke="${CONTOUR}" stroke-width="1.8"/>`;

/**
 * Lumi, articulée : le moteur place chaque pièce à chaque image (maquette validée).
 * Robe rose jusqu'aux genoux à manches bouffantes et col rond, legging, ballerines, tiare ; cheveux d'un seul tenant, ailes translucides.
 */
export const STRUCTURE_DE_LUMI = `
    <g><g id="princesse-aile-g">${dessinDeLAile(-1)}</g><g id="princesse-aile-d">${dessinDeLAile(1)}</g></g>
    <g id="princesse-cheveux-arriere"><path id="princesse-chevelure-dos" fill="${CHEVEUX}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round"/>${[0, 1, 2, 3, 4].map((k) => `<g id="princesse-brin-${k}">${MECHE}</g>`).join("")}</g>
    <g id="princesse-bras-arriere"></g>
    ${dessinDeLaJambe("g")}${dessinDeLaJambe("d")}
    <g id="princesse-robe">
      <path class="jupe-arriere" fill="${ROBE_OMBRE}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round"/>
      <path class="jupe" fill="${ROBE}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round"/>
      <path class="jupe-plis" fill="#D96A90" opacity=".9"/><path class="jupe-lumiere" fill="${ROBE_LUMIERE}" opacity=".9"/><path class="jupe-ombre" fill="none" stroke="${ROBE_OMBRE}" stroke-width="2" stroke-linecap="round" opacity=".7"/>
      <path class="corsage" fill="${ROBE}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round"/><path class="corsage-ombre" fill="${ROBE_OMBRE}"/>
      <path class="ceinture" fill="none" stroke="${OR}" stroke-width="4" stroke-linecap="round"/><path class="col" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="2.4"/>
      <g class="etincelle-du-corsage"><path d="M0 -5 L1.5 -1.5 L5 0 L1.5 1.5 L0 5 L-1.5 1.5 L-5 0 L-1.5 -1.5 Z" fill="${OR}" stroke="${CONTOUR}" stroke-width="1.2"/></g>
    </g>
    <g><path d="M-6 -118 V-104 H6 V-118 Z" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="2.6"/></g>
    <g id="princesse-tete">
      <circle r="40" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="3.6"/>
      <path d="M10 38 A40 40 0 0 0 38 -12 A33 33 0 0 1 10 38 Z" fill="${PEAU_OMBRE}"/>
      <ellipse cx="-16" cy="-22" rx="10" ry="5" fill="${PEAU_LUMIERE}" opacity=".9"/>
      <g id="princesse-oreille-g"><circle r="6" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="2.6"/><circle r="2.2" fill="${PEAU_OMBRE}"/></g><g id="princesse-oreille-d"><circle r="6" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="2.6"/><circle r="2.2" fill="${PEAU_OMBRE}"/></g>
      <g id="princesse-joue-g"><ellipse rx="7" ry="4.5" fill="#FF8FA8" opacity=".4"/></g><g id="princesse-joue-d"><ellipse rx="7" ry="4.5" fill="#FF8FA8" opacity=".4"/></g>
      <g id="princesse-bouche">${dessinDesBouches}
      </g>
      <g id="princesse-nez"><path d="M-2 -3 Q0 2 3 -1" fill="none" stroke="${CONTOUR}" stroke-width="2.2" stroke-linecap="round"/></g>
      ${dessinDeLOeil("g")}${dessinDeLOeil("d")}
      ${dessinDuSourcil("g")}${dessinDuSourcil("d")}
      <g><path id="princesse-frange-forme" fill="${CHEVEUX}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round"/><path id="princesse-frange-ombre" fill="none" stroke="${CHEVEUX_OMBRE}" stroke-width="2" stroke-linecap="round" opacity=".8"/><path id="princesse-frange-lumiere" fill="none" stroke="${CHEVEUX_LUMIERE}" stroke-width="3" stroke-linecap="round"/></g>
      <g id="princesse-tiare"><path d="M-16 -2 L-11 -14 L-5 -4 L0 -18 L5 -4 L11 -14 L16 -2 Z" fill="${OR}" stroke="${CONTOUR}" stroke-width="2.4" stroke-linejoin="round"/><circle cy="-10" r="3.2" fill="#FF8FB8" stroke="${CONTOUR}" stroke-width="1.6"/><path d="M-16 -2 H16" stroke="${OR_OMBRE}" stroke-width="2"/></g>
    </g>
    <g id="princesse-bras-avant"></g>`;
