import type { RefObject } from "react";

type Props = { readonly racine: RefObject<SVGSVGElement | null>; readonly cri: string };

/**
 * Le décor fixe de la scène (ciel, collines, pelouse, but) et les groupes que le moteur remplit à chaque image.
 * Les groupes à identifiant sont vides ici : React n'y touche pas, c'est le moteur qui les dessine.
 */
export function DecorDesSports({ racine, cri }: Props) {
  return (
    <svg ref={racine} viewBox="0 0 360 450" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="sports-ciel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#8FCBFF" />
          <stop offset=".6" stopColor="#BDE3FF" />
          <stop offset="1" stopColor="#E8F6FF" />
        </linearGradient>
        <radialGradient id="sports-soleil" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#FFFBE6" />
          <stop offset=".45" stopColor="#FFF0A0" />
          <stop offset="1" stopColor="#FFF0A0" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="sports-pelouse" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6FD170" />
          <stop offset="1" stopColor="#2F9A4C" />
        </linearGradient>
        <clipPath id="sports-clip-oeil"><ellipse rx="7.4" ry="9.6" /></clipPath>
        <clipPath id="sports-clip-bouche"><path d="M-11 11 Q0 27 11 11 Z" /></clipPath>
      </defs>

      <rect width="360" height="450" fill="url(#sports-ciel)" />
      <circle cx="62" cy="64" r="64" fill="url(#sports-soleil)" />
      <circle cx="62" cy="64" r="22" fill="#FFF7C2" stroke="#F7D86A" strokeWidth="3" />
      <g fill="#FFFFFF" stroke="#D4E8F7" strokeWidth="2.5" strokeLinejoin="round">
        <g className="nuage"><path d="M232 78 q-6 -18 14 -18 q6 -14 22 -8 q16 -6 20 10 q14 2 8 16 Z" /></g>
        <g className="nuage lent" opacity=".85"><path d="M420 50 q-4 -14 12 -14 q6 -10 18 -6 q12 -4 16 8 q10 2 6 12 Z" /></g>
      </g>
      <path d="M0 200 C60 178 120 186 180 192 C240 198 300 176 360 190 V222 H0 Z" fill="#BFD7EE" />
      <path d="M0 212 C70 194 140 206 200 202 C260 198 320 188 360 206 V224 H0 Z" fill="#A5DE8F" stroke="#7CC46E" strokeWidth="2" />
      <g stroke="#33304A" strokeWidth="2" strokeLinejoin="round">
        <rect x="26" y="196" width="5" height="18" rx="2" fill="#8E5A2B" /><circle cx="28.5" cy="190" r="13" fill="#2E9F4E" />
        <rect x="318" y="192" width="5" height="22" rx="2" fill="#8E5A2B" /><circle cx="320.5" cy="186" r="15" fill="#2E9F4E" />
        <rect x="96" y="204" width="4" height="12" rx="2" fill="#8E5A2B" /><circle cx="98" cy="199" r="9" fill="#2E9F4E" />
        <rect x="258" y="206" width="4" height="12" rx="2" fill="#8E5A2B" /><circle cx="260" cy="200" r="9" fill="#2E9F4E" />
      </g>
      <rect x="0" y="216" width="360" height="234" fill="url(#sports-pelouse)" />
      <g fill="#FFFFFF" opacity=".12">
        <rect x="0" y="228" width="360" height="12" /><rect x="0" y="256" width="360" height="18" />
        <rect x="0" y="300" width="360" height="28" /><rect x="0" y="366" width="360" height="44" />
      </g>
      <g fill="none" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" opacity=".9">
        <path d="M60 312 H300" /><path d="M84 312 L56 352 H304 L276 312" /><path d="M0 436 Q180 452 360 436" opacity=".6" />
      </g>

      <g>
        <path d="M117.8 305.7 V239 H242.2 V305.7" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity=".95" />
        <g id="filet-fond" fill="none" stroke="#FFFFFF" strokeWidth="1.3" opacity=".8" />
        <g id="ballon-couche" />
        <g id="filet-cotes" fill="none" stroke="#FFFFFF" strokeWidth="1.1" opacity=".55" />
        <path d="M105 232 L117.8 239 M255 232 L242.2 239 M105 312 L117.8 305.7 M255 312 L242.2 305.7" fill="none" stroke="#FFFFFF" strokeWidth="4" strokeLinecap="round" opacity=".95" />
        <g fill="none" stroke="#33304A" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round"><path d="M105 312 V232 H255" /></g>
        <g fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"><path d="M105 312 V232 H255" /></g>
        <path d="M255 232 V312" fill="none" stroke="#33304A" strokeWidth="12" strokeLinecap="round" />
        <path d="M255 232 V312" fill="none" stroke="#FFFFFF" strokeWidth="7" strokeLinecap="round" />
      </g>
      <g id="impact" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0" />

      <ellipse id="ombre-leo" cx="70" cy="420" rx="34" ry="8" fill="#15502B" opacity=".25" />
      <g id="poussiere" fill="#EAF6D2" stroke="#BFE39C" strokeWidth="1.5" />
      <g id="vitesse" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0" />
      <g id="leo" />
      <g id="etoiles" opacity="0" fill="#FFC93C" stroke="#33304A" strokeWidth="1.8" strokeLinejoin="round" />
      <g id="gouttes" opacity="0" fill="#9FD3FF" stroke="#33304A" strokeWidth="1.5" />

      <g transform="translate(180 112)">
        <g id="rayons" opacity="0" />
        <g id="cri" opacity="0">
          <text x="3" y="4" textAnchor="middle" dominantBaseline="middle" className="cri-de-victoire-ombre" fontWeight="800" fontSize="70" fill="#FFC93C" stroke="#33304A" strokeWidth="12" strokeLinejoin="round" paintOrder="stroke" data-testid="ombre-du-cri-de-victoire">{cri}</text>
          <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" className="cri-de-victoire" fontWeight="800" fontSize="70" fill="#1F63D8" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" paintOrder="stroke" data-testid="cri-de-victoire">{cri}</text>
        </g>
      </g>
    </svg>
  );
}
