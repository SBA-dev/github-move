import { type CoteDeMain, dessinDesMains } from "../commun/mains.ts";

export const CONTOUR = "#33304A";
export const FOURRURE = "#F48C3C";
export const OMBRE = "#C9601C";
export const LUMIERE = "#FFC28A";
const BANDE = "#D9772A";
export const VENTRE = "#FFE0BF";
const VENTRE_LUMIERE = "#FFFFFF";
const OREILLE = "#FFB3C7";
const TRUFFE = "#8B4A1E";
const PEAU = "#FFC28A";
const PEAU_OMBRE = "#E09A5A";

export const MAINS: Record<CoteDeMain, readonly string[]> = dessinDesMains({ contour: CONTOUR, peau: PEAU, peauOmbre: PEAU_OMBRE });

const ligne = (classe: string, couleur: string, largeur: number) =>
  `<path class="${classe}" fill="none" stroke="${couleur}" stroke-width="${largeur}" stroke-linecap="round" stroke-linejoin="round"/>`;

export const dessinDuBras = (c: "g" | "d") =>
  `<g id="animaux-bras-${c}">${ligne("contour", CONTOUR, 21)}${ligne("rempli", FOURRURE, 15)}${ligne("ombre", OMBRE, 5)}${ligne("lumiere", LUMIERE, 3)}<g id="animaux-main-${c}"><g class="pose-main"></g></g></g>`;

/** Une noisette dorée (de l'arbre, de l'herbe, qui tombe, qu'on jongle) : un halo, la coque, la cupule et un reflet. */
export const dessinDeLaNoisette = (echelle: number) =>
  `<g transform="scale(${echelle})"><circle r="15" fill="url(#animaux-lueur)" transform="scale(1.5)"/><path d="M-10 -1 Q-10 -14 0 -14 Q10 -14 10 -1 Q10 9 0 11 Q-10 9 -10 -1 Z" fill="url(#animaux-noisette-or)" stroke="${CONTOUR}" stroke-width="2.6" stroke-linejoin="round"/><path d="M-10 -2 Q0 -7 10 -2 Q10 -14 0 -14 Q-10 -14 -10 -2 Z" fill="#C98A12" stroke="${CONTOUR}" stroke-width="2"/><circle cx="-3.5" cy="0" r="2.2" fill="#FFFFFF" opacity=".8"/></g>`;

const oeil = (c: "g" | "d") =>
  `<g id="animaux-oeil-${c}"><ellipse rx="9" ry="11" fill="#FFFFFF" stroke="${PEAU_OMBRE}" stroke-width="1"/>
      <g id="animaux-regard-${c}"><circle cx=".5" cy="3" r="5.4" fill="#3E2A1A"/><circle cx=".5" cy="3" r="4.4" fill="#6B4226"/><circle cx=".5" cy="3" r="2.6" fill="#1B1530"/><circle cx="-1.6" cy=".4" r="2" fill="#FFFFFF"/><circle cx="2.8" cy="5" r="1" fill="#FFFFFF"/></g>
      <g clip-path="url(#animaux-clip-oeil)"><ellipse id="animaux-paupiere-${c}" rx="11" ry="12" fill="${FOURRURE}" stroke="${CONTOUR}" stroke-width="2.6"/></g>
      <path d="M-8.5 0 A9 11 0 0 1 8.5 0" fill="none" stroke="${CONTOUR}" stroke-width="3" stroke-linecap="round"/>
      <path d="M-5 10.2 Q0 12 5 10.2" fill="none" stroke="${CONTOUR}" stroke-width="1" stroke-linecap="round" opacity=".4"/>
      <path d="${c === "g" ? "M-7 -8 l-2.6 -2.4" : "M7 -8 l2.6 -2.4"}" fill="none" stroke="${CONTOUR}" stroke-width="2.2" stroke-linecap="round"/></g>`;

const sourcil = (c: "g" | "d") =>
  `<g id="animaux-sourcil-${c}"><path d="M-8 0 Q0 -5 8 0" fill="none" stroke="${OMBRE}" stroke-width="3.6" stroke-linecap="round"/></g>`;

const joue = (c: "g" | "d") =>
  `<g id="animaux-joue-${c}"><circle r="11.5" fill="${LUMIERE}" stroke="${CONTOUR}" stroke-width="2.6"/><circle cx="${c === "g" ? -1 : 1}" cy="1" r="5" fill="#FF8FA8" opacity=".38"/></g>`;

const oreille = (c: "g" | "d") =>
  `<g id="animaux-oreille-${c}"><ellipse rx="13" ry="15" fill="${FOURRURE}" stroke="${CONTOUR}" stroke-width="3"/><ellipse cy="1" rx="7" ry="9" fill="${OREILLE}"/></g>`;

const pied = (c: "g" | "d") => {
  const cx = c === "g" ? -17 : 17, doigts = c === "g" ? "M-26 -1 q4 3 7 0 M-19 1 q4 3 7 0 M-12 -1 q3 2 6 0" : "M8 -1 q4 3 7 0 M15 1 q4 3 7 0 M22 -1 q3 2 6 0";
  return `<g id="animaux-pied-${c}"><ellipse cx="${cx}" cy="-5" rx="16" ry="9" fill="${FOURRURE}" stroke="${CONTOUR}" stroke-width="3"/><path d="${doigts}" fill="none" stroke="${CONTOUR}" stroke-width="1.5" opacity=".7"/></g>`;
};

