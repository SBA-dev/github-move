import type { RefObject } from "react";
import { ECHELLE_DE_BASE, X_MAX, Y_SOL } from "../../celebrations/police/poses.ts";
import { PREFIXE_DE_MAX as P } from "./reglages.ts";

type Props = { readonly racine: RefObject<SVGSVGElement | null>; readonly avecBulleEcrite: boolean };

/** Le moteur dessine Max dans le repère de la place (échelle 1,15, Max en `X_MAX`) : ce groupe le ramène à l'origine du cadre, à l'échelle du dessin fixe. */
const DE_LA_PLACE_AU_CADRE = `scale(${(1 / ECHELLE_DE_BASE).toFixed(4)}) translate(${-X_MAX} ${(-Y_SOL).toFixed(2)})`;

/**
 * Le décor de la scène de Max, réduit au minimum : un petit coin d'herbe et la bulle « oups ! » (absente sur un petit dessin).
 * Le cadre est celui de son dessin fixe (`viewBox="-82 -137 181 227"`). Les groupes à identifiant sont remplis par le moteur à chaque image : React n'y touche pas.
 */
export function DecorDeMax({ racine, avecBulleEcrite }: Props) {
  return (
    <svg ref={racine} viewBox="-82 -137 181 227" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`${P}-clip-oeil`}><ellipse rx="7.4" ry="9.6" /></clipPath>
        <clipPath id={`${P}-clip-bouche`}><path d="M-11 11 Q0 27 11 11 Z" /></clipPath>
        <radialGradient id={`${P}-verre`} cx=".35" cy=".3" r=".7">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".9" />
          <stop offset=".5" stopColor="#D8ECFF" stopOpacity=".45" />
          <stop offset="1" stopColor="#9FC8FF" stopOpacity=".35" />
        </radialGradient>
      </defs>
      <g id={`${P}-sol`} opacity="0">
        <ellipse cx="2" cy="73" rx="84" ry="9" fill="#BFE3B4" opacity=".9" />
        <ellipse cx="-4" cy="71.5" rx="52" ry="5" fill="#D9F0CF" opacity=".85" />
        <path d="M-70 73 q1 -7 4 -9 M-66 74 q0 -6 -1 -9 M60 74 q1 -7 4 -9 M64 73 q0 -6 -2 -9" fill="none" stroke="#7FBF86" strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <g transform={DE_LA_PLACE_AU_CADRE}>
        <ellipse id={`${P}-ombre-sol`} cx="196" cy="384" rx="34" ry="8" fill="#253B9C" opacity=".2" />
        <ellipse id={`${P}-ombre-chiot`} cx="148" cy="384" rx="22" ry="5" fill="#253B9C" opacity="0" />
        <g id={`${P}-chiot-monde`} />
        <g id={`${P}-max`} />
        <g id={`${P}-chiot-devant`} />
        <g id={`${P}-casquette-vol`} opacity="0" />
      </g>
      {avecBulleEcrite && (
        <g id={`${P}-oups`} opacity="0" data-testid="bulle-ecrite-de-la-scene">
          <g id={`${P}-oups-corps`} transform="translate(-52 -112)">
            <path d="M-21 -10 H21 Q27 -10 27 -4 V6 Q27 12 21 12 H12 L8 21 L2 12 H-21 Q-27 12 -27 6 V-4 Q-27 -10 -21 -10 Z" fill="#FFFFFF" stroke="#33304A" strokeWidth="2.4" strokeLinejoin="round" />
            <text className="ecrit-de-la-scene" textAnchor="middle" x="0" y="5.5" fontSize="14" fill="#33304A">oups !</text>
          </g>
        </g>
      )}
    </svg>
  );
}
