import type { DessinDeMaison } from "./dessin-de-maison.ts";

/** Maison de l'univers Animaux de la forêt . Source validée : docs/stories/98/planches/sources/maison-animaux-*.svg (généré, ne pas retoucher à la main). */
export const DESSIN_ANIMAUX: DessinDeMaison = {
  ouverture: "horizontale",
  degrades: (p) => (
    <>
      <radialGradient id={`${p}-chaud`} cx="50%" cy="60%" r="70%">
        <stop offset="0" stopColor="#FFF0B0" />
        <stop offset="1" stopColor="#FFB347" />
      </radialGradient>
      <radialGradient id={`${p}-m`} cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor="#D9965A" />
        <stop offset="1" stopColor="#9A5E34" />
      </radialGradient>
      <radialGradient id={`${p}-f`} cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor="#7FD39A" />
        <stop offset="1" stopColor="#3F9A63" />
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
        <path d="M56 142 Q52 96 62 54 Q100 42 138 54 Q148 96 144 142 Z" fill={`url(#${p}-m)`} stroke="#5E3416" strokeWidth="4" strokeLinejoin="round" />
        <path d="M70 70 Q66 100 70 130 M130 72 Q134 100 130 130" fill="none" stroke="#5E3416" strokeWidth="3" strokeLinecap="round" opacity=".45" />
        <g fill={`url(#${p}-f)`} stroke="#2E7E52" strokeWidth="3">
          <circle cx="68" cy="48" r="22" />
          <circle cx="132" cy="48" r="22" />
          <circle cx="100" cy="34" r="27" />
          <circle cx="100" cy="52" r="20" />
        </g>
        <circle cx="100" cy="76" r="8" fill="#8FA3C4" stroke="#5E3416" strokeWidth="3" />
      </>
    ),
    interieur: () => (
      <>
        <circle cx="100" cy="118" r="22" fill="#4A3F63" />
      </>
    ),
    porte: () => (
      <>
        <circle cx="100" cy="118" r="22" fill="#C9803F" stroke="#5E3416" strokeWidth="4" />
        <circle cx="100" cy="118" r="14" fill="none" stroke="#5E3416" strokeWidth="2.5" opacity=".5" />
        <circle cx="111" cy="120" r="3.5" fill="#FFC93C" stroke="#B8860B" strokeWidth="1.5" />
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
        <path d="M56 142 Q52 96 62 54 Q100 42 138 54 Q148 96 144 142 Z" fill={`url(#${p}-m)`} stroke="#5E3416" strokeWidth="4" strokeLinejoin="round" />
        <path d="M70 70 Q66 100 70 130 M130 72 Q134 100 130 130" fill="none" stroke="#5E3416" strokeWidth="3" strokeLinecap="round" opacity=".45" />
        <g fill={`url(#${p}-f)`} stroke="#2E7E52" strokeWidth="3">
          <circle cx="68" cy="48" r="22" />
          <circle cx="132" cy="48" r="22" />
          <circle cx="100" cy="34" r="27" />
          <circle cx="100" cy="52" r="20" />
        </g>
        <circle cx="100" cy="76" r="8" fill={`url(#${p}-chaud)`} stroke="#5E3416" strokeWidth="3" />
      </>
    ),
    interieur: (p) => (
      <>
        <circle cx="100" cy="118" r="22" fill={`url(#${p}-chaud)`} />
      </>
    ),
    porte: () => (
      <>
        <ellipse cx="80" cy="118" rx="6" ry="22" fill="#C9803F" stroke="#5E3416" strokeWidth="3" />
      </>
    ),
  },
};
