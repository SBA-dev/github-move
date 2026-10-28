import type { DessinDeMaison } from "./dessin-de-maison.ts";

/** Maison de l'univers Pompiers : sa porte se lève. Source validée : docs/stories/98/planches/sources/maison-pompier-*.svg (généré, ne pas retoucher à la main). */
export const DESSIN_POMPIER: DessinDeMaison = {
  ouverture: "verticale",
  degrades: (p) => (
    <>
      <radialGradient id={`${p}-chaud`} cx="50%" cy="60%" r="70%">
        <stop offset="0" stopColor="#FFF0B0" />
        <stop offset="1" stopColor="#FFB347" />
      </radialGradient>
      <radialGradient id={`${p}-m`} cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor="#F28670" />
        <stop offset="1" stopColor="#C2341B" />
      </radialGradient>
      <radialGradient id={`${p}-c`} cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor="#FFE07A" />
        <stop offset="1" stopColor="#FFC93C" />
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
        <rect x="36" y="66" width="128" height="76" rx="4" fill={`url(#${p}-m)`} stroke="#931F0C" strokeWidth="4" strokeLinejoin="round" />
        <path d="M54 68 L100 30 L146 68 Z" fill="#B5301A" stroke="#931F0C" strokeWidth="4" strokeLinejoin="round" />
        <path d="M92 56 Q92 44 100 44 Q108 44 108 56 L111 60 H89 Z" fill={`url(#${p}-c)`} stroke="#B8860B" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="100" cy="63" r="3" fill="#B8860B" />
        <path d="M100 44 V38" stroke="#B8860B" strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
    interieur: () => (
      <>
        <path d="M58 142 V108 Q58 92 74 92 H126 Q142 92 142 108 V142 Z" fill="#4A3F63" />
      </>
    ),
    porte: () => (
      <>
        <path d="M58 142 V108 Q58 92 74 92 H126 Q142 92 142 108 V142 Z" fill="#B9C8DC" stroke="#931F0C" strokeWidth="4" strokeLinejoin="round" />
        <path d="M58 102 H142" stroke="#5F7391" strokeWidth="2.5" />
        <path d="M58 112 H142" stroke="#5F7391" strokeWidth="2.5" />
        <path d="M58 122 H142" stroke="#5F7391" strokeWidth="2.5" />
        <path d="M58 132 H142" stroke="#5F7391" strokeWidth="2.5" />
        <path d="M58 142 H142" stroke="#5F7391" strokeWidth="2.5" />
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
        <rect x="36" y="66" width="128" height="76" rx="4" fill={`url(#${p}-m)`} stroke="#931F0C" strokeWidth="4" strokeLinejoin="round" />
        <path d="M54 68 L100 30 L146 68 Z" fill="#B5301A" stroke="#931F0C" strokeWidth="4" strokeLinejoin="round" />
        <path d="M92 56 Q92 44 100 44 Q108 44 108 56 L111 60 H89 Z" fill={`url(#${p}-c)`} stroke="#B8860B" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="100" cy="63" r="3" fill="#B8860B" />
        <path d="M100 44 V38" stroke="#B8860B" strokeWidth="2.5" strokeLinecap="round" />
      </>
    ),
    interieur: (p) => (
      <>
        <path d="M58 142 V108 Q58 92 74 92 H126 Q142 92 142 108 V142 Z" fill={`url(#${p}-chaud)`} />
      </>
    ),
    porte: (p) => (
      <>
        <clipPath id={`${p}-cp`}>
          <rect x="50" y="88" width="100" height="14" />
        </clipPath>
        <g clipPath={`url(#${p}-cp)`}>
          <path d="M58 142 V108 Q58 92 74 92 H126 Q142 92 142 108 V142 Z" fill="#B9C8DC" />
        </g>
        <path d="M58 102 H142" stroke="#5F7391" strokeWidth="3" />
      </>
    ),
  },
};
