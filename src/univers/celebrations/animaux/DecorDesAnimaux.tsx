import type { RefObject } from "react";

type Props = { readonly racine: RefObject<SVGSVGElement | null>; readonly cri: string };

/**
 * Le décor fixe de la scène (ciel clair, soleil, nuages, collines, grand arbre, prairie, fleurs, herbe) et les groupes que le moteur remplit à chaque image.
 * Les groupes à identifiant sont vides ici : React n'y touche pas, c'est le moteur qui les dessine.
 */
export function DecorDesAnimaux({ racine, cri }: Props) {
  return (
    <svg ref={racine} viewBox="0 0 360 450" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="animaux-ciel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A9DAFF" />
          <stop offset=".6" stopColor="#BFE5FF" />
          <stop offset="1" stopColor="#FFF3DF" />
        </linearGradient>
        <linearGradient id="animaux-prairie" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#A8D9A4" />
          <stop offset="1" stopColor="#6CBF84" />
        </linearGradient>
        <radialGradient id="animaux-noisette-or" cx=".35" cy=".3" r=".75">
          <stop offset="0" stopColor="#FFF1A8" />
          <stop offset=".5" stopColor="#FFC93C" />
          <stop offset="1" stopColor="#D99A12" />
        </radialGradient>
        <radialGradient id="animaux-lueur" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#FFF1A8" stopOpacity=".75" />
          <stop offset="1" stopColor="#FFF1A8" stopOpacity="0" />
        </radialGradient>
        <clipPath id="animaux-clip-oeil"><ellipse rx="9" ry="11" /></clipPath>
      </defs>
      <rect width="360" height="450" fill="url(#animaux-ciel)" />
      <circle cx="68" cy="66" r="24" fill="#FFE38A" stroke="#F5C84A" strokeWidth="3" />
      <g fill="#FFFFFF" stroke="#D9ECFA" strokeWidth="2.5" strokeLinejoin="round">
        <g className="nuage"><path d="M150 86 q-6 -18 14 -18 q6 -14 22 -8 q16 -6 20 10 q14 2 8 16 Z" /></g>
        <g className="nuage lent" opacity=".85"><path d="M440 130 q-4 -12 10 -12 q5 -9 15 -5 q11 -4 14 7 q9 2 5 10 Z" /></g>
      </g>
      <path d="M0 280 C70 250 140 268 200 262 C260 256 310 238 360 256 V450 H0 Z" fill="#A8D9A4" />
      <path d="M0 310 C60 296 120 312 180 304 C250 294 310 302 360 296 V450 H0 Z" fill="#8FD08E" />
      <g>
        <path d="M46 400 Q52 300 54 230 H86 Q92 300 100 400 Z" fill="#8E5A2B" stroke="#33304A" strokeWidth="3.5" strokeLinejoin="round" />
        <path d="M62 250 Q60 320 64 390 M78 240 Q80 320 86 392" fill="none" stroke="#6B4226" strokeWidth="3" opacity=".55" />
        <g stroke="#33304A" strokeWidth="3.5" strokeLinejoin="round">
          <circle cx="70" cy="190" r="62" fill="#2E7E52" />
          <circle cx="24" cy="222" r="38" fill="#3F9A63" />
          <circle cx="118" cy="214" r="42" fill="#3F9A63" />
          <circle cx="52" cy="140" r="36" fill="#4FAE6E" />
          <circle cx="100" cy="156" r="34" fill="#4FAE6E" />
        </g>
        <circle cx="42" cy="150" r="13" fill="#8FD98A" opacity=".8" />
        <circle cx="96" cy="174" r="9" fill="#8FD98A" opacity=".7" />
        <g id="animaux-noisettes-arbre" />
      </g>
      <path d="M0 384 Q180 372 360 384 V450 H0 Z" fill="url(#animaux-prairie)" />
      <path d="M0 386 Q90 376 180 382 Q270 388 360 380" fill="none" stroke="#3F9A63" strokeWidth="3" />
      <g id="animaux-noisettes-herbe" />
      <g stroke="#33304A" strokeWidth="1.4">
        <g transform="translate(300 404)"><path d="M0 0 V14" stroke="#2E7E52" strokeWidth="2" /><circle r="5" fill="#FF8FA8" /><circle r="2" fill="#FFC93C" /></g>
        <g transform="translate(335 426)"><path d="M0 0 V12" stroke="#2E7E52" strokeWidth="2" /><circle r="4.5" fill="#9FD3FF" /><circle r="1.8" fill="#FFC93C" /></g>
        <g transform="translate(26 420)"><path d="M0 0 V12" stroke="#2E7E52" strokeWidth="2" /><circle r="4.5" fill="#FFFFFF" /><circle r="1.8" fill="#FFC93C" /></g>
      </g>
      <ellipse id="animaux-ombre-sol" cx="190" cy="398" rx="46" ry="9" fill="#2E7E52" opacity=".28" />
      <g id="animaux-noisette-vol" />
      <g id="animaux-noisette" />
      <g id="animaux-noisette-devant" />
      <g id="animaux-jonglage" />
      <g id="animaux-miettes" fill="#D99A12" stroke="#33304A" strokeWidth="1" />
      <g id="animaux-crunch" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0" />
      <g id="animaux-etoiles" opacity="0" fill="#FFC93C" stroke="#33304A" strokeWidth="1.8" strokeLinejoin="round" />
      <g className="animaux-herbe" fill="#6CBF84" stroke="#2E7E52" strokeWidth="1.5">
        <path d="M14 450 q2 -30 10 -44 q2 24 -4 44 Z" />
        <path d="M40 450 q-4 -26 4 -40 q6 18 2 40 Z" />
        <path d="M120 450 q2 -24 10 -36 q0 20 -4 36 Z" />
        <path d="M250 450 q-4 -28 6 -42 q6 22 0 42 Z" />
        <path d="M296 450 q2 -22 10 -34 q0 18 -4 34 Z" />
        <path d="M340 450 q-4 -26 4 -40 q6 18 2 40 Z" />
        <path d="M190 450 q2 -18 8 -28 q0 16 -3 28 Z" />
      </g>
      <g transform="translate(180 60)">
        <g id="animaux-rayons" opacity="0" />
        <g id="animaux-cri" opacity="0">
          <text x="3" y="4" textAnchor="middle" dominantBaseline="middle" className="cri-de-victoire-ombre" fontWeight="800" fontSize="56" fill="#FFC93C" stroke="#33304A" strokeWidth="12" strokeLinejoin="round" paintOrder="stroke" data-testid="ombre-du-cri-de-victoire">{cri}</text>
          <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" className="cri-de-victoire" fontWeight="800" fontSize="56" fill="#C9452F" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" paintOrder="stroke" data-testid="cri-de-victoire">{cri}</text>
        </g>
      </g>
    </svg>
  );
}
