import type { RefObject } from "react";

type Props = { readonly racine: RefObject<SVGSVGElement | null>; readonly cri: string };

const FENETRES = [-80, -44, 20, 56];
const TRAVERSES = [12, 58, 104, 150, 196, 242, 288, 334];
const LANTERNES = [-30, 30];

/**
 * Le décor fixe de la place du commissariat (ciel, collines, commissariat, arbres, trottoir, route, passage piéton, banc) et les groupes
 * que le moteur remplit à chaque image. Un quartier accueillant, de jour. Les deux lanternes de l'entrée restent éteintes ou fixes : elles ne clignotent jamais.
 * Les groupes à identifiant sont vides ici : React n'y touche pas, c'est le moteur qui les dessine.
 */
export function DecorDeLaPolice({ racine, cri }: Props) {
  return (
    <svg ref={racine} viewBox="0 0 360 450" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="police-ciel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#C9D6FF" />
          <stop offset="1" stopColor="#EEF2FF" />
        </linearGradient>
        <linearGradient id="police-trottoir" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#E4E9F5" />
          <stop offset="1" stopColor="#CDD6EA" />
        </linearGradient>
        <linearGradient id="police-route" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9AA7C7" />
          <stop offset="1" stopColor="#7E8CB0" />
        </linearGradient>
        <radialGradient id="police-verre" cx=".35" cy=".3" r=".7">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".9" />
          <stop offset=".5" stopColor="#D8ECFF" stopOpacity=".45" />
          <stop offset="1" stopColor="#9FC8FF" stopOpacity=".35" />
        </radialGradient>
        <clipPath id="police-clip-oeil"><ellipse rx="7.4" ry="9.6" /></clipPath>
        <clipPath id="police-clip-bouche"><path d="M-11 11 Q0 27 11 11 Z" /></clipPath>
      </defs>

      <rect width="360" height="450" fill="url(#police-ciel)" />
      <circle cx="304" cy="56" r="22" fill="#FFE98A" stroke="#F7D86A" strokeWidth="3" />
      <g fill="#FFFFFF" stroke="#DDE4F7" strokeWidth="2.5" strokeLinejoin="round">
        <g className="nuage"><path d="M60 92 q-6 -18 14 -18 q6 -14 22 -8 q16 -6 20 10 q14 2 8 16 Z" /></g>
        <g className="nuage lent" opacity=".85"><path d="M430 70 q-4 -12 10 -12 q5 -9 15 -5 q11 -4 14 7 q9 2 5 10 Z" /></g>
      </g>
      <path d="M0 250 C60 224 130 236 200 230 C260 224 310 214 360 232 V450 H0 Z" fill="#B9C9EC" />
      <path d="M0 276 C70 258 150 266 220 262 C290 258 330 250 360 262 V450 H0 Z" fill="#8AA2DA" />

      <g transform="translate(180 198)" stroke="#33304A" strokeWidth="2.6" strokeLinejoin="round">
        <rect x="-96" y="-10" width="192" height="104" fill="#5A75BF" />
        <rect x="-96" y="-10" width="192" height="12" fill="#3450C8" />
        <rect x="-102" y="-22" width="204" height="14" rx="3" fill="#253B9C" />
        <g fill="#FFF3B0">{FENETRES.map((x) => <rect key={x} x={x} y="14" width="24" height="26" rx="3" />)}</g>
        <g fill="none" stroke="#33304A" strokeWidth="1.6" opacity=".6">
          <path d="M-68 14 V40 M-80 27 H-56 M-32 14 V40 M-44 27 H-20 M32 14 V40 M20 27 H44 M68 14 V40 M56 27 H80" />
        </g>
        <path d="M-16 94 V52 Q0 38 16 52 V94 Z" fill="#253B9C" />
        <circle cx="8" cy="76" r="2.4" fill="#FFC93C" />
        <rect x="-50" y="-4" width="100" height="18" rx="4" fill="#FFFFFF" />
        <text x="0" y="9" textAnchor="middle" fontFamily="Andika, sans-serif" fontWeight="700" fontSize="11" fill="#253B9C" stroke="none">COMMISSARIAT</text>
        {LANTERNES.map((x) => (
          <g key={x} transform={`translate(${x} 60)`}>
            <rect x="-3" y="-28" width="6" height="30" fill="#33304A" />
            <rect x="-9" y="-40" width="18" height="16" rx="3" fill="#3450C8" />
            <circle cy="-32" r="4.5" fill="#FFF3B0" />
          </g>
        ))}
      </g>

      <g stroke="#33304A" strokeWidth="2.5" strokeLinejoin="round">
        <rect x="26" y="262" width="8" height="34" rx="3" fill="#6B4A2B" />
        <g fill="#41589E"><circle cx="30" cy="248" r="26" /><circle cx="14" cy="262" r="16" /><circle cx="48" cy="262" r="17" /></g>
        <rect x="326" y="266" width="8" height="30" rx="3" fill="#6B4A2B" />
        <g fill="#41589E"><circle cx="330" cy="252" r="24" /><circle cx="314" cy="266" r="15" /><circle cx="346" cy="266" r="15" /></g>
      </g>
      <path d="M0 296 H360 V384 H0 Z" fill="url(#police-trottoir)" />
      <path d="M0 296 H360" stroke="#A9B6D4" strokeWidth="2.4" />
      <path d="M0 384 H360" stroke="#8E9BBE" strokeWidth="3" />
      <g stroke="#B7C2DB" strokeWidth="1.4" opacity=".7"><path d="M60 296 V384 M120 296 V384 M180 296 V384 M240 296 V384 M300 296 V384 M0 340 H360" /></g>
      <path d="M0 386 H360 V450 H0 Z" fill="url(#police-route)" />
      <g fill="#F1F4FA" opacity=".9">{TRAVERSES.map((x) => <rect key={x} x={x} y="398" width="26" height="44" rx="3" />)}</g>
      <g transform="translate(60 340)" stroke="#33304A" strokeWidth="2.4" strokeLinejoin="round">
        <rect x="-30" y="-22" width="60" height="7" rx="3" fill="#8E5A2B" />
        <rect x="-30" y="-12" width="60" height="7" rx="3" fill="#8E5A2B" />
        <rect x="-30" y="4" width="60" height="7" rx="3" fill="#A86E3A" />
        <rect x="-26" y="-6" width="5" height="26" fill="#41589E" />
        <rect x="21" y="-6" width="5" height="26" fill="#41589E" />
      </g>

      <g id="police-traces" />
      <ellipse id="police-ombre-sol" cx="150" cy="384" rx="34" ry="8" fill="#253B9C" opacity=".2" />
      <ellipse id="police-ombre-chiot" cx="150" cy="384" rx="22" ry="5" fill="#253B9C" opacity="0" />
      <g id="police-loupe-sol" opacity="0" />
      <g id="police-chiot-monde" />
      <g id="police-max" />
      <g id="police-chiot-devant" />
      <g id="police-buisson" />
      <g id="police-voitures" />
      <g id="police-casquette-vol" opacity="0" />
      <g id="police-bulle" opacity="0">
        <rect x="-30" y="-16" width="60" height="30" rx="14" fill="#FFFFFF" stroke="#33304A" strokeWidth="2.6" />
        <text y="6" textAnchor="middle" fontWeight="800" fontSize="17" fill="#253B9C" style={{ fontFamily: "var(--police-titres)" }} />
      </g>
      <g id="police-etincelles-de-la-tete" opacity="0" fill="#FFC93C" stroke="#33304A" strokeWidth="1.8" strokeLinejoin="round" />
      <g id="police-etincelles-des-gants" opacity="0" fill="#FFC93C" stroke="#33304A" strokeWidth="1.5" strokeLinejoin="round" />

      <g transform="translate(180 56)">
        <g id="police-rayons" opacity="0" />
        <g id="police-cri" opacity="0">
          <text x="3" y="4" textAnchor="middle" dominantBaseline="middle" className="cri-de-victoire-ombre" fontWeight="800" fontSize="34" fill="#FFC93C" stroke="#33304A" strokeWidth="9" strokeLinejoin="round" paintOrder="stroke" data-testid="ombre-du-cri-de-victoire">{cri}</text>
          <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" className="cri-de-victoire" fontWeight="800" fontSize="34" fill="#3450C8" stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round" paintOrder="stroke" data-testid="cri-de-victoire">{cri}</text>
        </g>
      </g>
    </svg>
  );
}
