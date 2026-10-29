import type { DessinDeMaison } from "./dessin-de-maison.ts";

/** Maison de l'univers Police. Source validée : docs/stories/98/planches/sources/maison-police-*.svg (généré, ne pas retoucher à la main). */
export const DESSIN_POLICE: DessinDeMaison = {
  ouverture: "horizontale",
  degrades: (p) => (
    <>
      <radialGradient id={`${p}-chaud`} cx="50%" cy="60%" r="70%">
        <stop offset="0" stopColor="#FFF0B0" />
        <stop offset="1" stopColor="#FFB347" />
      </radialGradient>
      <radialGradient id={`${p}-m`} cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor="#7C95F0" />
        <stop offset="1" stopColor="#3450C8" />
      </radialGradient>
      <radialGradient id={`${p}-r`} cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor="#8AA2DA" />
        <stop offset="1" stopColor="#41589E" />
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
        <rect x="44" y="72" width="112" height="70" rx="4" fill={`url(#${p}-m)`} stroke="#253B9C" strokeWidth="4" strokeLinejoin="round" />
        <path d="M32 78 L100 28 L168 78 Z" fill={`url(#${p}-r)`} stroke="#253B9C" strokeWidth="4" strokeLinejoin="round" />
        <rect x="52" y="92" width="20" height="20" rx="5" fill="#8FA3C4" stroke="#253B9C" strokeWidth="3" />
        <rect x="128" y="92" width="20" height="20" rx="5" fill="#8FA3C4" stroke="#253B9C" strokeWidth="3" />
        <path d="M100 74 L103.5 82 L112 83 L106 89 L107.5 97.5 L100 93.5 L92.5 97.5 L94 89 L88 83 L96.5 82 Z" transform="translate(0 -4)" fill="#FFC93C" stroke="#B8860B" strokeWidth="2.5" strokeLinejoin="round" />
      </>
    ),
    interieur: () => (
      <>
        <path d="M78 142 V114 Q78 104 88 104 H112 Q122 104 122 114 V142 Z" fill="#4A3F63" />
      </>
    ),
    porte: () => (
      <>
        <path d="M78 142 V114 Q78 104 88 104 H112 Q122 104 122 114 V142 Z" fill="#EEF2FF" stroke="#253B9C" strokeWidth="4" strokeLinejoin="round" />
        <path d="M100 106 V142" stroke="#253B9C" strokeWidth="2.5" opacity=".4" />
        <circle cx="110" cy="126" r="3.5" fill="#FFC93C" stroke="#B8860B" strokeWidth="1.5" />
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
        <rect x="44" y="72" width="112" height="70" rx="4" fill={`url(#${p}-m)`} stroke="#253B9C" strokeWidth="4" strokeLinejoin="round" />
        <path d="M32 78 L100 28 L168 78 Z" fill={`url(#${p}-r)`} stroke="#253B9C" strokeWidth="4" strokeLinejoin="round" />
        <rect x="52" y="92" width="20" height="20" rx="5" fill={`url(#${p}-chaud)`} stroke="#253B9C" strokeWidth="3" />
        <rect x="128" y="92" width="20" height="20" rx="5" fill={`url(#${p}-chaud)`} stroke="#253B9C" strokeWidth="3" />
        <path d="M100 74 L103.5 82 L112 83 L106 89 L107.5 97.5 L100 93.5 L92.5 97.5 L94 89 L88 83 L96.5 82 Z" transform="translate(0 -4)" fill="#FFC93C" stroke="#B8860B" strokeWidth="2.5" strokeLinejoin="round" />
      </>
    ),
    interieur: (p) => (
      <>
        <path d="M78 142 V114 Q78 104 88 104 H112 Q122 104 122 114 V142 Z" fill={`url(#${p}-chaud)`} />
      </>
    ),
    porte: () => (
      <>
        <path d="M78 142 V114 Q78 106 84 105 V142 Z" fill="#EEF2FF" stroke="#253B9C" strokeWidth="3" strokeLinejoin="round" />
      </>
    ),
  },
};
