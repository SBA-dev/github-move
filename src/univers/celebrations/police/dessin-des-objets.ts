import { CONTOUR } from "./dessin-de-max.ts";

const OR = "#FFC93C";
const CASQUETTE_BLEUE = "#3450C8";
const CASQUETTE_LUMIERE = "#6484EA";

export const BUISSON_DESSINE = `<g stroke="${CONTOUR}" stroke-width="2.6" stroke-linejoin="round"><circle cx="-16" cy="-14" r="15" fill="#4CAF6B"/><circle cx="18" cy="-13" r="14" fill="#4CAF6B"/><circle cx="0" cy="-26" r="17" fill="#5BC37C"/><circle cx="0" cy="-6" r="16" fill="#3F9A5B"/></g><circle cx="-6" cy="-30" r="3.5" fill="#9EE5B3"/><circle cx="12" cy="-20" r="2.5" fill="#9EE5B3"/>`;

/** Une trace de patte, la piste que Max suit à la loupe. */
export const PATTE = `<ellipse rx="6" ry="7" transform="translate(0 4)"/><circle cx="-6" cy="-5" r="2.6"/><circle cx="-1.5" cy="-8" r="2.6"/><circle cx="3.5" cy="-7" r="2.6"/><circle cx="7.5" cy="-3" r="2.4"/>`;
export const PISTE: readonly (readonly [number, number])[] = [[140, 367], [158, 376], [176, 368], [194, 377], [212, 369], [232, 378], [252, 371], [270, 378], [288, 372], [306, 378]];

/** Les petites voitures de la rue : rouge, jaune, vert. Ce sont des voitures de tous les jours (ni bande, ni inscription, ni gyrophare). */
export const COULEURS_DES_VOITURES: readonly (readonly [string, string])[] = [["#E8604C", "#C24432"], ["#FFC93C", "#E0A72A"], ["#5BC37C", "#3F9A5B"]];

const ROUE_DE_VOITURE = (x: number) =>
  `<g class="roue" transform="translate(${x} 2)"><circle r="7"/><circle r="3" fill="#C8D2E6"/><path d="M-5 0 H5" stroke="#C8D2E6" stroke-width="1.6"/></g>`;

export const dessinDeLaVoiture = (couleur: string, fonce: string) =>
  `<g class="roues" fill="#2B2B3A" stroke="${CONTOUR}" stroke-width="2.4">${ROUE_DE_VOITURE(-19)}${ROUE_DE_VOITURE(19)}</g>
    <path d="M-32 2 V-10 Q-32 -15 -27 -15 H-20 Q-14 -28 0 -28 H12 Q22 -28 27 -15 Q32 -15 32 -10 V2 Q0 6 -32 2 Z" fill="${couleur}" stroke="${CONTOUR}" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="M8 -14 H28 Q32 -14 32 -10 V2 Q16 5 8 2 Z" fill="${fonce}"/>
    <g fill="#CFEBFF" stroke="${CONTOUR}" stroke-width="1.8"><path d="M-18 -15 Q-12 -24 -2 -24 V-15 Z"/><path d="M3 -24 H12 Q19 -24 23 -15 H3 Z"/></g>
    <circle cx="29" cy="-7" r="2.6" fill="#FFF3B0" stroke="${CONTOUR}" stroke-width="1.4"/><circle cx="-29" cy="-7" r="2.2" fill="#E8604C" stroke="${CONTOUR}" stroke-width="1.4"/>`;

const ROUE_DE_TROTTINETTE = `<circle r="9" fill="#2B2B3A" stroke="${CONTOUR}" stroke-width="2.6"/><circle r="4.5" fill="#C8D2E6" stroke="${CONTOUR}" stroke-width="1.4"/><g class="rayons-roue" stroke="${CONTOUR}" stroke-width="1.2"><path d="M-4 0 H4"/></g>`;

/** La trottinette (repère du personnage : hanches à l'origine, sol à 58). Le plateau est uni : l'écusson est déjà sur la casquette et la chemise. */
export const TROTTINETTE =
  `<g class="roue" transform="translate(-34 50)">${ROUE_DE_TROTTINETTE}</g><g class="roue" transform="translate(38 50)">${ROUE_DE_TROTTINETTE}</g>
    <path d="M-40 43 Q-34 37 -24 43" fill="none" stroke="${CONTOUR}" stroke-width="5" stroke-linecap="round"/><path d="M-40 43 Q-34 37 -24 43" fill="none" stroke="${CASQUETTE_BLEUE}" stroke-width="2.4" stroke-linecap="round"/>
    <path d="M-30 52 H26 Q32 52 32 55 Q32 58 26 58 H-30 Q-36 58 -36 55 Q-36 52 -30 52 Z" fill="${CASQUETTE_BLEUE}" stroke="${CONTOUR}" stroke-width="2.8" stroke-linejoin="round"/><path d="M-30 52 H26" stroke="${CASQUETTE_LUMIERE}" stroke-width="2" stroke-linecap="round"/>
    <path d="M30 52 L42 -14" fill="none" stroke="${CONTOUR}" stroke-width="8" stroke-linecap="round"/><path d="M30 52 L42 -14" fill="none" stroke="${CASQUETTE_BLEUE}" stroke-width="4.4" stroke-linecap="round"/>
    <path d="M38 50 L30 52" fill="none" stroke="${CONTOUR}" stroke-width="5" stroke-linecap="round"/>
    <path d="M30 -14 H60" fill="none" stroke="${CONTOUR}" stroke-width="6.5" stroke-linecap="round"/><path d="M30 -14 H60" fill="none" stroke="#C8D2E6" stroke-width="3.2" stroke-linecap="round"/>
    <g transform="translate(46 -7)"><circle r="3.6" fill="${OR}" stroke="${CONTOUR}" stroke-width="1.6"/></g>`;

export const GUIDON = { g: { x: 40, y: -14 }, d: { x: 56, y: -14 } } as const;
export const PLATEAU = { x: -6, y: 53 } as const;
