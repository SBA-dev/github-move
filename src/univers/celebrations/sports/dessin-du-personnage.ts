import { DEG, r1 } from "./courbes.ts";

export const CONTOUR = "#33304A";
const PEAU = "#f1c39a";
const PEAU_OMBRE = "#D9A67A";
const PEAU_LUMIERE = "#FFE3C8";
const CHEVEUX = "#5a3a22";
const CHEVEUX_OMBRE = "#43291A";
const CHEVEUX_LUMIERE = "#8A5E3B";
const TENUE = "#2a63d4";
const TENUE_OMBRE = "#1F4CB0";
const TENUE_LUMIERE = "#5A8BE8";
const SHORT = "#FFFFFF";
const SHORT_OMBRE = "#D9E3F2";
const CHAUSSURE = "#E8604C";
const CHAUSSURE_OMBRE = "#C24432";

export type PoseDeMain = 0 | 1 | 2 | 3;
export type CoteDeMain = "droit" | "miroir";

const ligne = (classe: string, couleur: string, largeur: number) =>
  `<path class="${classe}" fill="none" stroke="${couleur}" stroke-width="${largeur}" stroke-linecap="round" stroke-linejoin="round"/>`;

/** Un doigt effilé et légèrement courbe, de la base (x, y0) dans la direction a (0 = vers le haut), longueur L. */
function doigtForme(x: number, y0: number, a: number, L: number, b = 2.7, tp = 1.9): string {
  const dx = Math.sin(a * DEG), dy = -Math.cos(a * DEG), nx = -dy, ny = dx;
  const tx = x + dx * L, ty = y0 + dy * L, mx = (x + tx) / 2 + nx * .7, my = (y0 + ty) / 2 + ny * .7, mw = (b + tp) / 2;
  return `M${r1(x + nx * b)} ${r1(y0 + ny * b)} Q${r1(mx + nx * mw)} ${r1(my + ny * mw)} ${r1(tx + nx * tp)} ${r1(ty + ny * tp)} A${tp} ${tp} 0 0 0 ${r1(tx - nx * tp)} ${r1(ty - ny * tp)} Q${r1(mx - nx * mw)} ${r1(my - ny * mw)} ${r1(x - nx * b)} ${r1(y0 - ny * b)} Z`;
}

const trait = (d: string, w: number) => `<path d="${d}" fill="none" stroke="${CONTOUR}" stroke-width="${w}" stroke-linejoin="round"/>`;

/** Une main à cinq doigts : détendue (0), poing (1), pouce levé (2) ou doigts écartés (3). */
function main(pose: PoseDeMain, cote: CoteDeMain): string {
  const m = cote === "miroir" ? -1 : 1, doigts = [-6.3, -2.1, 2.1, 6.3], angles = pose === 3 ? [-26, -9, 9, 26] : [-9, -3, 3, 9];
  const paume = `M-8 9 V-3 Q-8 -8 -3 -8 H3 Q8 -8 8 -3 V9 Q0 12 -8 9 Z`;
  const paumePoing = `M-8 8 V-2 Q-8 -9 0 -9 Q8 -9 8 -2 V8 Q0 12 -8 8 Z`;
  let contours = "", remplissages = "";
  if (pose === 0 || pose === 3) {
    const formes = doigts.map((x, i) => doigtForme(x, -6, (angles[i] ?? 0) * m, 10.5 - Math.abs(i - 1.5) * .8));
    const pouce = doigtForme(-7 * m, 0, -52 * m, 9, 2.6, 1.9);
    formes.concat(pouce).forEach((d) => (contours += trait(d, 5.2)));
    remplissages += formes.concat(pouce).map((d) => `<path d="${d}" fill="${PEAU}"/>`).join("");
    remplissages += doigts.map((x, i) => {
      const a = (angles[i] ?? 0) * m * DEG;
      return `<path d="M${r1(x + Math.sin(a) * 3)} ${r1(-6 - Math.cos(a) * 3)} l${r1(Math.sin(a) * 4)} ${r1(-Math.cos(a) * 4)}" fill="none" stroke="${PEAU_OMBRE}" stroke-width="1.2" stroke-linecap="round" opacity=".7"/>`;
    }).join("");
    return `${contours}${trait(paume, 5.6)}<path d="${paume}" fill="${PEAU}"/>${remplissages}<path d="M3 8 Q7 4 7 -1" fill="none" stroke="${PEAU_OMBRE}" stroke-width="2.2" stroke-linecap="round"/>`;
  }
  const pouce = pose === 2 ? doigtForme(-5 * m, -4, -10 * m, 13, 2.8, 2.1) : null;
  if (pouce) contours += trait(pouce, 5.4);
  doigts.forEach((x) => { contours += `<circle cx="${x}" cy="-8" r="5.4" fill="${CONTOUR}"/>`; });
  let dessus = doigts.map((x) => `<circle cx="${x}" cy="-8" r="3.6" fill="${PEAU}"/>`).join("") + `<rect x="-8" y="-8" width="16" height="6" fill="${PEAU}"/>`;
  dessus += doigts.map((x) => `<path d="M${x - 2.2} -6.5 q2.2 -1.8 4.4 0" fill="none" stroke="${PEAU_OMBRE}" stroke-width="1.4" stroke-linecap="round"/>`).join("");
  if (pouce) dessus += `<path d="${pouce}" fill="${PEAU}"/><path d="M${r1(-6 * m)} -3 l${r1(-1.5 * m)} -6" fill="none" stroke="${PEAU_OMBRE}" stroke-width="1.6" stroke-linecap="round"/>`;
  else dessus += `<path d="M${-7 * m} 2 q${r1(5 * m)} 3 ${r1(10 * m)} 1" fill="none" stroke="${PEAU_OMBRE}" stroke-width="1.8" stroke-linecap="round"/>`;
  return `${contours}${trait(paumePoing, 5.6)}<path d="${paumePoing}" fill="${PEAU}"/>${dessus}<path d="M3 7 Q7 3 7 -2" fill="none" stroke="${PEAU_OMBRE}" stroke-width="2.2" stroke-linecap="round"/>`;
}

