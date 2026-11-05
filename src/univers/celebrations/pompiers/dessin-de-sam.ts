import { type CoteDeMain, dessinDesMains } from "../commun/mains.ts";
import { ligne } from "../commun/trait.ts";

export const CONTOUR = "#33304A";
const PEAU = "#f3c9a5";
const PEAU_OMBRE = "#E2AE84";
const PEAU_LUMIERE = "#FFE6CF";
const CHEVEUX = "#a8461c";
const CHEVEUX_OMBRE = "#7E3212";
const CHEVEUX_LUMIERE = "#CC6A3C";
const VESTE = "#d23a2a";
const VESTE_OMBRE = "#A82818";
const VESTE_LUMIERE = "#EE6A58";
const PANTALON = "#26335F";
const PANTALON_OMBRE = "#192448";
const PANTALON_LUMIERE = "#3D4E85";
const BANDE = "#F5D33A";
const ARGENT = "#E9EEF3";
const CASQUE_JAUNE = "#F2C230";
const CASQUE_OMBRE = "#D49E17";
const CASQUE_LUMIERE = "#FFE27A";
const ECUSSON = "#C2341B";
const BOTTE = "#2B2B3A";
const CHAUSSURE_OMBRE = "#1B1B28";
export const OR = "#FFC93C";
const METAL = "#C8D2E6";
const METAL_OMBRE = "#8E9BBE";

/** Les mains de Sam à cinq doigts, nues. */
export const MAINS: Record<CoteDeMain, readonly string[]> = dessinDesMains({ contour: CONTOUR, peau: PEAU, peauOmbre: PEAU_OMBRE });

/**
 * La lance à eau, un tuyau souple et un embout argenté (repère de la lance : l'arrière à x = -9, l'embout vers +x, la pointe à x = 36).
 * Les trois repères `m-pointe`, `m-axe` et `m-arriere` servent au moteur pour placer le jet et le tuyau.
 */
export const LANCE =
  `<path d="M-9 0 H22" stroke="${CONTOUR}" stroke-width="9.5" stroke-linecap="round"/><path d="M-9 0 H22" stroke="${METAL}" stroke-width="6" stroke-linecap="round"/><path d="M-8 1.6 H21" stroke="${METAL_OMBRE}" stroke-width="1.8" stroke-linecap="round"/><path d="M-7 -1.6 H20" stroke="#FFFFFF" stroke-width="1.2" stroke-linecap="round" opacity=".8"/>
    <rect x="-11" y="-6" width="5" height="12" rx="2" fill="${OR}" stroke="${CONTOUR}" stroke-width="1.8"/>
    <rect x="6" y="-5.4" width="9" height="10.8" rx="3" fill="#4A4A5E" stroke="${CONTOUR}" stroke-width="1.8"/><path d="M8.5 -4 V4 M11 -4 V4 M13.5 -4 V4" stroke="#6E6E86" stroke-width="1"/>
    <path d="M21 -6 L35 -3.2 Q37 0 35 3.2 L21 6 Z" fill="${OR}" stroke="${CONTOUR}" stroke-width="2" stroke-linejoin="round"/><path d="M23 -3.6 L33 -1.8" stroke="#FFF1A8" stroke-width="1.4" stroke-linecap="round"/>
    <g class="m-pointe" transform="translate(37 0)"/><g class="m-axe"/><g class="m-arriere" transform="translate(-10 0)"/>`;

