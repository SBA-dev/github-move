import { type CoteDeMain, dessinDesMains } from "../commun/mains.ts";
import type { PrefixeDeScene } from "../commun/dom.ts";
import { ligne } from "../commun/trait.ts";

export const CONTOUR = "#33304A";
const PEAU = "#e8b58c";
const PEAU_OMBRE = "#C9956E";
const PEAU_LUMIERE = "#F7D4B8";
const CHEVEUX = "#B8873E";
const CHEVEUX_OMBRE = "#8F6528";
const CHEVEUX_LUMIERE = "#DDB46A";
const JUSTAUCORPS = "#b55bd6";
const JUSTAUCORPS_OMBRE = "#8E3FB0";
const JUSTAUCORPS_LUMIERE = "#D08AE8";
const TUTU = "#F3C9F2";
const TUTU_OMBRE = "#D9A6DE";
const TUTU_ARRIERE = "#E6B5E8";
const COLLANT = "#FBEFF9";
const COLLANT_OMBRE = "#E2CCE0";
const CHAUSSON = "#F6B4CF";
const CHAUSSON_OMBRE = "#E08FB4";
export const RUBAN_ROSE = "#FF8FB8";

export const MAINS: Record<CoteDeMain, readonly string[]> = dessinDesMains({ contour: CONTOUR, peau: PEAU, peauOmbre: PEAU_OMBRE });

export const dessinDuBras = (c: "g" | "d", prefixe: PrefixeDeScene) =>
  `<g id="${prefixe}-bras-${c}">
      ${ligne("manche-contour", CONTOUR, 26)}${ligne("contour", CONTOUR, 20)}${ligne("rempli", PEAU, 13)}${ligne("ombre", PEAU_OMBRE, 5.5)}${ligne("lumiere", PEAU_LUMIERE, 3.2)}
      ${ligne("manche", JUSTAUCORPS, 20)}${ligne("manche-ombre", JUSTAUCORPS_OMBRE, 7)}${ligne("manche-bord", JUSTAUCORPS_OMBRE, 2.2)}
      <g id="${prefixe}-main-${c}"><g class="pose-main"></g></g></g>`;

const dessinDeLaJambe = (c: "g" | "d", prefixe: PrefixeDeScene) =>
  `<g id="${prefixe}-jambe-${c}">
      ${ligne("contour", CONTOUR, 20)}${ligne("rempli", COLLANT, 13)}${ligne("ombre", COLLANT_OMBRE, 5.5)}${ligne("lumiere", "#FFFFFF", 3)}
      ${ligne("chaussette", COLLANT, 13)}<path class="chaussette-bord" fill="none" stroke="${COLLANT}" stroke-width="13" stroke-linecap="butt"/><path class="chaussette-bord2" fill="none" stroke="${COLLANT}" stroke-width="13" stroke-linecap="butt"/>${ligne("chaussette-ombre", COLLANT_OMBRE, 4)}
      <g id="${prefixe}-chaussure-${c}">
        <ellipse class="contact" rx="11" ry="3" fill="#6B3A1E" opacity=".25"/>
        <g class="vue-face">
          <path fill="${CHAUSSON}" stroke="${CONTOUR}" stroke-width="2.8" stroke-linejoin="round" d="M-7 -6 Q-9 0 -9 5 Q-9 12 -3 13 Q0 13.5 3 13 Q9 12 9 5 Q9 0 7 -6 Q0 -8 -7 -6 Z"/>
          <path fill="${CHAUSSON_OMBRE}" d="M3 -5 Q7 0 7 6 Q7 11 3 13 Q5 8 4 4 Q4 -1 3 -5 Z"/>
          <g class="devant"><path fill="${PEAU}" stroke="${CONTOUR}" stroke-width="1.6" d="M-6 -6 Q0 -1 6 -6 Q0 -8 -6 -6 Z"/><path d="M-7 -4 L7 2 M7 -4 L-7 2" fill="none" stroke="${RUBAN_ROSE}" stroke-width="1.8" stroke-linecap="round"/><ellipse cx="-2" cy="8" rx="3" ry="1.3" fill="#FFFFFF" opacity=".8"/><path d="M-2.5 2 q2.5 -2 5 0 q-2.5 2 -5 0 Z" fill="${RUBAN_ROSE}" stroke="${CONTOUR}" stroke-width="1"/></g>
          <g class="talon"><path d="M-7 -3 Q0 -1 7 -3" fill="none" stroke="${CONTOUR}" stroke-width="1.2" opacity=".6"/><path d="M-7 -2 L7 4 M7 -2 L-7 4" fill="none" stroke="${RUBAN_ROSE}" stroke-width="1.8" stroke-linecap="round"/></g>
        </g>
        <g class="vue-profil">
          <path fill="${CHAUSSON}" stroke="${CONTOUR}" stroke-width="2.8" stroke-linejoin="round" d="M-11 -5 Q-13 1 -11 6 L-8 8 L17 8 Q23 7 22 3 Q20 -2 10 -4 Q3 -5 -2 -4 Q-7 -7 -11 -5 Z"/>
          <path fill="${CHAUSSON_OMBRE}" d="M-7 3 Q6 6 22 3 Q23 7 17 8 L-8 8 L-11 6 Z"/>
          <path fill="#FFE6F0" stroke="${CONTOUR}" stroke-width="1.1" d="M-11 6 L-8 8 L17 8 Q23 7 22 3.5 Q8 7 -11 6 Z"/>
          <path d="M-6 -4 L2 5 M0 -4 L-6 5" fill="none" stroke="${RUBAN_ROSE}" stroke-width="1.8" stroke-linecap="round"/>
          <path fill="#FFFFFF" opacity=".75" d="M11 -3 Q18 -1 21 2 Q16 1 10 0 Z"/>
        </g>
        <g class="vue-semelle">
          <path fill="#E9C9D8" stroke="${CONTOUR}" stroke-width="2.2" stroke-linejoin="round" d="M-8 -9 Q-12 0 -9 9 Q-4 14 3 14 Q10 14 12 7 Q13 -2 9 -9 Q0 -12 -8 -9 Z"/>
          <path fill="#F8E2EC" d="M-6 -5 Q-9 0 -7 7 Q-3 11 3 11 Q8 11 10 6 Q11 -1 8 -6 Q1 -9 -6 -5 Z"/>
        </g>
      </g></g>`;

