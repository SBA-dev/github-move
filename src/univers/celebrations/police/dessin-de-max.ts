import { type CoteDeMain, dessinDesMains } from "../commun/mains.ts";

export const CONTOUR = "#33304A";
const PEAU = "#f2cba5";
const PEAU_OMBRE = "#E3AE85";
const PEAU_LUMIERE = "#FFE9D2";
const CHEVEUX = "#4a2f1d";
const CHEVEUX_OMBRE = "#3A2314";
const CHEVEUX_LUMIERE = "#70492E";
const CHEMISE = "#4C78E8";
const CHEMISE_OMBRE = "#3450C8";
const CHEMISE_LUMIERE = "#86A5F2";
const PANTALON = "#253B9C";
const PANTALON_OMBRE = "#1B2C78";
const PANTALON_LUMIERE = "#3F56B8";
const CASQUETTE_BLEUE = "#3450C8";
const CASQUETTE_OMBRE = "#253B9C";
const CASQUETTE_LUMIERE = "#6484EA";
const VISIERE = "#2B2B3A";
const CHAUSSURE = "#2B2B3A";
const CHAUSSURE_OMBRE = "#1B1B28";
const OR = "#FFC93C";
const GANT = "#FFFFFF";
const GANT_OMBRE = "#D5DEEE";

export type CouleurDeMain = "peau" | "gant";

/** Les mains de Max à cinq doigts, nues ou dans un gant blanc (variante du chef d'orchestre). */
export const MAINS: Record<CouleurDeMain, Record<CoteDeMain, readonly string[]>> = {
  peau: dessinDesMains({ contour: CONTOUR, peau: PEAU, peauOmbre: PEAU_OMBRE }),
  gant: dessinDesMains({ contour: CONTOUR, peau: GANT, peauOmbre: GANT_OMBRE }),
};

const ligne = (classe: string, couleur: string, largeur: number) =>
  `<path class="${classe}" fill="none" stroke="${couleur}" stroke-width="${largeur}" stroke-linecap="round" stroke-linejoin="round"/>`;

/**
 * L'écusson de la police, bleu et blanc, sans étoile : celui de la tête du train de Police (#130) et de la boîte de Police (#131).
 * Dessiné à l'échelle 1 sur 80 de large, centré sur l'origine ; `echelle` le réduit à la casquette ou à la chemise.
 */
export const ecusson = (echelle: number) =>
  `<g transform="scale(${echelle}) translate(-144 -162)"><path d="M144 110 L184 122 V166 Q184 196 144 214 Q104 196 104 166 V122 Z" fill="#F3F6FF" stroke="#1F2F82" stroke-width="9" stroke-linejoin="round"/><path d="M144 126 L170 134 V164 Q170 184 144 198 Q118 184 118 164 V134 Z" fill="#3450C8"/></g>`;

const TIGE_DE_LA_LOUPE =
  `<line x1="0" y1="8" x2="0" y2="-16" stroke="${CONTOUR}" stroke-width="6.5" stroke-linecap="round"/><line x1="0" y1="8" x2="0" y2="-16" stroke="#A86E3A" stroke-width="3.4" stroke-linecap="round"/><circle cy="-27" r="13" fill="${OR}" stroke="${CONTOUR}" stroke-width="2.6"/><circle cy="-27" r="9" fill="url(#police-verre)" stroke="${CONTOUR}" stroke-width="1.6"/>`;

/** Accessoires tenus (repère de la main : doigts vers le haut). */
export const LOUPE = `<g transform="scale(1.1)">${TIGE_DE_LA_LOUPE}<path d="M-5 -32 Q-2 -35 2 -34" fill="none" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" opacity=".9"/></g>`;
export const LOUPE_AU_SOL = `<g transform="rotate(-70)">${TIGE_DE_LA_LOUPE}</g>`;
export const SIFFLET =
  `<g transform="translate(0 -12) rotate(-20) scale(1.1)"><rect x="-9" y="-4" width="16" height="8" rx="3" fill="#C8D2E6" stroke="${CONTOUR}" stroke-width="2.2"/><circle cx="-6" cy="4" r="5.5" fill="#C8D2E6" stroke="${CONTOUR}" stroke-width="2.2"/><circle cx="-6" cy="4" r="2" fill="#7E8CB0"/></g>`;