/** Le casque jaune de pompier (repère de la tête : rayon 40, réduit à 28 par le groupe de la tête) : un écusson rouge à goutte d'eau blanche, sans étoile. */
const CASQUE =
  `<path class="bord-arriere" d="M-52 -26 Q0 -44 52 -26 Q56 -19 46 -18 Q0 -32 -46 -18 Q-56 -19 -52 -26 Z" fill="${CASQUE_OMBRE}" stroke="${CONTOUR}" stroke-width="2.8" stroke-linejoin="round"/>
    <path d="M-42 -28 Q-45 -78 0 -82 Q45 -78 42 -28 Q0 -38 -42 -28 Z" fill="${CASQUE_JAUNE}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round"/>
    <path d="M16 -78 Q40 -68 40 -32 Q28 -36 16 -37 Z" fill="${CASQUE_OMBRE}"/>
    <path d="M-32 -54 Q-22 -72 -6 -74 Q-20 -66 -26 -50 Z" fill="${CASQUE_LUMIERE}"/>
    <path class="crete" d="M-5 -81 Q0 -87 5 -81 L5 -66 H-5 Z" fill="${CASQUE_LUMIERE}" stroke="${CONTOUR}" stroke-width="2.4" stroke-linejoin="round"/>
    <path class="visiere" d="M-47 -30 Q0 -44 47 -30 Q0 -22 -47 -30 Z" fill="${CASQUE_OMBRE}" stroke="${CONTOUR}" stroke-width="2.8" stroke-linejoin="round"/>
    <g class="ecusson"><path d="M-10 -66 H10 V-56 Q10 -47 0 -43 Q-10 -47 -10 -56 Z" fill="${ECUSSON}" stroke="${CONTOUR}" stroke-width="2.2" stroke-linejoin="round"/><path d="M0 -62 Q4.5 -55.5 4.5 -53 A4.5 4.5 0 0 1 -4.5 -53 Q-4.5 -55.5 0 -62 Z" fill="#FFFFFF"/></g>`;

/** Un bras : le trait de bras de Léo, la manche longue de la veste (bande réfléchissante jaune et argent), le poignet et la main nus. */
export const dessinDuBras = (c: "g" | "d") =>
  `<g id="pompier-bras-${c}">
      ${ligne("contour", CONTOUR, 20)}${ligne("rempli", PEAU, 13)}${ligne("ombre", PEAU_OMBRE, 5.5)}${ligne("lumiere", PEAU_LUMIERE, 3.2)}
      ${ligne("manche-contour", CONTOUR, 23)}${ligne("manche", VESTE, 17)}${ligne("manche-ombre", VESTE_OMBRE, 5)}
      <path class="bande" fill="none" stroke="${BANDE}" stroke-width="17" stroke-linecap="butt"/><path class="bande-argent" fill="none" stroke="${ARGENT}" stroke-width="17" stroke-linecap="butt"/>
      <path class="manche-bord" fill="none" stroke="${VESTE_OMBRE}" stroke-width="17" stroke-linecap="butt"/>
      <g id="pompier-main-${c}"><g class="pose-main"></g></g></g>`;

/** Une jambe : le trait de jambe de Léo, le pantalon bleu marine à bande jaune, la botte noire. */
const dessinDeLaJambe = (c: "g" | "d") =>
  `<g id="pompier-jambe-${c}">
      ${ligne("contour", CONTOUR, 23)}${ligne("rempli", PANTALON, 16)}${ligne("ombre", PANTALON_OMBRE, 5.5)}${ligne("lumiere", PANTALON_LUMIERE, 3)}
      <path class="bande" fill="none" stroke="${BANDE}" stroke-width="16.5" stroke-linecap="butt"/>
      <path class="botte" fill="none" stroke="${BOTTE}" stroke-width="17" stroke-linecap="round"/><path class="botte-bord" fill="none" stroke="#55556A" stroke-width="17" stroke-linecap="butt"/>
      <g id="pompier-chaussure-${c}">
        <g class="vue-face"><path fill="${BOTTE}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round" d="M-8 -8 Q-10 0 -10 5 Q-10 13 -3 14 Q0 15 3 14 Q10 13 10 5 Q10 0 8 -8 Q0 -10 -8 -8 Z"/><path fill="${CHAUSSURE_OMBRE}" d="M3 -7 Q8 0 8 5 Q8 11 3 14 Q6 9 5 4 Q4 -2 3 -7 Z"/><path d="M-8 9 Q0 13 8 9" fill="none" stroke="#8E8EA6" stroke-width="1.6" stroke-linecap="round" opacity=".9"/></g>
        <g class="vue-profil"><path fill="${BOTTE}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round" d="M-12 -7 Q-15 0 -13 7 Q-11 9 -6 9 H17 Q23 9 23 4 Q23 -1 15 -4 Q8 -7 2 -7 Q-6 -9 -12 -7 Z"/><path fill="${CHAUSSURE_OMBRE}" d="M-8 3 Q6 6 23 3 Q23 8 17 9 H-6 Q-12 9 -13 6 Z"/><path d="M-13 6 Q5 8 22 5" fill="none" stroke="#8E8EA6" stroke-width="1.6" stroke-linecap="round"/></g>
        <g class="vue-semelle"><path fill="#3A3A4A" stroke="${CONTOUR}" stroke-width="2.4" stroke-linejoin="round" d="M-9 -10 Q-13 0 -10 10 Q-4 15 3 15 Q11 15 13 8 Q14 -2 10 -10 Q0 -13 -9 -10 Z"/><path fill="#55556A" d="M-7 -6 Q-10 0 -8 8 Q-3 12 3 12 Q9 12 11 7 Q12 -1 9 -7 Q1 -10 -7 -6 Z"/></g>
      </g></g>`;

