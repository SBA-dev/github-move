import type { DessinDeMaison } from "./dessin-de-maison.ts";

/** Maison de l'univers Sports : stade, variante A validée par le PO. Source validée : docs/stories/98/planches/sources/maison-sports-stade-a-*.svg (généré, ne pas retoucher à la main). */
export const DESSIN_SPORTS: DessinDeMaison = {
  ouverture: "horizontale",
  degrades: (p) => (
    <>
      <radialGradient id={`${p}-chaud`} cx="50%" cy="60%" r="70%">
        <stop offset="0" stopColor="#FFF0B0" />
        <stop offset="1" stopColor="#FFB347" />
      </radialGradient>
      <radialGradient id={`${p}-f`} cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor="#FFFFFF" />
        <stop offset="1" stopColor="#DCE8F7" />
      </radialGradient>
      <radialGradient id={`${p}-t`} cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor="#4C8FF5" />
        <stop offset="1" stopColor="#164BA8" />
      </radialGradient>
      <radialGradient id={`${p}-p`} cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor="#EE8A5E" />
        <stop offset="1" stopColor="#C4532B" />
      </radialGradient>
      <radialGradient id={`${p}-v`} cx="35%" cy="30%" r="80%">
        <stop offset="0" stopColor="#8FD39B" />
        <stop offset="1" stopColor="#4FB37A" />
      </radialGradient>
    </>
  ),
  fermee: {
    sol: (p) => (
      <>
        <ellipse cx="100" cy="100" rx="92" ry="44" fill={`url(#${p}-p)`} stroke="#8C3A1E" strokeWidth="4" />
        <ellipse cx="100" cy="100" rx="83" ry="35.2" fill="none" stroke="#FFFFFF" strokeWidth="1.8" opacity=".9" />
        <ellipse cx="100" cy="100" rx="74" ry="26.4" fill="none" stroke="#FFFFFF" strokeWidth="1.8" opacity=".9" />
        <ellipse cx="100" cy="100" rx="65" ry="18.5" fill={`url(#${p}-v)`} stroke="#FFFFFF" strokeWidth="2" />
      </>
    ),
    maison: (p) => (
      <>
        <rect x="68" y="92" width="64" height="50" fill={`url(#${p}-f)`} stroke="#164BA8" strokeWidth="4" strokeLinejoin="round" />
        <rect x="70" y="134" width="60" height="6" fill="#1F63D8" />
        <path d="M56 94 L100 58 L144 94 Z" fill={`url(#${p}-t)`} stroke="#12204E" strokeWidth="4" strokeLinejoin="round" />
      </>
    ),
    interieur: () => (
      <>
        <path d="M86 142 V120.0 Q86 106 100.0 106 Q114 106 114 120.0 V142 Z" fill="#4A3F63" />
      </>
    ),
    porte: () => (
      <>
        <path d="M86 142 V120.0 Q86 106 100.0 106 Q114 106 114 120.0 V142 Z" fill="#4FB37A" stroke="#2E7E52" strokeWidth="4" strokeLinejoin="round" />
        <path d="M100.0 108 V142" stroke="#5E3416" strokeWidth="2.5" opacity=".45" />
        <circle cx="106.0" cy="130.0" r="3" fill="#FFFFFF" stroke="#5E3416" strokeWidth="1.5" />
      </>
    ),
  },
  ouverte: {
    sol: (p) => (
      <>
        <ellipse cx="100" cy="100" rx="92" ry="44" fill={`url(#${p}-p)`} stroke="#8C3A1E" strokeWidth="4" />
        <ellipse cx="100" cy="100" rx="83" ry="35.2" fill="none" stroke="#FFFFFF" strokeWidth="1.8" opacity=".9" />
        <ellipse cx="100" cy="100" rx="74" ry="26.4" fill="none" stroke="#FFFFFF" strokeWidth="1.8" opacity=".9" />
        <ellipse cx="100" cy="100" rx="65" ry="18.5" fill={`url(#${p}-v)`} stroke="#FFFFFF" strokeWidth="2" />
        <ellipse cx="100" cy="146" rx="30" ry="6" fill="#FFC93C" opacity=".55" />
      </>
    ),
    maison: (p) => (
      <>
        <rect x="68" y="92" width="64" height="50" fill={`url(#${p}-f)`} stroke="#164BA8" strokeWidth="4" strokeLinejoin="round" />
        <rect x="70" y="134" width="60" height="6" fill="#1F63D8" />
        <path d="M56 94 L100 58 L144 94 Z" fill={`url(#${p}-t)`} stroke="#12204E" strokeWidth="4" strokeLinejoin="round" />
      </>
    ),
    interieur: (p) => (
      <>
        <path d="M86 142 V120.0 Q86 106 100.0 106 Q114 106 114 120.0 V142 Z" fill={`url(#${p}-chaud)`} />
      </>
    ),
    porte: () => (
      <>
        <path d="M86 142 V120.0 Q86 106 91 106 V142 Z" fill="#4FB37A" stroke="#2E7E52" strokeWidth="3" strokeLinejoin="round" />
      </>
    ),
  },
};
