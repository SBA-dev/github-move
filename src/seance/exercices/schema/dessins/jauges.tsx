import type { ReactNode } from "react";
import type { CleUnivers } from "@domain/motivation";

/**
 * La jauge d'une barre dans un univers : un remplissage uni (le milieu s'étire avec la barre) et deux bouts de dessin
 * de taille fixe (cadre 24 × 44), qui ne dépendent jamais de la longueur de la barre.
 * Les barres du tout ont leur propre teinte. Le nombre écrit dessus (encre #1F2A1F) a au moins 4,5:1 de contraste sur chaque teinte.
 * Source proposée : docs/stories/131/planches/jauge-du-schema.png et generer-les-planches.mjs.
 */
export type DessinDeLaJauge = {
  readonly partie: string;
  readonly tout: string;
  readonly boutGauche: ReactNode;
  readonly boutDroit: ReactNode;
};

const chevron = (couleur: string, versLaDroite: boolean): ReactNode => (
  <path
    d={versLaDroite ? "M2 8 L14 22 L2 36" : "M22 8 L10 22 L22 36"}
    fill="none"
    stroke={couleur}
    strokeWidth="4"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
);

const embout = (x: number, largeur: number, rayon: number, fond: string, contour: string): ReactNode => (
  <rect x={x} y="6" width={largeur} height="32" rx={rayon} fill={fond} stroke={contour} strokeWidth="3" strokeLinejoin="round" />
);

export const DESSINS_DES_JAUGES: Readonly<Record<CleUnivers, DessinDeLaJauge>> = {
  animaux: {
    partie: "#8FD39B",
    tout: "#F6DFA4",
    boutGauche: <circle cx="12" cy="22" r="6" fill="#4FB37A" stroke="#2E7E52" strokeWidth="3" />,
    boutDroit: <path d="M2 26 Q6 6 21 5 Q21 30 2 36 Z" fill="#4FB37A" stroke="#2E7E52" strokeWidth="3" strokeLinejoin="round" />,
  },
  princesse: {
    partie: "#D9B3F0",
    tout: "#FFE0F0",
    boutGauche: chevron("#7E56BC", true),
    boutDroit: chevron("#7E56BC", false),
  },
  sports: {
    partie: "#8FC7F7",
    tout: "#FFE08A",
    boutGauche: embout(2, 14, 8, "#3F7FE0", "#164BA8"),
    boutDroit: embout(8, 14, 8, "#3F7FE0", "#164BA8"),
  },
  police: {
    partie: "#9FB2E6",
    tout: "#DCE4FF",
    boutGauche: embout(2, 12, 4, "#3450C8", "#1F2F82"),
    boutDroit: embout(10, 12, 4, "#3450C8", "#1F2F82"),
  },
  pompier: {
    partie: "#A8DFF5",
    tout: "#FFD3A6",
    boutGauche: embout(2, 16, 6, "#FFC93C", "#A56F00"),
    boutDroit: embout(6, 16, 6, "#FFC93C", "#A56F00"),
  },
  danse: {
    partie: "#F7B3D6",
    tout: "#FBE3A8",
    boutGauche: <rect x="3" y="2" width="10" height="40" rx="5" fill="#E8C48F" stroke="#8A5A2B" strokeWidth="3" strokeLinejoin="round" />,
    boutDroit: chevron("#A24A9A", false),
  },
};
