import type { RefObject } from "react";

type Props = { readonly racine: RefObject<SVGSVGElement | null>; readonly cri: string };

const ETOILES_PALES = [[40, 40, 1.8], [120, 24, 1.4], [210, 50, 2], [300, 30, 1.5], [340, 90, 1.3], [70, 110, 1.2], [260, 110, 1.6]] as const;
const FLEURS_DE_LA_PRAIRIE = [[60, 404, "#FFFFFF"], [110, 420, "#FF8FB8"], [300, 410, "#9FD3FF"], [330, 432, "#FFC93C"], [20, 436, "#FF8FB8"], [240, 436, "#FFFFFF"], [200, 404, "#FFC93C"]] as const;
const LUCIOLES = [[50, 240], [120, 330], [300, 250], [330, 350], [200, 330], [90, 160], [270, 160], [160, 220]] as const;
const PETALES_D_UNE_FLEUR = [0, 1, 2, 3, 4].map((k) => ({ k, x: Math.round(Math.cos(k * 1.2566) * 42) / 10, y: Math.round(Math.sin(k * 1.2566) * 42) / 10 }));

/**
 * Le décor fixe de la scène (jardin féerique : ciel mauve, petit château rose et violet au loin, collines, prairie fleurie)
 * et les groupes que le moteur remplit à chaque image. Les groupes à identifiant sont vides ici : React n'y touche pas.
 * Les lucioles et les nuages ne bougent que si les mouvements ne sont pas réduits (styles.css).
 */
export function DecorDesPrincesses({ racine, cri }: Props) {
  return (
    <svg ref={racine} viewBox="0 0 360 450" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="princesse-ciel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9C6FF" />
          <stop offset=".55" stopColor="#E7D9FF" />
          <stop offset="1" stopColor="#FFE6F1" />
        </linearGradient>
        <linearGradient id="princesse-prairie" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F2C9E4" />
          <stop offset="1" stopColor="#D8A6E3" />
        </linearGradient>
        <radialGradient id="princesse-lueur" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#FFF1A8" stopOpacity=".8" />
          <stop offset="1" stopColor="#FFF1A8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="princesse-aile" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".9" />
          <stop offset="1" stopColor="#9CCFFF" stopOpacity=".6" />
        </linearGradient>
        <clipPath id="princesse-clip-oeil"><ellipse rx="9" ry="11" /></clipPath>
        <clipPath id="princesse-clip-bouche"><path d="M-11 0 Q0 20 11 0 Z" /></clipPath>
      </defs>

      <rect width="360" height="450" fill="url(#princesse-ciel)" />
      <g fill="#FFFFFF" opacity=".55">
        {ETOILES_PALES.map(([x, y, r]) => <circle key={`${x}-${y}`} cx={x} cy={y} r={r} />)}
      </g>
      <g fill="#FFFFFF" stroke="#E6D4F5" strokeWidth="2.5" strokeLinejoin="round">
        <path className="nuage" d="M70 92 q-6 -18 14 -18 q6 -14 22 -8 q16 -6 20 10 q14 2 8 16 Z" />
        <path className="nuage lent" d="M430 60 q-4 -12 10 -12 q5 -9 15 -5 q11 -4 14 7 q9 2 5 10 Z" opacity=".85" />
      </g>
      <path d="M0 300 C60 262 140 272 200 268 C260 262 310 250 360 266 V450 H0 Z" fill="#D8A6E3" />
      <g transform="translate(262 196)" stroke="#33304A" strokeWidth="2.4" strokeLinejoin="round">
        <rect x="-30" y="26" width="60" height="50" fill="#F2C9E4" /><rect x="-42" y="10" width="20" height="66" fill="#E8B5DC" /><rect x="22" y="10" width="20" height="66" fill="#E8B5DC" /><rect x="-9" y="-6" width="18" height="34" fill="#F2C9E4" />
        <path d="M-44 10 L-32 -14 L-20 10 Z M20 10 L32 -14 L44 10 Z M-11 -6 L0 -28 L11 -6 Z" fill="#A97FD6" />
        <path d="M0 -28 V-40" stroke="#33304A" strokeWidth="2" /><path d="M0 -40 l10 4 l-10 4 Z" fill="#FFC93C" />
        <path d="M-6 76 V58 Q0 50 6 58 V76 Z" fill="#A23BB8" />
        <g fill="#FFF3B0"><rect x="-36" y="26" width="7" height="10" rx="2" /><rect x="29" y="26" width="7" height="10" rx="2" /><rect x="-18" y="38" width="8" height="10" rx="2" /><rect x="10" y="38" width="8" height="10" rx="2" /><rect x="-3" y="4" width="6" height="8" rx="2" /></g>
      </g>
      <g stroke="#33304A" strokeWidth="2.5" strokeLinejoin="round" fill="#7E56BC"><circle cx="40" cy="292" r="24" /><circle cx="22" cy="306" r="16" /><circle cx="332" cy="300" r="20" /><circle cx="350" cy="312" r="14" /></g>
      <path d="M0 322 C70 304 140 318 200 310 C270 300 320 310 360 304 V450 H0 Z" fill="#F2C9E4" />
      <path d="M0 384 Q180 370 360 384 V450 H0 Z" fill="url(#princesse-prairie)" />
      <path d="M0 386 Q90 376 180 382 Q270 388 360 380" fill="none" stroke="#A97FD6" strokeWidth="3" opacity=".6" />
      <g stroke="#33304A" strokeWidth="1.3">
        {FLEURS_DE_LA_PRAIRIE.map(([x, y, couleur]) => (
          <g key={`${x}-${y}`} transform={`translate(${x} ${y})`}>
            <path d="M0 0 V12" stroke="#7E56BC" strokeWidth="2" />
            {PETALES_D_UNE_FLEUR.map(({ k, x: cx, y: cy }) => <circle key={k} cx={cx} cy={cy} r="3" fill={couleur} />)}
            <circle r="2" fill="#FFC93C" />
          </g>
        ))}
      </g>
      <g fill="#FFF3B0">
        {LUCIOLES.map(([x, y]) => <circle key={`${x}-${y}`} className="luciole" cx={x} cy={y} r="2.6" />)}
      </g>
      <ellipse id="princesse-ombre-sol" cx="150" cy="398" rx="40" ry="8" fill="#7C2690" opacity=".2" />
      <g id="princesse-fleur" opacity="0" />
      <g id="princesse-lumi" />
      <g id="princesse-baguette" />
      <g id="princesse-trainee" />
      <g id="princesse-sort" opacity="0" />
      <g id="princesse-arc-en-ciel" fill="none" strokeLinecap="round" opacity="0" />
      <g id="princesse-couronne" opacity="0" />
      <g id="princesse-etincelles-d-envol" />
      <g id="princesse-signes" opacity="0" />
      <g id="princesse-joie" opacity="0" />

      <g transform="translate(180 36)">
        <g id="princesse-rayons" opacity="0" />
        <g id="princesse-cri" opacity="0">
          <text x="3" y="4" textAnchor="middle" dominantBaseline="middle" className="cri-de-victoire-ombre" fontWeight="800" fontSize="54" fill="#FFC93C" stroke="#33304A" strokeWidth="12" strokeLinejoin="round" paintOrder="stroke" data-testid="ombre-du-cri-de-victoire">{cri}</text>
          <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" className="cri-de-victoire" fontWeight="800" fontSize="54" fill="#A23BB8" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" paintOrder="stroke" data-testid="cri-de-victoire">{cri}</text>
        </g>
      </g>
    </svg>
  );
}
