import type { DessinDeMaison } from "./dessin-de-maison.ts";

/** Maison de l'univers Danse. Source validée : docs/stories/98/planches/sources/maison-danse-*.svg (généré, ne pas retoucher à la main). */
export const DESSIN_DANSE: DessinDeMaison = {
  ouverture: "horizontale",
  degrades: (p) => (
    <>
      <radialGradient id={`${p}-chaud`} cx="50%" cy="60%" r="70%">
        <stop offset="0" stopColor="#FFF0B0" />
        <stop offset="1" stopColor="#FFB347" />
      </radialGradient>
      <radialGradient id={`${p}-m`} cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor="#FFD3EC" />
        <stop offset="1" stopColor="#DE93C8" />
      </radialGradient>
      <radialGradient id={`${p}-d`} cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor="#A978E8" />
        <stop offset="1" stopColor="#5A1F9E" />
      </radialGradient>
    </>
  ),
  fermee: {
    sol: () => (
      <>
        <ellipse cx="100" cy="144" rx="84" ry="7" fill="#6CBF84" />
        <ellipse cx="100" cy="142" rx="80" ry="5" fill="#8FD39B" />
      </>
    ),
    maison: (p) => (
      <>
        <rect x="40" y="78" width="120" height="64" rx="3" fill={`url(#${p}-m)`} stroke="#5A1F9E" strokeWidth="4" strokeLinejoin="round" />
        <path d="M30 80 L100 26 L170 80 Z" fill={`url(#${p}-d)`} stroke="#5A1F9E" strokeWidth="4" strokeLinejoin="round" />
        <rect x="44" y="74" width="112" height="9" rx="3" fill="#FFC93C" stroke="#B8860B" strokeWidth="2.5" />
        <circle cx="100" cy="58" r="9" fill="#FFC93C" stroke="#B8860B" strokeWidth="2.5" />
        <path d="M48 118 V104 Q55 94 62 104 V118 Z" fill="#8FA3C4" stroke="#5A1F9E" strokeWidth="3" strokeLinejoin="round" />
        <path d="M138 118 V104 Q145 94 152 104 V118 Z" fill="#8FA3C4" stroke="#5A1F9E" strokeWidth="3" strokeLinejoin="round" />
      </>
    ),
    interieur: () => (
      <>
        <path d="M70 142 V114 Q70 98 100 98 Q130 98 130 114 V142 Z" fill="#4A3F63" />
      </>
    ),
    porte: () => (
      <>
        <path d="M70 142 V114 Q70 98 100 98 Q130 98 130 114 V142 Z" fill="#C03E6E" stroke="#8E2250" strokeWidth="4" strokeLinejoin="round" />
        <path d="M84 102 Q80 122 84 142 M100 98 Q96 122 100 142 M116 102 Q120 122 116 142" fill="none" stroke="#8E2250" strokeWidth="2.5" opacity=".5" />
      </>
    ),
  },
  ouverte: {
    sol: () => (
      <>
        <ellipse cx="100" cy="144" rx="84" ry="7" fill="#6CBF84" />
        <ellipse cx="100" cy="142" rx="80" ry="5" fill="#8FD39B" />
        <ellipse cx="100" cy="146" rx="30" ry="6" fill="#FFC93C" opacity=".55" />
      </>
    ),
    maison: (p) => (
      <>
        <rect x="40" y="78" width="120" height="64" rx="3" fill={`url(#${p}-m)`} stroke="#5A1F9E" strokeWidth="4" strokeLinejoin="round" />
        <path d="M30 80 L100 26 L170 80 Z" fill={`url(#${p}-d)`} stroke="#5A1F9E" strokeWidth="4" strokeLinejoin="round" />
        <rect x="44" y="74" width="112" height="9" rx="3" fill="#FFC93C" stroke="#B8860B" strokeWidth="2.5" />
        <circle cx="100" cy="58" r="9" fill="#FFC93C" stroke="#B8860B" strokeWidth="2.5" />
        <path d="M48 118 V104 Q55 94 62 104 V118 Z" fill={`url(#${p}-chaud)`} stroke="#5A1F9E" strokeWidth="3" strokeLinejoin="round" />
        <path d="M138 118 V104 Q145 94 152 104 V118 Z" fill={`url(#${p}-chaud)`} stroke="#5A1F9E" strokeWidth="3" strokeLinejoin="round" />
      </>
    ),
    interieur: (p) => (
      <>
        <path d="M70 142 V114 Q70 98 100 98 Q130 98 130 114 V142 Z" fill={`url(#${p}-chaud)`} />
      </>
    ),
    porte: () => (
      <>
        <path d="M70 142 V114 Q70 100 80 99 Q92 112 88 142 Z" fill="#C03E6E" stroke="#8E2250" strokeWidth="3" strokeLinejoin="round" />
        <path d="M130 142 V114 Q130 100 120 99 Q108 112 112 142 Z" fill="#C03E6E" stroke="#8E2250" strokeWidth="3" strokeLinejoin="round" />
      </>
    ),
  },
};