const jambe = (signe: 1 | -1) =>
  `<path d="M${signe * 20} -30 Q${signe * 26} -14 ${signe * 20} -6 Q${signe * 12} -2 ${signe * 8} -8 Q${signe * 6} -20 ${signe * 10} -30 Z" fill="${FOURRURE}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round"/>`;

const TRAIT_DE_BOUCHE = `fill="none" stroke="${CONTOUR}" stroke-linecap="round"`;
/**
 * Les bouches, une par expression. Toutes sont fermées ou à peine ouvertes, sans intérieur dessiné : Noisette sourit,
 * mâche la bouche fermée, a les joues pleines. Jamais de langue, de dents mâchées ni de bave.
 */
const BOUCHES = `
        <path data-emo="sourire" d="M-9 0 Q0 9 9 0" ${TRAIT_DE_BOUCHE} stroke-width="2.6"/>
        <path data-emo="joie" d="M-12 0 Q0 15 12 0" ${TRAIT_DE_BOUCHE} stroke-width="2.8"/>
        <path data-emo="concentration" d="M-6 1 Q-2 -1 0 1 Q2 3 6 1" ${TRAIT_DE_BOUCHE} stroke-width="2.4"/>
        <ellipse data-emo="surprise" cy="4" rx="4.5" ry="5.5" fill="${CONTOUR}"/>
        <path data-emo="pleines" d="M-5 1 Q0 4 5 1" ${TRAIT_DE_BOUCHE} stroke-width="2.4"/>
        <path data-emo="croque" d="M-6 1 Q-3 4 0 1 Q3 4 6 1" ${TRAIT_DE_BOUCHE} stroke-width="2.4"/>`;

/** Noisette, ronde et potelée, toujours de face ou de trois-quarts : tout ce qui est dessiné une fois pour toutes (le moteur place ensuite chaque pièce). */
export const STRUCTURE_DE_NOISETTE = `
    <g id="animaux-queue"><path class="queue" fill="${FOURRURE}" stroke="${CONTOUR}" stroke-width="3.4" stroke-linejoin="round"/><path class="queue-ventre" fill="${VENTRE}"/><path class="queue-ombre" fill="none" stroke="${OMBRE}" stroke-width="4" stroke-linecap="round" opacity=".8"/><path class="queue-lumiere" fill="none" stroke="${LUMIERE}" stroke-width="3" stroke-linecap="round"/><path class="queue-meches" fill="none" stroke="${OMBRE}" stroke-width="1.4" stroke-linecap="round" opacity=".55"/></g>
    <g id="animaux-bras-arriere"></g>
    ${pied("g")}${pied("d")}
    <g>
      ${jambe(-1)}${jambe(1)}
      <ellipse cx="0" cy="-50" rx="36" ry="40" fill="${FOURRURE}" stroke="${CONTOUR}" stroke-width="3.6"/>
      <path d="M10 -14 A36 40 0 0 0 34 -62 A30 34 0 0 1 10 -14 Z" fill="${OMBRE}"/>
      <ellipse id="animaux-ventre" cx="-1" cy="-42" rx="24" ry="29" fill="${VENTRE}"/>
      <ellipse cx="-9" cy="-54" rx="8" ry="11" fill="${VENTRE_LUMIERE}" opacity=".6"/>
      <ellipse cx="-20" cy="-78" rx="9" ry="5" fill="${LUMIERE}" opacity=".8"/>
    </g>
    <g id="animaux-tete">
      ${oreille("g")}${oreille("d")}
      <circle r="44" fill="${FOURRURE}" stroke="${CONTOUR}" stroke-width="3.8"/>
      <path d="M12 42 A44 44 0 0 0 42 -12 A36 36 0 0 1 12 42 Z" fill="${OMBRE}"/>
      <path id="animaux-bande" d="M-16 -42 Q0 -50 16 -42 Q10 -30 0 -32 Q-10 -30 -16 -42 Z" fill="${BANDE}"/>
      <ellipse cx="-18" cy="-24" rx="11" ry="6" fill="${LUMIERE}" opacity=".85"/>
      ${joue("g")}${joue("d")}
      <g id="animaux-museau"><ellipse rx="19" ry="14" fill="${VENTRE}"/><ellipse cx="-5" cy="-5" rx="7" ry="3.5" fill="${VENTRE_LUMIERE}" opacity=".7"/></g>
      <g id="animaux-bouche">${BOUCHES}
      </g>
      <g id="animaux-dents"><path d="M-5.5 0 h11 v6 q0 3 -3 3 h-5 q-3 0 -3 -3 Z" fill="#FFFFFF" stroke="${CONTOUR}" stroke-width="1.8" stroke-linejoin="round"/><path d="M0 0 V8" stroke="${CONTOUR}" stroke-width="1.4"/></g>
      <g id="animaux-nez"><ellipse rx="6.5" ry="5" fill="${TRUFFE}" stroke="${CONTOUR}" stroke-width="2.2"/><ellipse cx="-2" cy="-1.6" rx="2.2" ry="1.3" fill="#FFFFFF" opacity=".75"/></g>
      ${oeil("g")}${oeil("d")}
      ${sourcil("g")}${sourcil("d")}
    </g>
    <g id="animaux-bras-avant"></g>`;
