import type { RefObject } from "react";
import { PREFIXE_DE_LUMI as P } from "./reglages.ts";

type Props = { readonly racine: RefObject<SVGSVGElement | null>; readonly avecBulleEcrite: boolean };

const FLEURS_DU_SOL = [[-84, 8, "#FFFFFF"], [86, 10, "#FF8FB8"], [-60, 16, "#9FD3FF"]] as const;
const PETALES_D_UNE_FLEUR = [0, 1, 2, 3, 4].map((k) => ({ k, x: Math.round(Math.cos(k * 1.2566) * 46) / 10, y: Math.round(Math.sin(k * 1.2566) * 46) / 10 }));

/**
 * Le décor de la scène de Lumi, réduit au minimum : un petit coin de prairie pâle, les bulles de savon, les traits du souffle et la bulle « pschitt ! » (absente sur un petit dessin).
 * Le moteur dessine Lumi à l'échelle 1,3 de la célébration : le cadre de la scène est celui de son dessin fixe (`viewBox="-98 -216 192 240"`) à cette échelle, de même rapport.
 * Les groupes à identifiant sont remplis par le moteur à chaque image : React n'y touche pas.
 */
export function DecorDeLumi({ racine, avecBulleEcrite }: Props) {
  return (
    <svg ref={racine} viewBox="-127.4 -280.8 249.6 312" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`${P}-lueur`} cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#FFF1A8" stopOpacity=".8" />
          <stop offset="1" stopColor="#FFF1A8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${P}-aile`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".9" />
          <stop offset="1" stopColor="#9CCFFF" stopOpacity=".6" />
        </linearGradient>
        <clipPath id={`${P}-clip-oeil`}><ellipse rx="9" ry="11" /></clipPath>
        <clipPath id={`${P}-clip-bouche`}><path d="M-11 0 Q0 20 11 0 Z" /></clipPath>
      </defs>
      <g id={`${P}-sol`} opacity="0">
        <ellipse cx="0" cy="12" rx="104" ry="12" fill="#EBD3F4" />
        <ellipse cx="-8" cy="10" rx="72" ry="7" fill="#F8E6F8" opacity=".9" />
        {FLEURS_DU_SOL.map(([x, y, couleur]) => (
          <g key={x} transform={`translate(${x} ${y})`} stroke="#33304A" strokeWidth="1.1">
            {PETALES_D_UNE_FLEUR.map(({ k, x: cx, y: cy }) => <circle key={k} cx={cx} cy={cy} r="3.4" fill={couleur} />)}
            <circle r="2.4" fill="#FFF3B0" />
          </g>
        ))}
      </g>
      <ellipse id={`${P}-ombre-sol`} cx="0" cy="10" rx="40" ry="8" fill="#7C2690" opacity=".2" />
      <g id={`${P}-lumi`} />
      <g id={`${P}-baguette`} />
      <g id={`${P}-bulles`} />
      <g id={`${P}-souffle`} fill="none" stroke="#B79BE0" strokeWidth="3" strokeLinecap="round" opacity="0">
        <path d="M0 0 q14 -5 28 0" />
        <path d="M3 9 q16 -3 32 1" />
        <path d="M0 -9 q13 -3 24 -5" />
      </g>
      {avecBulleEcrite && (
        <g id={`${P}-pschitt`} opacity="0" data-testid="bulle-ecrite-de-la-scene">
          <g id={`${P}-pschitt-corps`} transform="translate(-84 -250)">
            <path d="M-34 -12 H34 Q40 -12 40 -4 V8 Q40 16 34 16 H14 L8 28 L2 16 H-34 Q-40 16 -40 8 V-4 Q-40 -12 -34 -12 Z" fill="#FFFFFF" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" />
            <text className="ecrit-de-la-scene" textAnchor="middle" x="0" y="8" fontSize="16" fill="#33304A">pschitt !</text>
          </g>
        </g>
      )}
    </svg>
  );
}
