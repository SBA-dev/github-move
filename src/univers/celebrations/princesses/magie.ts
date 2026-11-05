import { r1 } from "../commun/courbes.ts";
import { CONTOUR } from "./dessin-de-lumi.ts";

/** Les teintes des pétales de la fleur magique. */
export type Teinte = "or" | "blanc" | "rose" | "bleu" | "violet" | "vert" | "orange";

const COULEURS_DES_PETALES: Record<Teinte, string> = { or: "#FFB3D1", blanc: "#FFFFFF", rose: "#FF8FB8", bleu: "#9FD3FF", violet: "#C9A0F5", vert: "#9BE0A8", orange: "#FFC48A" };
const ETINCELLES_PALES = ["#FFE9A0", "#FFC9DE", "#FFFFFF"] as const;
const CENTRE_DE_LA_FLEUR = "#FFF3B0";

/** Le tracé d'une étincelle à quatre branches de rayon `r`, pour le dessin et pour la toile des étincelles qui tombent. */
export const traceDeLEtincelle = (r: number) => {
  const c = r1(r * .2);
  return `M0 ${-r} Q${c} ${-c} ${r} 0 Q${c} ${c} 0 ${r} Q${-c} ${c} ${-r} 0 Q${-c} ${-c} 0 ${-r} Z`;
};

/** La couleur d'une étincelle : or pâle, rose ou blanc selon son `rang`. */
export const couleurDeLEtincelle = (rang: number) => ETINCELLES_PALES[rang % ETINCELLES_PALES.length] ?? "#FFFFFF";

/** Le dessin d'une petite étincelle de rayon `rayon`, centrée en (0, 0). */
export const etincelle = (rayon: number, rang = 0) =>
  `<path d="${traceDeLEtincelle(rayon)}" fill="${couleurDeLEtincelle(rang)}" stroke="#C79BD9" stroke-width=".8" stroke-linejoin="round"/>`;

/** Le dessin d'une petite fleur de rayon `rayon` (cinq pétales ronds autour d'un coeur), centrée en (0, 0) : ce qui brille au bout de la baguette, sur la couronne et à la place des chiffres. */
export function fleurMagique(rayon: number, teinte: Teinte): string {
  const contour = Math.max(.8, r1(rayon * .12));
  const petales = [0, 1, 2, 3, 4].map((k) => {
    const a = k * 1.2566 - 1.5708;
    return `<circle cx="${r1(Math.cos(a) * rayon * .58)}" cy="${r1(Math.sin(a) * rayon * .58)}" r="${r1(rayon * .46)}" fill="${COULEURS_DES_PETALES[teinte]}" stroke="${CONTOUR}" stroke-width="${contour}"/>`;
  }).join("");
  return `${petales}<circle r="${r1(rayon * .32)}" fill="${CENTRE_DE_LA_FLEUR}" stroke="${CONTOUR}" stroke-width="${contour}"/>`;
}
