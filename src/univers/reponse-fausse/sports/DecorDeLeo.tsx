import type { RefObject } from "react";
import { PREFIXE_DE_LEO as P } from "./reglages.ts";

type Props = { readonly racine: RefObject<SVGSVGElement | null>; readonly avecBulleEcrite: boolean };

/**
 * Le décor de la scène de Léo, réduit au minimum : un coin d'herbe, un petit poteau et la bulle « oh ! » (absente sur un petit dessin).
 * Les groupes à identifiant sont remplis par le moteur à chaque image : React n'y touche pas.
 */
export function DecorDeLeo({ racine, avecBulleEcrite }: Props) {
  return (
    <svg ref={racine} viewBox="-84 -119 168 210" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`${P}-clip-oeil`}><ellipse rx="7.4" ry="9.6" /></clipPath>
        <clipPath id={`${P}-clip-bouche`}><path d="M-11 11 Q0 27 11 11 Z" /></clipPath>
        <clipPath id={`${P}-clip-poteau`}><rect x="-4" y="-40" width="8" height="40" rx="4" /></clipPath>
      </defs>
      <g id={`${P}-sol`} opacity="0">
        <ellipse cx="0" cy="75" rx="80" ry="8" fill="#6FD170" opacity=".85" />
        <ellipse cx="-10" cy="73" rx="52" ry="4.5" fill="#8BE08A" opacity=".7" />
      </g>
      <g id={`${P}-poteau`} opacity="0">
        <g id={`${P}-poteau-corps`} transform="translate(72 75)">
          <ellipse cx="0" cy="-1" rx="9" ry="3" fill="#15502B" opacity=".25" />
          <g clipPath={`url(#${P}-clip-poteau)`}>
            <rect x="-4" y="-40" width="8" height="40" fill="#FFFFFF" />
            <rect x="-4" y="-27" width="8" height="8" fill="#E8604C" />
            <rect x="1" y="-40" width="3" height="40" fill="#D9E3F2" />
          </g>
          <rect x="-4" y="-40" width="8" height="40" rx="4" fill="none" stroke="#33304A" strokeWidth="2.4" />
        </g>
      </g>
      <ellipse id={`${P}-ombre-leo`} fill="#15502B" opacity=".25" />
      <g id={`${P}-leo`} />
      <g id={`${P}-ballon-couche`} />
      {avecBulleEcrite && (
        <g id={`${P}-oh`} opacity="0" data-testid="bulle-ecrite-de-la-scene">
          <g id={`${P}-oh-corps`} transform="translate(51 -103) scale(1.15)">
            <path transform="scale(-1 1)" d="M-19 -10 H19 Q25 -10 25 -4 V6 Q25 12 19 12 H8 L12 21 L-2 12 H-19 Q-25 12 -25 6 V-4 Q-25 -10 -19 -10 Z" fill="#FFFFFF" stroke="#33304A" strokeWidth="2.4" strokeLinejoin="round" />
            <text className="ecrit-de-la-scene" textAnchor="middle" x="0" y="6" fontSize="15" fill="#33304A">oh !</text>
          </g>
        </g>
      )}
    </svg>
  );
}
