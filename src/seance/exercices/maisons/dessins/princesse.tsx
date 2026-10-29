import type { DessinDeMaison } from "./dessin-de-maison.ts";

/** Maison de l'univers Princesses et fées. Source validée : docs/stories/98/planches/sources/maison-princesse-*.svg (généré, ne pas retoucher à la main). */
export const DESSIN_PRINCESSE: DessinDeMaison = {
  ouverture: "horizontale",
  degrades: (p) => (
    <>
      <radialGradient id={`${p}-chaud`} cx="50%" cy="60%" r="70%">
        <stop offset="0" stopColor="#FFF0B0" />
        <stop offset="1" stopColor="#FFB347" />
      </radialGradient>
      <radialGradient id={`${p}-m`} cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor="#FFD3E8" />
        <stop offset="1" stopColor="#E58FC0" />
      </radialGradient>
      <radialGradient id={`${p}-t`} cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor="#EFCDF8" />
        <stop offset="1" stopColor="#C48BE0" />
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
        <path d="M38 142 V84 H122 V142 Z" fill={`url(#${p}-m)`} stroke="#7C2690" strokeWidth="4" strokeLinejoin="round" />
        <g fill={`url(#${p}-m)`} stroke="#7C2690" strokeWidth="3" strokeLinejoin="round">
          <rect x="38" y="72" width="12" height="12" />
          <rect x="56" y="72" width="12" height="12" />
          <rect x="74" y="72" width="12" height="12" />
          <rect x="92" y="72" width="12" height="12" />
        </g>
        <rect x="116" y="50" width="46" height="92" fill={`url(#${p}-t)`} stroke="#7C2690" strokeWidth="4" strokeLinejoin="round" />
        <path d="M110 54 L139 14 L168 54 Z" fill="#A23BB8" stroke="#7C2690" strokeWidth="4" strokeLinejoin="round" />
        <path d="M139 14 V2" stroke="#5E3416" strokeWidth="3" strokeLinecap="round" />
        <path d="M139 2 L155 7 L139 12 Z" fill="#FFC93C" stroke="#B8860B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M130 100 V86 Q139 74 148 86 V100 Z" fill="#8FA3C4" stroke="#7C2690" strokeWidth="3" strokeLinejoin="round" />
      </>
    ),
    interieur: () => (
      <>
        <path d="M60 142 V118 Q60 100 78 100 Q96 100 96 118 V142 Z" fill="#4A3F63" />
      </>
    ),
    porte: () => (
      <>
        <path d="M60 142 V118 Q60 100 78 100 Q96 100 96 118 V142 Z" fill="#8E5BD0" stroke="#7C2690" strokeWidth="4" strokeLinejoin="round" />
        <path d="M78 102 V142" stroke="#7C2690" strokeWidth="2.5" opacity=".5" />
        <circle cx="88" cy="126" r="3.5" fill="#FFC93C" stroke="#B8860B" strokeWidth="1.5" />
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
        <path d="M38 142 V84 H122 V142 Z" fill={`url(#${p}-m)`} stroke="#7C2690" strokeWidth="4" strokeLinejoin="round" />
        <g fill={`url(#${p}-m)`} stroke="#7C2690" strokeWidth="3" strokeLinejoin="round">
          <rect x="38" y="72" width="12" height="12" />
          <rect x="56" y="72" width="12" height="12" />
          <rect x="74" y="72" width="12" height="12" />
          <rect x="92" y="72" width="12" height="12" />
        </g>
        <rect x="116" y="50" width="46" height="92" fill={`url(#${p}-t)`} stroke="#7C2690" strokeWidth="4" strokeLinejoin="round" />
        <path d="M110 54 L139 14 L168 54 Z" fill="#A23BB8" stroke="#7C2690" strokeWidth="4" strokeLinejoin="round" />
        <path d="M139 14 V2" stroke="#5E3416" strokeWidth="3" strokeLinecap="round" />
        <path d="M139 2 L155 7 L139 12 Z" fill="#FFC93C" stroke="#B8860B" strokeWidth="2" strokeLinejoin="round" />
        <path d="M130 100 V86 Q139 74 148 86 V100 Z" fill={`url(#${p}-chaud)`} stroke="#7C2690" strokeWidth="3" strokeLinejoin="round" />
      </>
    ),
    interieur: (p) => (
      <>
        <path d="M60 142 V118 Q60 100 78 100 Q96 100 96 118 V142 Z" fill={`url(#${p}-chaud)`} />
      </>
    ),
    porte: () => (
      <>
        <path d="M60 142 V118 Q60 104 68 101 V142 Z" fill="#8E5BD0" stroke="#7C2690" strokeWidth="3" strokeLinejoin="round" />
      </>
    ),
  },
};