/** La casquette, dans le repère de la tête (rayon 40, réduit à 28 par le groupe de la tête) : l'écusson à la place de l'étoile. */
export const CASQUETTE =
  `<path d="M-40 -34 Q-42 -70 0 -74 Q42 -70 40 -34 Q0 -42 -40 -34 Z" fill="${CASQUETTE_BLEUE}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round"/><path d="M12 -70 Q36 -64 38 -36 Q24 -42 12 -42 Z" fill="${CASQUETTE_OMBRE}"/><path d="M-28 -56 Q-16 -66 -2 -66 Q-14 -62 -22 -52 Z" fill="${CASQUETTE_LUMIERE}"/><path class="visiere" d="M-43 -34 Q0 -46 43 -34 Q0 -18 -43 -34 Z" fill="${VISIERE}" stroke="${CONTOUR}" stroke-width="2.8" stroke-linejoin="round"/><path d="M-30 -33 Q0 -26 30 -33" fill="none" stroke="#5A5A70" stroke-width="1.6" stroke-linecap="round"/><g transform="translate(0 -54)">${ecusson(.2)}</g>`;

/** Le casque à jugulaire de la trottinette. */
export const CASQUE =
  `<path d="M-43 -30 Q-46 -74 0 -78 Q46 -74 43 -30 Q0 -40 -43 -30 Z" fill="${CASQUETTE_BLEUE}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round"/><path d="M14 -74 Q38 -66 40 -34 Q26 -40 14 -42 Z" fill="${CASQUETTE_OMBRE}"/><g fill="#FFFFFF" opacity=".9"><path d="M-24 -40 Q-22 -62 -8 -70 L-2 -68 Q-16 -58 -16 -40 Z"/><path d="M6 -70 Q20 -62 22 -40 L14 -40 Q14 -58 2 -68 Z"/></g><path d="M-30 -34 Q0 -44 30 -34 Q0 -24 -30 -34 Z" fill="${VISIERE}" stroke="${CONTOUR}" stroke-width="2.4" stroke-linejoin="round"/><g fill="none" stroke="${CONTOUR}" stroke-width="2.2" stroke-linecap="round"><path d="M-41 -18 L-27 26 M41 -18 L27 26"/></g><path d="M-27 26 Q0 36 27 26" fill="none" stroke="${CONTOUR}" stroke-width="2.4" stroke-linecap="round"/>`;

export const dessinDuBras = (c: "g" | "d") =>
  `<g id="police-bras-${c}">
      ${ligne("manche-contour", CONTOUR, 23)}${ligne("contour", CONTOUR, 20)}${ligne("rempli", PEAU, 13)}${ligne("ombre", PEAU_OMBRE, 5.5)}${ligne("lumiere", PEAU_LUMIERE, 3.2)}
      ${ligne("manche", CHEMISE, 17)}${ligne("manche-ombre", CHEMISE_OMBRE, 5)}${ligne("manche-bord", CHEMISE_OMBRE, 2)}
      <g id="police-main-${c}"><g class="pose-main"></g><g class="prop"></g></g></g>`;

/** Une jambe de pantalon bleu foncé (un tube par jambe), le revers au bas, une chaussure noire arrondie. */
const dessinDeLaJambe = (c: "g" | "d") =>
  `<g id="police-jambe-${c}">
      ${ligne("contour", CONTOUR, 23)}${ligne("rempli", PANTALON, 16)}${ligne("ombre", PANTALON_OMBRE, 5.5)}${ligne("lumiere", PANTALON_LUMIERE, 3)}
      <path class="revers" fill="none" stroke="${PANTALON_OMBRE}" stroke-width="16.5" stroke-linecap="butt"/>
      <g id="police-chaussure-${c}">
        <ellipse class="contact" rx="12" ry="3.5" fill="#253B9C" opacity=".25"/>
        <g class="vue-face"><path fill="${CHAUSSURE}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round" d="M-8 -8 Q-10 0 -10 5 Q-10 13 -3 14 Q0 15 3 14 Q10 13 10 5 Q10 0 8 -8 Q0 -10 -8 -8 Z"/><path fill="${CHAUSSURE_OMBRE}" d="M3 -7 Q8 0 8 5 Q8 11 3 14 Q6 9 5 4 Q4 -2 3 -7 Z"/><path d="M-8 9 Q0 13 8 9" fill="none" stroke="#C8D2E6" stroke-width="1.6" stroke-linecap="round" opacity=".9"/><path d="M-4 -4 Q0 -6 4 -4" fill="none" stroke="#5A5A70" stroke-width="1.6" stroke-linecap="round"/></g>
        <g class="vue-profil"><path fill="${CHAUSSURE}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round" d="M-12 -7 Q-15 0 -13 7 Q-11 9 -6 9 H17 Q23 9 23 4 Q23 -1 15 -4 Q8 -7 2 -7 Q-6 -9 -12 -7 Z"/><path fill="${CHAUSSURE_OMBRE}" d="M-8 3 Q6 6 23 3 Q23 8 17 9 H-6 Q-12 9 -13 6 Z"/><path d="M-13 6 Q5 8 22 5" fill="none" stroke="#C8D2E6" stroke-width="1.6" stroke-linecap="round"/><path d="M-4 -4 Q4 -6 12 -3" fill="none" stroke="#5A5A70" stroke-width="1.6" stroke-linecap="round"/></g>
        <g class="vue-semelle"><path fill="#3A3A4A" stroke="${CONTOUR}" stroke-width="2.4" stroke-linejoin="round" d="M-9 -10 Q-13 0 -10 10 Q-4 15 3 15 Q11 15 13 8 Q14 -2 10 -10 Q0 -13 -9 -10 Z"/><path fill="#55556A" d="M-7 -6 Q-10 0 -8 8 Q-3 12 3 12 Q9 12 11 7 Q12 -1 9 -7 Q1 -10 -7 -6 Z"/></g>
      </g></g>`;

