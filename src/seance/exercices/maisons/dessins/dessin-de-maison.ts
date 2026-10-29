import type { ReactNode } from "react";

/** Un morceau du dessin : `p` préfixe les identifiants de dégradés pour que deux maisons d'une même page ne se les disputent pas. */
export type Couche = (p: string) => ReactNode;

/** Les quatre couches d'une maison dans un état (porte fermée ou porte ouverte et maison allumée). */
export type EtatDuDessin = {
  readonly sol: Couche;
  readonly maison: Couche;
  readonly interieur: Couche;
  readonly porte: Couche;
};

/** Le dessin d'une maison dans un univers. */
export type DessinDeMaison = {
  /** Le sens dans lequel la porte s'ouvre : de côté (battant) ou vers le haut (rideau). */
  readonly ouverture: "horizontale" | "verticale";
  readonly degrades: Couche;
  readonly fermee: EtatDuDessin;
  readonly ouverte: EtatDuDessin;
};