const POSES_DE_MAIN: readonly PoseDeMain[] = [0, 1, 2, 3];
export const MAINS: Record<CoteDeMain, readonly string[]> = {
  droit: POSES_DE_MAIN.map((p) => main(p, "droit")),
  miroir: POSES_DE_MAIN.map((p) => main(p, "miroir")),
};

export const dessinDuBras = (c: "g" | "d") =>
  `<g id="sports-bras-${c}">
      ${ligne("manche-contour", CONTOUR, 26)}${ligne("contour", CONTOUR, 20)}${ligne("rempli", PEAU, 13)}${ligne("ombre", PEAU_OMBRE, 5.5)}${ligne("lumiere", PEAU_LUMIERE, 3.2)}
      ${ligne("manche", TENUE, 20)}${ligne("manche-ombre", TENUE_OMBRE, 7)}${ligne("manche-bord", TENUE_OMBRE, 2.2)}
      <g id="sports-main-${c}"><g class="pose-main"></g></g></g>`;

const dessinDeLaJambe = (c: "g" | "d") =>
  `<g id="sports-jambe-${c}">
      ${ligne("contour", CONTOUR, 21)}${ligne("rempli", PEAU, 14)}${ligne("ombre", PEAU_OMBRE, 6)}${ligne("lumiere", PEAU_LUMIERE, 3.4)}
      ${ligne("chaussette", "#FFFFFF", 14.5)}<path class="chaussette-bord" fill="none" stroke="${TENUE}" stroke-width="14.6" stroke-linecap="butt"/><path class="chaussette-bord2" fill="none" stroke="${TENUE}" stroke-width="14.6" stroke-linecap="butt"/>${ligne("chaussette-ombre", SHORT_OMBRE, 4)}
      <g id="sports-chaussure-${c}">
        <ellipse class="contact" rx="13" ry="3.5" fill="#15502B" opacity=".25"/>
        <g class="vue-face">
          <path fill="${CHAUSSURE}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round" d="M-7 -10 Q-9 -3 -10 4 Q-11 12 -4 15 Q0 16 4 15 Q11 12 10 4 Q9 -3 7 -10 Q0 -12 -7 -10 Z"/>
          <path fill="${CHAUSSURE_OMBRE}" d="M3 -8 Q8 0 9 6 Q9 12 4 15 Q7 10 6 4 Q5 -2 3 -8 Z"/>
          <g class="devant">
            <path fill="#FF8A74" d="M-9 6 Q-9 13 -4 15 Q0 16 4 15 Q9 13 9 6 Q0 9 -9 6 Z"/>
            <ellipse cx="-2.5" cy="10" rx="3" ry="1.4" fill="#FFFFFF" opacity=".9"/>
            <path fill="${CHAUSSURE_OMBRE}" stroke="${CONTOUR}" stroke-width="1.8" stroke-linejoin="round" d="M-5 -10 Q0 -13 5 -10 L4 -4 Q0 -3 -4 -4 Z"/>
            <g fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round"><path d="M-3.2 -5 L3.2 -5 M-3.5 -2 L3.5 -2 M-3.8 1 L3.8 1 M-4 4 L4 4"/></g>
            <g fill="none" stroke="#FFFFFF" stroke-width="1.3" stroke-linecap="round"><path d="M-9.5 -1 L-7.5 0 M-9.8 2 L-7.8 3 M-10 5 L-8 6 M9.5 -1 L7.5 0 M9.8 2 L7.8 3 M10 5 L8 6"/></g>
          </g>
          <g class="talon"><path fill="none" stroke="${CONTOUR}" stroke-width="1.3" stroke-linecap="round" opacity=".6" d="M-7 -4 Q0 -2 7 -4"/><path fill="none" stroke="#FFFFFF" stroke-width="1.4" stroke-linecap="round" d="M-9 2 L-7 3 M-9.5 5 L-7.5 6 M9 2 L7 3 M9.5 5 L7.5 6"/></g>
          <path fill="none" stroke="#FFFFFF" stroke-width="1.6" stroke-linecap="round" opacity=".9" d="M-9 11 Q0 15.5 9 11"/>
        </g>
        <g class="vue-profil">
          <path fill="${CHAUSSURE}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round" d="M-13 -8 Q-16 0 -14 7 L-10 9 L18 9 Q25 8 24 3 Q22 -3 12 -6 Q4 -8 -2 -7 Q-8 -10 -13 -8 Z"/>
          <path fill="${CHAUSSURE_OMBRE}" d="M-8 3 Q6 6 24 3 Q25 8 18 9 L-10 9 L-14 7 Z"/>
          <path fill="#E6EAF0" stroke="${CONTOUR}" stroke-width="1.3" d="M-14 7 L-10 9 L18 9 Q25 8 24 3.5 Q10 8 -14 7 Z"/>
          <path fill="#FFFFFF" opacity=".75" d="M13 -5 Q20 -3 23 2 Q18 0 12 -2 Z"/>
          <g fill="none" stroke="#FFFFFF" stroke-width="1.7" stroke-linecap="round"><path d="M-4 -5 L-6 5 M1 -4.5 L-1 5 M6 -4 L4 5"/></g>
          <path fill="none" stroke="${CONTOUR}" stroke-width="1.2" stroke-linecap="round" d="M-13 -7 Q-7 -4 -1 -6" opacity=".6"/>
        </g>
        <g class="vue-semelle">
          <path fill="#3A3A4A" stroke="${CONTOUR}" stroke-width="2.4" stroke-linejoin="round" d="M-9 -10 Q-13 0 -10 10 Q-4 15 3 15 Q11 15 13 8 Q14 -2 10 -10 Q0 -13 -9 -10 Z"/>
          <path fill="#55556A" d="M-7 -6 Q-10 0 -8 8 Q-3 12 3 12 Q9 12 11 7 Q12 -1 9 -7 Q1 -10 -7 -6 Z"/>
          <g fill="#E6EAF0" stroke="${CONTOUR}" stroke-width="1.1">${[[-5, -5], [5, -5], [-4, 1], [5, 1], [-3, 8], [4, 8]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.1"/>`).join("")}</g>
        </g>
      </g></g>`;

const dessinDeLOeil = (c: "g" | "d") =>
  `<g id="sports-oeil-${c}"><ellipse rx="7.4" ry="9.6" fill="#FFFFFF" stroke="${PEAU_OMBRE}" stroke-width="1"/>
              <g id="sports-regard-${c}"><circle cx=".5" cy="3" r="4.8" fill="#6B4226"/><circle cx=".5" cy="3" r="2.5" fill="#1B1530"/><circle cx="-1.4" cy=".6" r="1.8" fill="#FFFFFF"/><circle cx="2.5" cy="4.8" r=".9" fill="#FFFFFF"/></g>
              <g clip-path="url(#sports-clip-oeil)"><ellipse id="sports-paupiere-${c}" rx="10" ry="10.6" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="2.6"/></g>
              <path d="M-7 0 A7.4 9.6 0 0 1 7 0" fill="none" stroke="${CONTOUR}" stroke-width="2.8" stroke-linecap="round"/>
              <path d="M-4.5 8.8 Q0 10.6 4.5 8.8" fill="none" stroke="${CONTOUR}" stroke-width="1" stroke-linecap="round" opacity=".4"/></g>`;

const dessinDuSourcil = (c: "g" | "d") =>
  `<g id="sports-sourcil-${c}"><path d="M-7 0 Q0 -4 7 0" fill="none" stroke="${CHEVEUX_OMBRE}" stroke-width="3.6" stroke-linecap="round"/></g>`;

const mecheDeCheveux = (id: string, epaisseur: number) =>
  `<path id="sports-${id}" fill="${CHEVEUX}" stroke="${CONTOUR}" stroke-width="${epaisseur}" stroke-linejoin="round"/>`;

/** Coach Léo, articulé : le moteur place chaque pièce à chaque image. */
export const STRUCTURE_DE_COACH_LEO = `
    <g id="sports-arriere"></g>
    ${dessinDeLaJambe("g")}${dessinDeLaJambe("d")}
    <g id="sports-short"><path class="forme" fill="${SHORT}" stroke="${CONTOUR}" stroke-width="3" stroke-linejoin="round"/><path class="ombre" fill="${SHORT_OMBRE}"/><path class="bande" fill="none" stroke="${TENUE}" stroke-width="2.4" stroke-linecap="round"/></g>
    <g id="sports-haut">
      <g id="sports-torse"><path class="forme" fill="${TENUE}" stroke="${CONTOUR}" stroke-width="3.4" stroke-linejoin="round"/><path class="ombre" fill="${TENUE_OMBRE}"/><path class="lumiere" fill="${TENUE_LUMIERE}"/><path class="col" fill="none" stroke="#FFFFFF" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/><g class="badge"><circle r="6" fill="#FFFFFF" stroke="${CONTOUR}" stroke-width="1.8"/><circle r="2.6" fill="${CHAUSSURE}"/></g></g>
      <g id="sports-bras-arriere"></g>
      <g id="sports-cou"><path fill="${PEAU}" stroke="${CONTOUR}" stroke-width="3" d="M-5.5 -52 V-38 H5.5 V-52 Z"/><path d="M-5.5 -52 V-44 Q0 -42 5.5 -44 V-52 Z" fill="${PEAU_OMBRE}"/></g>
      <g id="sports-tete">
        <g id="sports-tete-forme">
          <circle r="28" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="4"/>
          <path id="sports-tete-ombre" fill="${PEAU_OMBRE}"/><path id="sports-nuque-ombre" fill="${PEAU_OMBRE}" opacity="0"/>
          <ellipse id="sports-tete-lumiere" cx="-9" cy="-16" rx="9" ry="5" fill="${PEAU_LUMIERE}" opacity=".8"/>
          <g id="sports-oreille-g"><circle r="6" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="3"/><circle r="2.2" fill="${PEAU_OMBRE}"/></g>
          <g id="sports-oreille-d"><circle r="6" fill="${PEAU}" stroke="${CONTOUR}" stroke-width="3"/><circle r="2.2" fill="${PEAU_OMBRE}"/></g>
          <g id="sports-visage">
            <g id="sports-joue-g"><ellipse rx="5" ry="3.2" fill="#FF8FA8" opacity=".6"/></g><g id="sports-joue-d"><ellipse rx="5" ry="3.2" fill="#FF8FA8" opacity=".6"/></g>
            ${dessinDeLOeil("g")}${dessinDeLOeil("d")}
            <g id="sports-nez"><circle r="3.6" fill="#E9A77A" stroke="${CONTOUR}" stroke-width="2.2"/><circle cx="-1" cy="-1" r="1" fill="#FFD9BC"/></g>
            <g id="sports-bouche"><g id="sports-bouches">
              <path data-emo="concentration" d="M-5 16 Q-2 14 0 16 Q2 18 5 16" fill="none" stroke="${CONTOUR}" stroke-width="2.4" stroke-linecap="round"/>
              <ellipse data-emo="surprise" cy="18" rx="4.5" ry="6" fill="#C9475A" stroke="${CONTOUR}" stroke-width="1.8"/>
              <g data-emo="joie"><path d="M-11 11 Q0 27 11 11 Z" fill="#C9475A"/><g clip-path="url(#sports-clip-bouche)"><ellipse cy="25" rx="7.5" ry="5" fill="#FF8FA8"/><path d="M-11 10.5 Q0 18.5 11 10.5 Z" fill="#FFFFFF"/></g><path d="M-11 11 Q0 27 11 11 Z" fill="none" stroke="${CONTOUR}" stroke-width="1.8" stroke-linejoin="round"/></g>
            </g></g>
          </g>
          <g id="sports-cheveux"><path id="sports-cheveux-forme" fill="${CHEVEUX}" stroke="${CONTOUR}" stroke-width="3.6" stroke-linejoin="round"/><path id="sports-cheveux-lumiere" fill="none" stroke="${CHEVEUX_LUMIERE}" stroke-width="3" stroke-linecap="round"/>
            <g id="sports-meches">${mecheDeCheveux("meche-1", 3.2)}${mecheDeCheveux("meche-2", 3.2)}${mecheDeCheveux("meche-3", 3.2)}${mecheDeCheveux("epi", 3)}</g></g>
          <g id="sports-sourcils">${dessinDuSourcil("g")}${dessinDuSourcil("d")}</g>
        </g>
      </g>
      <g id="sports-bras-avant"></g>
    </g>`;
