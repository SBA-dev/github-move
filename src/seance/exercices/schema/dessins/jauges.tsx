import type { ReactNode } from "react";
import type { CleUnivers } from "@domain/motivation";

/**
 * La jauge d'une barre dans un univers : un remplissage uni (le milieu s'étire avec la barre), le contour et la silhouette
 * de l'univers, et deux bouts de dessin de taille fixe (24 px de large) qui ne dépendent jamais de la longueur de la barre.
 * Jamais d'échelle ni de motif sur la longueur. Les barres du tout ont leur propre teinte.
 * Le nombre écrit dessus (encre #1F2A1F) a au moins 4,5:1 de contraste sur chaque teinte.
 * Source validée : docs/stories/131/planches/jauge-du-schema.png et generer-les-planches.mjs.
 */
export type DessinDeLaJauge = {
  readonly partie: string;
  readonly tout: string;
  readonly contour: string;
  /** Le rayon des coins de la barre. */
  readonly rayon: string;
  /** La découpe des bouts (queue d'aronde) ; ses pointes sont à 11 px du bord intérieur, comme les traits des bouts. */
  readonly decoupe?: string;
  readonly boutGauche: ReactNode;
  readonly boutDroit: ReactNode;
};

const TRAIT = { fill: "none", strokeWidth: 3, strokeLinejoin: "round", vectorEffect: "non-scaling-stroke" } as const;

const POINTE_A_GAUCHE = <path d="M0 0 L11 22 L0 44" {...TRAIT} />;
const POINTE_A_DROITE = <path d="M24 0 L13 22 L24 44" {...TRAIT} />;
const DEUX_BOUTS_EN_QUEUE_D_ARONDE = "polygon(0 0, 100% 0, calc(100% - 14px) 50%, 100% 100%, 0 100%, 14px 50%)";
const BOUT_DROIT_EN_QUEUE_D_ARONDE = "polygon(0 0, 100% 0, calc(100% - 14px) 50%, 100% 100%, 0 100%)";

const avecContour = (forme: ReactNode, contour: string) => <g stroke={contour}>{forme}</g>;

const embout = (x: number, largeur: number, rayon: number, fond: string, contour: string): ReactNode => (
  <rect x={x} y="1.5" width={largeur} height="41" rx={rayon} fill={fond} stroke={contour} strokeWidth="3" vectorEffect="non-scaling-stroke" />
);

export const DESSINS_DES_JAUGES: Readonly<Record<CleUnivers, DessinDeLaJauge>> = {
  animaux: {
    partie: "#8FD39B",
    tout: "#F6DFA4",
    contour: "#2E7E52",
    rayon: "22px",
    boutGauche: null,
    boutDroit: <path d="M3 28 Q6 6 21 4 Q22 30 3 38 Z" fill="#4FB37A" stroke="#2E7E52" strokeWidth="3" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />,
  },
  princesse: {
    partie: "#D9B3F0",
    tout: "#FFE0F0",
    contour: "#7E56BC",
    rayon: "0",
    decoupe: DEUX_BOUTS_EN_QUEUE_D_ARONDE,
    boutGauche: avecContour(POINTE_A_GAUCHE, "#7E56BC"),
    boutDroit: avecContour(POINTE_A_DROITE, "#7E56BC"),
  },
  sports: {
    partie: "#8FC7F7",
    tout: "#FFE08A",
    contour: "#164BA8",
    rayon: "10px",
    boutGauche: embout(1.5, 13, 8, "#3F7FE0", "#164BA8"),
    boutDroit: embout(9.5, 13, 8, "#3F7FE0", "#164BA8"),
  },
  police: {
    partie: "#9FB2E6",
    tout: "#DCE4FF",
    contour: "#1F2F82",
    rayon: "4px",
    boutGauche: embout(1.5, 11, 3, "#3450C8", "#1F2F82"),
    boutDroit: embout(11.5, 11, 3, "#3450C8", "#1F2F82"),
  },
  pompier: {
    partie: "#A8DFF5",
    tout: "#FFD3A6",
    contour: "#1F6F96",
    rayon: "8px",
    boutGauche: embout(1.5, 15, 5, "#FFC93C", "#A56F00"),
    boutDroit: embout(7.5, 15, 5, "#FFC93C", "#A56F00"),
  },
  danse: {
    partie: "#F7B3D6",
    tout: "#FBE3A8",
    contour: "#A24A9A",
    rayon: "0",
    decoupe: BOUT_DROIT_EN_QUEUE_D_ARONDE,
    boutGauche: <rect x="1.5" y="1.5" width="11" height="41" rx="5.5" fill="#E8C48F" stroke="#8A5A2B" strokeWidth="3" vectorEffect="non-scaling-stroke" />,
    boutDroit: avecContour(POINTE_A_DROITE, "#A24A9A"),
  },
};