const dessinDeLOeil = (c: "g" | "d", prefixe: PrefixeDeScene) =>
  `<g id="${prefixe}-oeil-${c}"><ellipse rx="7.4" ry="9.6" fill="#FFFFFF" stroke="${PEAU_OMBRE}" stroke-width="1"/>
              <g id="${prefixe}-regard-${c}"><circle cx=".5" cy="3" r="4.8" fill="#2F6B3C"/><circle cx=".5" cy="3" r="3.9" fill="#4E9A5B"/><circle cx=".5" cy="3" r="2.3" fill="#1B1530"/><circle cx="-1.4" cy=".6" r="1.8" fill="#FFFFFF"/><circle cx="2.5" cy="4.8" r=".9" fill="#FFFFFF"/></g>
              <g clip-path="url(#${prefixe}-clip-oeil)"><ellipse id="${prefixe}-paupiere-${c}" rx="10" ry="10.6" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="2.6"/></g>
              <path d="M-7 0 A7.4 9.6 0 0 1 7 0" fill="none" stroke="${CONTOUR}" stroke-width="2.8" stroke-linecap="round"/>
              <path d="M-4.5 8.8 Q0 10.6 4.5 8.8" fill="none" stroke="${CONTOUR}" stroke-width="1" stroke-linecap="round" opacity=".4"/>
              <path d="${c === "g" ? "M-6.6 -5.5 l-2.8 -2.2" : "M6.6 -5.5 l2.8 -2.2"}" fill="none" stroke="${CONTOUR}" stroke-width="2" stroke-linecap="round"/></g>`;

const dessinDuSourcil = (c: "g" | "d", prefixe: PrefixeDeScene) =>
  `<g id="${prefixe}-sourcil-${c}"><path d="M-7 0 Q0 -4 7 0" fill="none" stroke="${CHEVEUX_OMBRE}" stroke-width="3.6" stroke-linecap="round"/></g>`;

const queueDeCheval = `<path class="queue" fill="${CHEVEUX}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round"/><path class="queue-ombre" fill="none" stroke="${CHEVEUX_OMBRE}" stroke-width="3" stroke-linecap="round"/><path class="queue-lumiere" fill="none" stroke="${CHEVEUX_LUMIERE}" stroke-width="2.6" stroke-linecap="round"/><path class="queue-meches" fill="none" stroke="${CHEVEUX_OMBRE}" stroke-width="1.3" stroke-linecap="round" opacity=".75"/>
                <g class="chouchou"><ellipse rx="7" ry="5" fill="${RUBAN_ROSE}" stroke="${CONTOUR}" stroke-width="2.2"/><path d="M0 -1 l-6 -5 q-3 3 0 6 Z M0 -1 l6 -5 q3 3 0 6 Z" fill="${RUBAN_ROSE}" stroke="${CONTOUR}" stroke-width="1.6" stroke-linejoin="round"/><circle cy="-1" r="2" fill="#FFC9DE" stroke="${CONTOUR}" stroke-width="1.2"/></g>`;

