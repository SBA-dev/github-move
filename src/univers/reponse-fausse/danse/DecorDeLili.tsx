import type { RefObject } from "react";
import { PREFIXE_DE_LILI as P } from "./reglages.ts";

type Props = { readonly racine: RefObject<SVGSVGElement | null>; readonly avecBulleEcrite: boolean };

/**
 * Le décor de la scène de Lili, réduit au minimum : un petit tapis rose pâle et la bulle « oups ! » (absente sur un petit dessin).
 * Le moteur dessine Lili à l'échelle 1,25 de la célébration ; le groupe `scale(.8)` la ramène à la taille de son dessin fixe.
 * Les groupes à identifiant sont remplis par le moteur à chaque image : React n'y touche pas.
 */
export function DecorDeLili({ racine, avecBulleEcrite }: Props) {
  return (
    <svg ref={racine} viewBox="-83 -119 166 208" aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={`${P}-clip-oeil`}><ellipse rx="7.4" ry="9.6" /></clipPath>
        <clipPath id={`${P}-clip-bouche`}><path d="M-11 11 Q0 27 11 11 Z" /></clipPath>
      </defs>
      <g id={`${P}-sol`} opacity="0">
        <ellipse cx="0" cy="71" rx="66" ry="8" fill="#F3C9E4" opacity=".9" />
        <ellipse cx="-8" cy="69.5" rx="42" ry="4.5" fill="#FBE3F1" opacity=".8" />
      </g>
      <g transform="scale(.8)">
        <ellipse id={`${P}-ombre-de-lili`} fill="#1E1230" opacity=".3" />
        <g id={`${P}-lili`} />
      </g>
      {avecBulleEcrite && (
        <g id={`${P}-oups`} opacity="0" data-testid="bulle-ecrite-de-la-scene">
          <g id={`${P}-oups-corps`} transform="translate(-52 -108)">
            <path d="M-21 -10 H21 Q27 -10 27 -4 V6 Q27 12 21 12 H12 L8 21 L2 12 H-21 Q-27 12 -27 6 V-4 Q-27 -10 -21 -10 Z" fill="#FFFFFF" stroke="#33304A" strokeWidth="2.4" strokeLinejoin="round" />
            <text className="ecrit-de-la-scene" textAnchor="middle" x="0" y="5.5" fontSize="14" fill="#33304A">oups !</text>
          </g>
        </g>
      )}
    </svg>
  );
}
