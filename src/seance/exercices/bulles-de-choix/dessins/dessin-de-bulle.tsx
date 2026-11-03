import type { ReactNode } from "react";

/** Le dessin des sources validées (docs/stories/126/planches/sources) est celui d'une bulle d'une ligne : 56 sur 156. */
export const HAUTEUR_DE_REFERENCE = 56;
export const LARGEUR_DE_REFERENCE = 156;

/** Ce que le décor d'un univers a besoin de savoir de la bulle qu'il habille. `p` préfixe les identifiants de dégradés. */
export type Mesures = {
  readonly largeur: number;
  readonly hauteur: number;
  /** Rapport entre la hauteur de la bulle et celle du dessin de référence : le décor des bouts grandit avec elle. */
  readonly echelle: number;
  readonly p: string;
};

/** Le dessin d'une bulle de choix dans un univers : un contour de capsule, plus un décor posé sur les bouts seulement. */
export type DessinDeBulle = {
  readonly fond: string;
  readonly trait: (p: string) => string;
  readonly degrades?: (p: string) => ReactNode;
  readonly decor: (mesures: Mesures) => ReactNode;
};

/** Le décor du bout gauche, dessiné dans les coordonnées de référence. */
export function BoutGauche({ mesures, children }: { readonly mesures: Mesures; readonly children: ReactNode }) {
  return <g transform={`scale(${mesures.echelle})`}>{children}</g>;
}

/** Le décor du bout droit, dessiné dans les coordonnées de référence (bord droit à 156) et recalé sur le bord droit de la bulle. */
export function BoutDroit({ mesures, children }: { readonly mesures: Mesures; readonly children: ReactNode }) {
  return <g transform={`translate(${mesures.largeur} 0) scale(${mesures.echelle}) translate(${-LARGEUR_DE_REFERENCE} 0)`}>{children}</g>;
}

/** Un petit élément (point, paillette) : sa place suit la bulle, sa taille ne change pas. Il se dessine autour de (0, 0). */
export function Fixe(
  { mesures, cote, x, y, children }: {
    readonly mesures: Mesures;
    readonly cote: "gauche" | "droit";
    readonly x: number;
    readonly y: number;
    readonly children: ReactNode;
  },
) {
  const { echelle, largeur } = mesures;
  const abscisse = cote === "gauche" ? x * echelle : largeur - (LARGEUR_DE_REFERENCE - x) * echelle;
  return <g transform={`translate(${abscisse} ${y * echelle})`}>{children}</g>;
}