const dessinDeLaBouche = (prefixe: PrefixeDeScene) => `
              <path data-emo="concentration" d="M-5 16 Q-2 14 0 16 Q2 18 5 16" fill="none" stroke="${CONTOUR}" stroke-width="2.4" stroke-linecap="round"/>
              <g data-emo="joie"><path d="M-11 11 Q0 27 11 11 Z" fill="#C9475A"/><g clip-path="url(#${prefixe}-clip-bouche)"><ellipse cy="25" rx="7.5" ry="5" fill="#FF8FA8"/><path d="M-11 10.5 Q0 18.5 11 10.5 Z" fill="#FFFFFF"/></g><path d="M-11 11 Q0 27 11 11 Z" fill="none" stroke="${CONTOUR}" stroke-width="1.8" stroke-linejoin="round"/></g>
              <path data-emo="sourire" d="M-8 14 Q0 22 8 14" fill="none" stroke="${CONTOUR}" stroke-width="2.4" stroke-linecap="round"/>`;

/**
 * Lili, articulée : le moteur place chaque pièce à chaque image.
 * Les identifiants portent `prefixe` (`danse`, `reponse-fausse-danse`) : deux dessins de Lili peuvent coexister dans la page.
 * Justaucorps violet à manches bouffantes, tutu rose court, collant opaque, chaussons de demi-pointes (maquette validée).
 */
export const structureDeLili = (prefixe: PrefixeDeScene) => `
    <g id="${prefixe}-arriere"></g>
    ${dessinDeLaJambe("g", prefixe)}${dessinDeLaJambe("d", prefixe)}
    <g id="${prefixe}-tutu"><path class="arriere" fill="${TUTU_ARRIERE}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round"/><path class="forme" fill="${TUTU}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round"/><path class="ombre" fill="${TUTU_OMBRE}"/><path class="bande" fill="none" stroke="${JUSTAUCORPS}" stroke-width="5" stroke-linecap="round"/></g>
    <g id="${prefixe}-haut">
      <g id="${prefixe}-torse"><path class="forme" fill="${JUSTAUCORPS}" stroke="${CONTOUR}" stroke-width="3.4" stroke-linejoin="round"/><path class="ombre" fill="${JUSTAUCORPS_OMBRE}"/><path class="lumiere" fill="${JUSTAUCORPS_LUMIERE}"/><path class="col" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></g>
      <g id="${prefixe}-queue-arriere"></g>
      <g id="${prefixe}-bras-arriere"></g>
      <g id="${prefixe}-cou"><path fill="${PEAU}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round" d="M-4.8 -52 V-40 Q0 -36.5 4.8 -40 V-52 Z"/><path d="M-4.8 -52 V-44 Q0 -42 4.8 -44 V-52 Z" fill="${PEAU_OMBRE}"/></g>
      <g id="${prefixe}-tete">
        <g id="${prefixe}-tete-forme">
          <circle r="28" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="4"/>
          <path id="${prefixe}-tete-ombre" fill="${PEAU_OMBRE}"/><path id="${prefixe}-nuque-ombre" fill="${PEAU_OMBRE}" opacity="0"/>
          <ellipse id="${prefixe}-tete-lumiere" cx="-9" cy="-16" rx="9" ry="5" fill="${PEAU_LUMIERE}" opacity=".8"/>
          <g id="${prefixe}-oreille-g"><circle r="4.6" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="2.6"/><circle r="1.7" fill="${PEAU_OMBRE}"/></g>
          <g id="${prefixe}-oreille-d"><circle r="4.6" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="2.6"/><circle r="1.7" fill="${PEAU_OMBRE}"/></g>
          <g id="${prefixe}-visage">
            <g id="${prefixe}-joue-g"><ellipse rx="5" ry="3.2" fill="#FF8FA8" opacity=".6"/></g><g id="${prefixe}-joue-d"><ellipse rx="5" ry="3.2" fill="#FF8FA8" opacity=".6"/></g>
            ${dessinDeLOeil("g", prefixe)}${dessinDeLOeil("d", prefixe)}
            <g id="${prefixe}-nez"><ellipse cy="2.8" rx="2.5" ry="1.9" fill="#E3A074"/><ellipse cx="-.8" cy="2.1" rx=".9" ry=".6" fill="#FFD9BC"/></g>
            <g id="${prefixe}-bouche"><g id="${prefixe}-bouches">${dessinDeLaBouche(prefixe)}
            </g></g>
          </g>
          <g id="${prefixe}-cheveux"><path id="${prefixe}-cheveux-forme" fill="${CHEVEUX}" stroke="${CONTOUR}" stroke-width="3.6" stroke-linejoin="round"/><path id="${prefixe}-cheveux-lumiere" fill="none" stroke="${CHEVEUX_LUMIERE}" stroke-width="3" stroke-linecap="round"/>
            <g id="${prefixe}-queue-avant">${queueDeCheval}</g></g>
          <g id="${prefixe}-sourcils">${dessinDuSourcil("g", prefixe)}${dessinDuSourcil("d", prefixe)}</g>
        </g>
      </g>
      <g id="${prefixe}-bras-avant"></g>
    </g>`;

/** Le dessin de la queue de cheval, en double : un exemplaire derrière la tête (Lili de face), un devant (Lili de dos) ; le moteur n'en montre qu'un. */
export const QUEUE_DE_CHEVAL = queueDeCheval;