const dessinDeLOeil = (c: "g" | "d") =>
  `<g id="police-oeil-${c}"><ellipse rx="7.4" ry="9.6" fill="#FFFFFF" stroke="${PEAU_OMBRE}" stroke-width="1"/>
      <g id="police-regard-${c}"><circle cx=".5" cy="3" r="4.8" fill="#6B4226"/><circle cx=".5" cy="3" r="2.5" fill="#1B1530"/><circle cx="-1.4" cy=".6" r="1.8" fill="#FFFFFF"/><circle cx="2.5" cy="4.8" r=".9" fill="#FFFFFF"/></g>
      <g clip-path="url(#police-clip-oeil)"><ellipse id="police-paupiere-${c}" rx="10" ry="10.6" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="2.6"/></g>
      <path d="M-7 0 A7.4 9.6 0 0 1 7 0" fill="none" stroke="${CONTOUR}" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M-4.5 8.8 Q0 10.6 4.5 8.8" fill="none" stroke="${CONTOUR}" stroke-width="1" stroke-linecap="round" opacity=".4"/></g>`;

const dessinDuSourcil = (c: "g" | "d") =>
  `<g id="police-sourcil-${c}"><path d="M-8 0 Q0 -5 8 0" fill="none" stroke="${CHEVEUX_OMBRE}" stroke-width="4.2" stroke-linecap="round"/></g>`;

const dessinDeLaOreille = (c: "g" | "d") =>
  `<g id="police-oreille-${c}"><circle r="7.5" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="3.6"/><circle r="2.8" fill="${PEAU_OMBRE}"/></g>`;

const LOUPE_A_LA_CEINTURE = `<g class="loupe-ceinture"><g transform="scale(.5) rotate(25)">${TIGE_DE_LA_LOUPE}</g></g>`;

