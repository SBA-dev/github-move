import type { RefObject } from "react";
import { PREFIXE_DE_NOISETTE as P } from "./reglages.ts";

type Props = { readonly racine: RefObject<SVGSVGElement | null>; readonly avecBulleEcrite: boolean };

/**
 * Le décor de la scène de Noisette, réduit au minimum : un coin de prairie, un bout de branche, la noisette dorée et la bulle « hop ! » (absente sur un petit dessin).
 * Le cadre est celui du dessin fixe de Noisette ; le moteur la dessine à l'échelle 1,35, le groupe `scale(.7407)` la ramène à 1, ses pieds à l'origine.
 * Les groupes à identifiant sont remplis par le moteur à chaque image : React n'y touche pas.
 */
export function DecorDeNoisette({ racine, avecBulleEcrite }: Props) {
  return (
    <svg ref={racine} viewBox="-114 -178 175 190" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${P}-noisette-or`} cx=".35" cy=".3" r=".75">
          <stop offset="0" stopColor="#FFF1A8" />
          <stop offset=".5" stopColor="#FFC93C" />
          <stop offset="1" stopColor="#D99A12" />
        </radialGradient>
        <radialGradient id={`${P}-lueur`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#FFF1A8" stopOpacity=".75" />
          <stop offset="1" stopColor="#FFF1A8" stopOpacity="0" />
        </radialGradient>
        <clipPath id={`${P}-clip-oeil`}><ellipse rx="9" ry="11" /></clipPath>
      </defs>
      <g id={`${P}-sol`} opacity="0">
        <ellipse cx="-24" cy="3" rx="84" ry="8.5" fill="#6FD170" opacity=".85" />
        <ellipse cx="-32" cy="1.5" rx="54" ry="4.8" fill="#8BE08A" opacity=".7" />
        <g fill="#4FB37A" stroke="#2E7E52" strokeWidth="1.2" strokeLinejoin="round">
          <path d="M-96 4 q1 -12 5 -17 q1 9 -2 17 Z" />
          <path d="M-90 4 q-2 -10 2 -14 q3 7 1 14 Z" />
          <path d="M-66 8 q1 -10 5 -14 q1 8 -2 14 Z" />
          <path d="M44 6 q1 -10 5 -14 q1 8 -2 14 Z" />
          <path d="M50 6 q-2 -8 2 -12 q3 6 1 12 Z" />
        </g>
        <g stroke="#33304A" strokeWidth="1.1">
          <g transform="translate(-76 5)">
            <path d="M0 0 V-9" stroke="#2E7E52" strokeWidth="1.6" />
            <circle cy="-10" r="3.6" fill="#FF8FA8" />
            <circle cy="-10" r="1.4" fill="#FFC93C" />
          </g>
        </g>
      </g>
      <g id={`${P}-branche`} opacity="0">
        <path d="M90 -157 Q68 -160 44 -158" fill="none" stroke="#33304A" strokeWidth="7" strokeLinecap="round" />
        <path d="M90 -157 Q68 -160 44 -158" fill="none" stroke="#8E5A2B" strokeWidth="3.6" strokeLinecap="round" />
        <g stroke="#33304A" strokeWidth="2.2" strokeLinejoin="round">
          <circle cx="46" cy="-165" r="10" fill="#3F9A63" />
          <circle cx="60" cy="-169" r="11" fill="#2E7E52" />
          <circle cx="74" cy="-164" r="9" fill="#4FAE6E" />
        </g>
        <circle cx="58" cy="-172" r="4" fill="#8FD98A" opacity=".8" />
        <path d="M56 -158 V-152" fill="none" stroke="#33304A" strokeWidth="3.4" strokeLinecap="round" />
        <path d="M56 -158 V-152" fill="none" stroke="#8E5A2B" strokeWidth="1.6" strokeLinecap="round" />
      </g>
      <g transform="scale(.7407) translate(-190 -392)">
        <ellipse id={`${P}-ombre-sol`} cx="190" cy="398" rx="46" ry="9" fill="#2E7E52" opacity=".28" />
        <ellipse id={`${P}-ombre-noix`} cx="0" cy="398" rx="10" ry="2.6" fill="#2E7E52" opacity=".3" />
        <g id={`${P}-noisette`} />
        <g id={`${P}-noix`} />
      </g>
      {avecBulleEcrite && (
        <g id={`${P}-hop`} opacity="0" data-testid="bulle-ecrite-de-la-scene">
          <g id={`${P}-hop-corps`} transform="translate(-90 -148)">
            <path d="M-16 -10 H16 Q22 -10 22 -4 V6 Q22 12 16 12 H10 L6 21 L0 12 H-16 Q-22 12 -22 6 V-4 Q-22 -10 -16 -10 Z" fill="#FFFFFF" stroke="#33304A" strokeWidth="2.4" strokeLinejoin="round" />
            <text className="ecrit-de-la-scene" textAnchor="middle" x="0" y="5.5" fontSize="14" fill="#33304A">hop !</text>
          </g>
        </g>
      )}
    </svg>
  );
}
