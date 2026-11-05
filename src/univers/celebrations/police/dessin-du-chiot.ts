import { CONTOUR } from "./dessin-de-max.ts";

const CHIEN = "#F6E6C8";
const CHIEN_OMBRE = "#E4CBA0";
const CHIEN_BRUN = "#C58B55";

const patte = (x: number, y: number, hauteur: number, couleur: string) =>
  `<g class="patte" transform="translate(${x} ${y})"><rect x="-3.5" y="0" width="7" height="${hauteur}" rx="3.5" fill="${couleur}" stroke="${CONTOUR}" stroke-width="2.2"/></g>`;

/** Le chiot de profil, au sol : la queue qui remue, la langue rose, un sourire. Joyeux et en bonne santé, il ne pleure jamais. */
export const CHIOT_DE_PROFIL = `<g class="corps-chiot">
      <g class="queue" transform="translate(-16 -20)"><path d="M0 0 Q-9 -4 -10 -16" fill="none" stroke="${CONTOUR}" stroke-width="9" stroke-linecap="round"/><path d="M0 0 Q-9 -4 -10 -16" fill="none" stroke="${CHIEN}" stroke-width="5" stroke-linecap="round"/><circle cx="-10" cy="-16" r="4" fill="${CHIEN_BRUN}" stroke="${CONTOUR}" stroke-width="2.2"/></g>
      <g class="pattes-arriere">${patte(-9, -10, 12, CHIEN)}${patte(-14, -9, 11, CHIEN_OMBRE)}</g>
      <g class="haunche" opacity="0"><circle cx="-11" cy="-8" r="8" fill="${CHIEN}" stroke="${CONTOUR}" stroke-width="2.4"/><path d="M-15 0 H-7" stroke="${CONTOUR}" stroke-width="2.2" stroke-linecap="round"/></g>
      <g class="pattes-avant">${patte(12, -9, 11, CHIEN_OMBRE)}${patte(7, -10, 12, CHIEN)}</g>
      <ellipse cx="-2" cy="-16" rx="17" ry="11" fill="${CHIEN}" stroke="${CONTOUR}" stroke-width="2.6"/>
      <path d="M-17 -19 Q-6 -31 10 -23 Q0 -18 -17 -19 Z" fill="${CHIEN_BRUN}"/>
      <path d="M-8 -8 Q0 -5 10 -9" fill="none" stroke="${CHIEN_OMBRE}" stroke-width="2" stroke-linecap="round"/>
      <g class="tete-chiot" transform="translate(14 -28)">
        <circle r="12.5" fill="${CHIEN}" stroke="${CONTOUR}" stroke-width="2.6"/>
        <circle cx="4" cy="-3" r="6" fill="${CHIEN_BRUN}"/>
        <path d="M-3 -12 Q-17 -10 -13 7 Q-5 7 -2 -5 Z" fill="${CHIEN_BRUN}" stroke="${CONTOUR}" stroke-width="2.4" stroke-linejoin="round"/>
        <ellipse cx="7" cy="3" rx="7.5" ry="5.5" fill="#FFF5E4" stroke="${CONTOUR}" stroke-width="2.2"/>
        <circle cx="12" cy="0" r="3.2" fill="${CONTOUR}"/><circle cx="11" cy="-1" r="1" fill="#FFFFFF"/>
        <g class="oeil-chiot"><circle cx="4" cy="-3" r="2.6" fill="${CONTOUR}"/><circle cx="3.2" cy="-3.8" r=".9" fill="#FFFFFF"/><circle cx="-4" cy="-2" r="2" fill="${CONTOUR}"/></g>
        <path d="M7 6 Q10 9 13 6" fill="none" stroke="${CONTOUR}" stroke-width="1.8" stroke-linecap="round"/>
        <ellipse class="langue" cx="10" cy="8" rx="2.4" ry="3" fill="#FF8FA8" stroke="${CONTOUR}" stroke-width="1.4" opacity="0"/>
      </g>
    </g>`;

/** Le chiot de face, dans les bras de Max. */
export const CHIOT_DE_FACE = `<g class="corps-chiot">
      <ellipse cy="2" rx="15" ry="10" fill="${CHIEN}" stroke="${CONTOUR}" stroke-width="2.6"/>
      <g fill="${CHIEN}" stroke="${CONTOUR}" stroke-width="2.2"><circle cx="-8" cy="8" r="4.5"/><circle cx="8" cy="8" r="4.5"/></g>
      <g transform="translate(0 -16)">
        <path d="M-9 -8 Q-22 -4 -17 14 Q-9 14 -7 2 Z" fill="${CHIEN_BRUN}" stroke="${CONTOUR}" stroke-width="2.4" stroke-linejoin="round"/>
        <path d="M9 -8 Q22 -4 17 14 Q9 14 7 2 Z" fill="${CHIEN_BRUN}" stroke="${CONTOUR}" stroke-width="2.4" stroke-linejoin="round"/>
        <circle r="13" fill="${CHIEN}" stroke="${CONTOUR}" stroke-width="2.6"/>
        <circle cx="5" cy="-3" r="6" fill="${CHIEN_BRUN}"/>
        <ellipse cy="5" rx="7" ry="5" fill="#FFF5E4" stroke="${CONTOUR}" stroke-width="2"/>
        <circle cy="2" r="3" fill="${CONTOUR}"/><circle cx="-1" cy="1" r=".9" fill="#FFFFFF"/>
        <circle cx="-5" cy="-3" r="2.6" fill="${CONTOUR}"/><circle cx="5" cy="-3" r="2.6" fill="${CONTOUR}"/><circle cx="-5.8" cy="-3.8" r=".9" fill="#FFFFFF"/><circle cx="4.2" cy="-3.8" r=".9" fill="#FFFFFF"/>
        <path d="M-3 7 Q0 10 3 7" fill="none" stroke="${CONTOUR}" stroke-width="1.8" stroke-linecap="round"/>
      </g>
    </g>`;