/** Agent Max, articulé : le corps de Coach Léo, la tête, la tenue et les couleurs de Max. Le moteur place chaque pièce à chaque image. */
export const STRUCTURE_D_AGENT_MAX = `
    ${dessinDeLaJambe("g")}${dessinDeLaJambe("d")}
    <g id="police-trottinette" opacity="0"></g>
    <g id="police-jambe-avant"></g>
    <g id="police-bassin"><path class="forme" fill="${PANTALON}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round"/><path class="ombre" fill="${PANTALON_OMBRE}"/><path class="pli" fill="none" stroke="${PANTALON_OMBRE}" stroke-width="2" stroke-linecap="round"/></g>
    <g id="police-haut">
      <g id="police-torse"><path class="forme" fill="${CHEMISE}" stroke="${CONTOUR}" stroke-width="3.4" stroke-linejoin="round"/><path class="ombre" fill="${CHEMISE_OMBRE}"/><path class="lumiere" fill="${CHEMISE_LUMIERE}"/><path class="boutons" fill="none" stroke="${CHEMISE_OMBRE}" stroke-width="1.6" stroke-linecap="round" stroke-dasharray="1 6"/>
        <path class="ceinture" fill="#2B2B3A" stroke="${CONTOUR}" stroke-width="2.4" stroke-linejoin="round"/><rect class="boucle" x="-4" y="-3.2" width="8" height="6.4" rx="1.6" fill="${OR}" stroke="${CONTOUR}" stroke-width="1.5"/>
        ${LOUPE_A_LA_CEINTURE}
        <path class="col" fill="${CHEMISE}" stroke="${CONTOUR}" stroke-width="2.4" stroke-linejoin="round"/>
        <g class="poche"><rect x="-6.5" y="-4.5" width="13" height="10" rx="1.6" fill="${CHEMISE_OMBRE}" stroke="${CONTOUR}" stroke-width="1.6"/><rect x="-4.5" y="-8" width="8" height="6.5" rx="1.2" fill="#FFF7E0" stroke="${CONTOUR}" stroke-width="1.4"/><path d="M-2.5 -6.2 H2 M-2.5 -4.4 H1.2 M-2.5 -2.6 H2" stroke="#8E9BBE" stroke-width=".9" stroke-linecap="round"/></g>
        <g class="insigne">${ecusson(.13)}</g>
      </g>
      <g id="police-bras-arriere"></g>
      <g id="police-cou"><path fill="${PEAU}" stroke="${CONTOUR}" stroke-width="3" d="M-5.5 -52 V-38 H5.5 V-52 Z"/><path d="M-5.5 -52 V-44 Q0 -42 5.5 -44 V-52 Z" fill="${PEAU_OMBRE}"/></g>
      <g id="police-tete"><g id="police-tete-forme" transform="translate(0 -26) scale(.7)">
        <circle id="police-cheveux-fond" cx="0" cy="-6" r="41" fill="${CHEVEUX}"/>
        <circle r="40" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="4.6"/>
        <path d="M10 38 A40 40 0 0 0 38 -12 A33 33 0 0 1 10 38 Z" fill="${PEAU_OMBRE}"/>
        <ellipse cx="-16" cy="-22" rx="10" ry="5" fill="${PEAU_LUMIERE}" opacity=".9"/>
        ${dessinDeLaOreille("g")}${dessinDeLaOreille("d")}
        <g id="police-joue-g"><ellipse rx="7" ry="4.5" fill="#FF8FA8" opacity=".5"/></g><g id="police-joue-d"><ellipse rx="7" ry="4.5" fill="#FF8FA8" opacity=".5"/></g>
        <g id="police-bouche"><g id="police-bouches" transform="scale(1.3)">
          <path data-emo="sourire" d="M-8 0 Q0 8 8 0" fill="none" stroke="${CONTOUR}" stroke-width="2.4" stroke-linecap="round"/>
          <g data-emo="joie"><path d="M-11 0 Q0 20 11 0 Z" fill="#C9475A"/><g clip-path="url(#police-clip-bouche)" transform="translate(0 -11)"><ellipse cy="28" rx="7" ry="4.5" fill="#FF8FA8"/><path d="M-11 10.5 Q0 18 11 10.5 Z" fill="#FFFFFF"/></g><path d="M-11 0 Q0 20 11 0 Z" fill="none" stroke="${CONTOUR}" stroke-width="1.8" stroke-linejoin="round"/></g>
          <path data-emo="concentration" d="M-5 1 Q-2 -1 0 1 Q2 3 5 1" fill="none" stroke="${CONTOUR}" stroke-width="2.4" stroke-linecap="round"/>
          <ellipse data-emo="surprise" cy="4" rx="4.5" ry="6" fill="#C9475A" stroke="${CONTOUR}" stroke-width="1.8"/>
          <path data-emo="hum" d="M-5 2 Q0 -1 5 2" fill="none" stroke="${CONTOUR}" stroke-width="2.4" stroke-linecap="round"/>
        </g></g>
        <g id="police-nez"><circle r="4.6" fill="#E9A77A" stroke="${CONTOUR}" stroke-width="2.6"/><circle cx="-1.2" cy="-1.2" r="1.3" fill="#FFD9BC"/></g>
        <g transform="scale(1.3)">${dessinDeLOeil("g")}${dessinDeLOeil("d")}</g>
        ${dessinDuSourcil("g")}${dessinDuSourcil("d")}
        <g id="police-cheveux"><path id="police-cheveux-forme" fill="${CHEVEUX}" stroke="${CONTOUR}" stroke-width="3.6" stroke-linejoin="round"/><path id="police-cheveux-meche" fill="${CHEVEUX_LUMIERE}"/><path id="police-cheveux-lumiere" fill="none" stroke="${CHEVEUX_LUMIERE}" stroke-width="2.6" stroke-linecap="round"/></g>
        <g id="police-casquette">${CASQUETTE}</g>
        <g id="police-casque" opacity="0">${CASQUE}</g>
      </g></g>
      <g id="police-chiot-bras"></g>
      <g id="police-bras-avant"></g>
    </g>`;