/** Les yeux de Léo, l'iris brun-vert. */
const dessinDeLOeil = (c: "g" | "d") =>
  `<g id="pompier-oeil-${c}"><ellipse rx="7.4" ry="9.6" fill="#FFFFFF" stroke="${PEAU_OMBRE}" stroke-width="1"/>
      <g id="pompier-regard-${c}"><circle cx=".5" cy="3" r="4.8" fill="#6F6A30"/><circle cx=".5" cy="3" r="2.5" fill="#1B1530"/><circle cx="-1.4" cy=".6" r="1.8" fill="#FFFFFF"/><circle cx="2.5" cy="4.8" r=".9" fill="#FFFFFF"/></g>
      <g clip-path="url(#pompier-clip-oeil)"><ellipse id="pompier-paupiere-${c}" rx="10" ry="10.6" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="2.6"/></g>
      <path d="M-7 0 A7.4 9.6 0 0 1 7 0" fill="none" stroke="${CONTOUR}" stroke-width="2.8" stroke-linecap="round"/>
      <path d="M-4.5 8.8 Q0 10.6 4.5 8.8" fill="none" stroke="${CONTOUR}" stroke-width="1" stroke-linecap="round" opacity=".4"/></g>`;

const dessinDuSourcil = (c: "g" | "d") =>
  `<g id="pompier-sourcil-${c}"><path d="M-8 0 Q0 -5 8 0" fill="none" stroke="${CHEVEUX_OMBRE}" stroke-width="4.2" stroke-linecap="round"/></g>`;

const dessinDeLaOreille = (c: "g" | "d") =>
  `<g id="pompier-oreille-${c}"><circle r="7.5" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="3.6"/><circle r="2.8" fill="${PEAU_OMBRE}"/></g>`;

const dessinDeLaJoue = (c: "g" | "d") => `<g id="pompier-joue-${c}"><ellipse rx="7" ry="4.5" fill="#FF8FA8" opacity=".5"/></g>`;

