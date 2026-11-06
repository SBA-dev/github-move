import type { RefObject } from "react";
import { ECHELLE_DE_BASE } from "../../celebrations/pompiers/poses.ts";
import { PREFIXE_DE_SAM as P, SOL_DU_CADRE as SOL } from "./reglages.ts";

type Props = { readonly racine: RefObject<SVGSVGElement | null>; readonly avecBulleEcrite: boolean };

/** Le moteur dessine Sam à l'échelle 1,15 : ce groupe la ramène à 1, à l'échelle du dessin fixe. */
const DE_LA_PLACE_AU_CADRE = `scale(${(1 / ECHELLE_DE_BASE).toFixed(4)})`;

/**
 * Le décor de la scène de Sam, réduit au minimum : un petit coin d'herbe, le bouton de fleur, le jet et la bulle « plouf ! » (absente sur un petit dessin).
 * Le cadre est celui de son dessin fixe (`viewBox="-82 -137 181 227"`) ; le haut du filet d'eau le dépasse de quelques unités (`overflow: visible`).
 * Les groupes à identifiant sont remplis par le moteur à chaque image : React n'y touche pas.
 */
export function DecorDeSam({ racine, avecBulleEcrite }: Props) {
  return (
    <svg ref={racine} viewBox="-82 -137 181 227" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`${P}-clip-oeil`}><ellipse rx="7.4" ry="9.6" /></clipPath>
        <clipPath id={`${P}-clip-bouche`}><path d="M-11 11 Q0 27 11 11 Z" /></clipPath>
        <linearGradient id={`${P}-herbe`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9AD48A" />
          <stop offset="1" stopColor="#74BC6C" />
        </linearGradient>
      </defs>
      <g id={`${P}-repere`} />
      <g id={`${P}-sol`} opacity="0">
        <path
          d={`M-74 ${SOL + 3} Q-72 ${SOL - 5} -52 ${SOL - 5} H86 Q99 ${SOL - 4} 99 ${SOL + 3} Q98 ${SOL + 10} 84 ${SOL + 10} H-50 Q-74 ${SOL + 10} -74 ${SOL + 3} Z`}
          fill={`url(#${P}-herbe)`}
          stroke="#5E9F58"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        <path d={`M-60 ${SOL + 7} l2 -5 l2 5 M50 ${SOL + 8} l2 -5 l2 5 M-20 ${SOL + 9} l2 -4 l2 4`} fill="none" stroke="#5E9F58" strokeWidth="2" strokeLinecap="round" />
      </g>
      <g id={`${P}-fleur`} />
      <g transform={DE_LA_PLACE_AU_CADRE}>
        <ellipse id={`${P}-ombre-sol`} cx="0" cy="0" rx="34" ry="8" fill="#8A5A3A" opacity=".22" />
        <g id={`${P}-sam`} />
      </g>
      <g id={`${P}-jet`} opacity="0">
        <path className="jet-contour" fill="none" stroke="#3C8DDA" strokeWidth="5.6" strokeLinecap="round" strokeLinejoin="round" />
        <path className="jet-eau" fill="none" stroke="#BDE8FF" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" />
        <path className="jet-reflet" fill="none" stroke="#FFFFFF" strokeWidth="1.1" strokeLinecap="round" opacity=".8" />
        <g className="gouttes" fill="#BDE8FF" stroke="#3C8DDA" strokeWidth="1.1" />
        <g className="eclabousse" fill="#BDE8FF" stroke="#3C8DDA" strokeWidth="1" />
      </g>
      {avecBulleEcrite && (
        <g id={`${P}-plouf`} opacity="0" data-testid="bulle-ecrite-de-la-scene">
          <g id={`${P}-plouf-corps`} transform="translate(72 -116)">
            <path d="M-21 -10 H21 Q27 -10 27 -4 V6 Q27 12 21 12 H-2 L-9 21 L-12 12 H-21 Q-27 12 -27 6 V-4 Q-27 -10 -21 -10 Z" fill="#FFFFFF" stroke="#33304A" strokeWidth="2.4" strokeLinejoin="round" />
            <text className="ecrit-de-la-scene" textAnchor="middle" x="0" y="5.5" fontSize="14" fill="#33304A">plouf !</text>
          </g>
        </g>
      )}
    </svg>
  );
}
