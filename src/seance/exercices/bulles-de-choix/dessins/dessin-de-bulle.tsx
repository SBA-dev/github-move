import type { ReactNode } from "react";

/** Le dessin des sources validées (docs/stories/126/planches/sources) est celui d'une bulle d'une ligne : 56 sur 156. */
export const HAUTEUR_DE_REFERENCE = 56;
export const LARGEUR_DE_REFERENCE = 156;

/**
 * Le décor des bouts grandit avec la bulle, mais jamais au-delà de cette échelle : il doit tenir dans la zone des bouts
 * (`--zone-des-bouts`, 46 px, dans `styles.css`), où le texte n'entre pas. Le point le plus avancé des dessins est l'étoile de la police
 * (x = 38,65 en coordonnées de référence, plus la moitié de son trait) : 39,65 × 1,15 = 45,6 px, sous les 46 px.
 */
export const ECHELLE_MAX_DU_DECOR = 1.15;

/** Rapport entre la hauteur de la bulle et celle du dessin de référence, plafonné pour que le décor reste dans la zone des bouts. */
export const echelleDuDecor = (hauteur: number) => Math.min(hauteur / HAUTEUR_DE_REFERENCE, ECHELLE_MAX_DU_DECOR);

/** Décalage vertical qui garde le décor au milieu du bout quand la bulle est plus haute que le décor mis à l'échelle. */
const decalageVertical = ({ hauteur, echelle }: Mesures) => (hauteur - HAUTEUR_DE_REFERENCE * echelle) / 2;

/** Ce que le décor d'un univers a besoin de savoir de la bulle qu'il habille. `p` préfixe les identifiants de dégradés. */
export type Mesures = {
  readonly largeur: number;
  readonly hauteur: number;
  /** Échelle du décor des bouts (`echelleDuDecor`). */
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
  return <g transform={`translate(0 ${decalageVertical(mesures)}) scale(${mesures.echelle})`}>{children}</g>;
}

/** Le décor du bout droit, dessiné dans les coordonnées de référence (bord droit à 156) et recalé sur le bord droit de la bulle. */
export function BoutDroit({ mesures, children }: { readonly mesures: Mesures; readonly children: ReactNode }) {
  return <g transform={`translate(${mesures.largeur} ${decalageVertical(mesures)}) scale(${mesures.echelle}) translate(${-LARGEUR_DE_REFERENCE} 0)`}>{children}</g>;
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
  const ordonnee = y * echelle + decalageVertical(mesures);
  const abscisse = cote === "gauche" ? x * echelle : largeur - (LARGEUR_DE_REFERENCE - x) * echelle;
  return <g transform={`translate(${abscisse} ${ordonnee})`}>{children}</g>;
}