/** Capitaine Sam, articulé : le corps de Coach Léo, la tête, la tenue et les couleurs de Sam. Le moteur place chaque pièce à chaque image. */
export const STRUCTURE_DE_CAPITAINE_SAM = `
    ${dessinDeLaJambe("g")}${dessinDeLaJambe("d")}
    <g id="pompier-jambe-avant"></g>
    <g id="pompier-bassin"><path class="forme" fill="${PANTALON}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round"/><path class="ombre" fill="${PANTALON_OMBRE}"/><path class="pli" fill="none" stroke="${PANTALON_OMBRE}" stroke-width="2" stroke-linecap="round"/></g>
    <g id="pompier-haut">
      <g id="pompier-torse"><path class="forme" fill="${VESTE}" stroke="${CONTOUR}" stroke-width="3.4" stroke-linejoin="round"/><path class="ombre" fill="${VESTE_OMBRE}"/><path class="lumiere" fill="${VESTE_LUMIERE}"/>
        <path class="bande" fill="${BANDE}" stroke="${CONTOUR}" stroke-width="2" stroke-linejoin="round"/><path class="bande-argent" fill="none" stroke="${ARGENT}" stroke-width="2.2" stroke-linecap="round"/>
        <path class="fermeture" fill="none" stroke="${VESTE_OMBRE}" stroke-width="2" stroke-linecap="round"/><rect class="tirette" x="-1.8" y="-3" width="3.6" height="6" rx="1.2" fill="${METAL}" stroke="${CONTOUR}" stroke-width="1.2"/>
      </g>
      <g id="pompier-bras-arriere"></g>
      <g id="pompier-cou"><path fill="${PEAU}" stroke="${CONTOUR}" stroke-width="3" d="M-5.5 -52 V-38 H5.5 V-52 Z"/><path d="M-5.5 -52 V-44 Q0 -42 5.5 -44 V-52 Z" fill="${PEAU_OMBRE}"/></g>
      <path id="pompier-col" fill="${VESTE}" stroke="${CONTOUR}" stroke-width="2.4" stroke-linejoin="round"/>
      <g id="pompier-tete"><g id="pompier-tete-forme" transform="translate(0 -26) scale(.7)">
        <circle id="pompier-cheveux-fond" cx="0" cy="-6" r="41" fill="${CHEVEUX}"/>
        <circle r="40" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="4.6"/>
        <path d="M10 38 A40 40 0 0 0 38 -12 A33 33 0 0 1 10 38 Z" fill="${PEAU_OMBRE}"/>
        <ellipse cx="-16" cy="-20" rx="10" ry="5" fill="${PEAU_LUMIERE}" opacity=".9"/>
        ${dessinDeLaOreille("g")}${dessinDeLaOreille("d")}
        ${dessinDeLaJoue("g")}${dessinDeLaJoue("d")}
        <g id="pompier-bouche"><g id="pompier-bouches" transform="scale(1.3)">
          <path data-emo="sourire" d="M-8 0 Q0 8 8 0" fill="none" stroke="${CONTOUR}" stroke-width="2.4" stroke-linecap="round"/>
          <g data-emo="joie"><path d="M-11 0 Q0 20 11 0 Z" fill="#C9475A"/><g clip-path="url(#pompier-clip-bouche)" transform="translate(0 -11)"><ellipse cy="28" rx="7" ry="4.5" fill="#FF8FA8"/><path d="M-11 10.5 Q0 18 11 10.5 Z" fill="#FFFFFF"/></g><path d="M-11 0 Q0 20 11 0 Z" fill="none" stroke="${CONTOUR}" stroke-width="1.8" stroke-linejoin="round"/></g>
          <path data-emo="concentration" d="M-5 1 Q-2 -1 0 1 Q2 3 5 1" fill="none" stroke="${CONTOUR}" stroke-width="2.4" stroke-linecap="round"/>
          <ellipse data-emo="surprise" cy="4" rx="4.5" ry="6" fill="#C9475A" stroke="${CONTOUR}" stroke-width="1.8"/>
          <path data-emo="coin" d="M-6 1 Q0 5 8 -2" fill="none" stroke="${CONTOUR}" stroke-width="2.4" stroke-linecap="round"/>
          <path data-emo="hum" d="M-5 2 Q0 -1 5 2" fill="none" stroke="${CONTOUR}" stroke-width="2.4" stroke-linecap="round"/>
        </g></g>
        <g id="pompier-nez"><circle r="4.6" fill="#E9A77A" stroke="${CONTOUR}" stroke-width="2.6"/><circle cx="-1.2" cy="-1.2" r="1.3" fill="#FFD9BC"/></g>
        <g id="pompier-taches"><g fill="#D98A5E" opacity=".7"><circle cx="-24" cy="6" r="1.4"/><circle cx="-19" cy="9" r="1.2"/><circle cx="-26" cy="11" r="1.1"/><circle cx="24" cy="6" r="1.4"/><circle cx="19" cy="9" r="1.2"/><circle cx="26" cy="11" r="1.1"/></g></g>
        <g transform="scale(1.3)">${dessinDeLOeil("g")}${dessinDeLOeil("d")}</g>
        ${dessinDuSourcil("g")}${dessinDuSourcil("d")}
        <g id="pompier-cheveux"><path id="pompier-cheveux-forme" fill="${CHEVEUX}" stroke="${CONTOUR}" stroke-width="3.6" stroke-linejoin="round"/><path id="pompier-cheveux-lumiere" fill="none" stroke="${CHEVEUX_LUMIERE}" stroke-width="2.6" stroke-linecap="round"/></g>
        <path id="pompier-frange" fill="${CHEVEUX}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round"/>
        <g id="pompier-casque">${CASQUE}</g>
      </g></g>
      <g id="pompier-lance-tenue">${LANCE}</g>
      <g id="pompier-bras-avant"></g>
    </g>`;
