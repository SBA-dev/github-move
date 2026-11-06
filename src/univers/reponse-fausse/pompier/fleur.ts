import { elementsDe } from "../../celebrations/commun/dom.ts";
import { dessinDeLaFleur } from "../../celebrations/pompiers/dessin-du-jardin.ts";
import { PREFIXE_DE_SAM, SOL_DU_CADRE, X_DE_LA_FLEUR } from "./reglages.ts";

const ROSE = "#FF7FB0";

/** Le bouton de fleur, rose, à droite de Sam, hors de portée du jet : il reste fermé, l'eau ne l'a pas atteint. Le dessin est celui de la fleur du parterre de la célébration. */
export function poserLaFleur(racine: SVGSVGElement) {
  const fleur = elementsDe(racine, PREFIXE_DE_SAM)("fleur");
  fleur.innerHTML = `<g transform="translate(${X_DE_LA_FLEUR} ${SOL_DU_CADRE + 2}) scale(1.1)">${dessinDeLaFleur({ x: 0, y: 0, c: ROSE }, 0)}</g>`;
  fleur.querySelector(".corolle")?.setAttribute("transform", "scale(.001)");
  fleur.querySelector(".fleur")?.setAttribute("transform", "");
  fleur.querySelector(".tete-fleur")?.setAttribute("transform", "translate(0 -23)");
}
