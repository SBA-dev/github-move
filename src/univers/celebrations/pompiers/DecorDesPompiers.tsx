import type { RefObject } from "react";

type Props = { readonly racine: RefObject<SVGSVGElement | null>; readonly cri: string };

const POLICE_DES_BULLES = { fontFamily: "var(--police-titres)" };

const HUBLOTS = [128, 152, 176];

/**
 * Le décor fixe de la cour de la caserne, en plein jour (ciel, soleil, nuages, collines, arbre, caserne rouge et crème à la grande porte fermée, cour, herbe, parterre)
 * et les groupes que le moteur remplit à chaque image (le jardin, la cloche, le jet, l'arc-en-ciel, la pluie). Aucun texte sur la caserne.
 * Les groupes à identifiant sont vides ici : React n'y touche pas, c'est le moteur qui les dessine.
 */
export function DecorDesPompiers({ racine, cri }: Props) {
  return (
    <svg ref={racine} viewBox="0 0 360 450" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="pompier-ciel" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFC9A8" />
          <stop offset="1" stopColor="#FFF0D9" />
        </linearGradient>
        <linearGradient id="pompier-cour" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F7E4C6" />
          <stop offset="1" stopColor="#EED3AE" />
        </linearGradient>
        <linearGradient id="pompier-herbe" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9AD48A" />
          <stop offset="1" stopColor="#74BC6C" />
        </linearGradient>
        <clipPath id="pompier-clip-oeil"><ellipse rx="7.4" ry="9.6" /></clipPath>
        <clipPath id="pompier-clip-bouche"><path d="M-11 11 Q0 27 11 11 Z" /></clipPath>
      </defs>
      <g id="pompier-repere" />

      <rect width="360" height="450" fill="url(#pompier-ciel)" />
      <circle cx="40" cy="116" r="18" fill="#FFE08A" stroke="#F7CB5A" strokeWidth="3" />
      <g fill="#FFFFFF" stroke="#F3D9C8" strokeWidth="2.5" strokeLinejoin="round">
        <g className="nuage"><path d="M262 120 q-6 -18 14 -18 q6 -14 22 -8 q16 -6 20 10 q14 2 8 16 Z" /></g>
        <g className="nuage lent" opacity=".9"><path d="M430 150 q-4 -12 10 -12 q5 -9 15 -5 q11 -4 14 7 q9 2 5 10 Z" /></g>
      </g>
      <g id="pompier-arc-en-ciel" fill="none" strokeLinecap="round" opacity="0" />
      <path d="M0 238 C60 214 130 226 200 220 C260 214 310 206 360 222 V450 H0 Z" fill="#F3C2A6" />
      <path d="M0 268 C70 250 150 258 220 254 C290 250 330 244 360 254 V450 H0 Z" fill="#F2C08F" />
      <g stroke="#33304A" strokeWidth="2.5" strokeLinejoin="round">
        <rect x="318" y="262" width="9" height="40" rx="3" fill="#8A5A34" />
        <g fill="#6FBF6A"><circle cx="322" cy="246" r="26" /><circle cx="304" cy="262" r="15" /><circle cx="340" cy="262" r="15" /></g>
      </g>
      <circle cx="314" cy="236" r="5" fill="#A6E39A" />
      <circle cx="330" cy="250" r="3" fill="#A6E39A" />

      <g stroke="#33304A" strokeWidth="2.6" strokeLinejoin="round">
        <path d="M94 168 L152 86 L210 168 Z" fill="#C2341B" />
        <path d="M104 166 L152 98 L200 166" fill="none" stroke="#FFF0D9" strokeWidth="4" />
        <path d="M136 152 V124 Q136 106 152 106 Q168 106 168 124 V152 Z" fill="#FFF0D9" />
        <rect x="56" y="166" width="192" height="134" fill="#C2341B" />
        <path d="M200 172 H246 V298 H226 Q232 230 200 172 Z" fill="#A82A16" stroke="none" />
        <rect x="50" y="160" width="204" height="12" rx="4" fill="#FFF0D9" />
        <g fill="#CFEBFF">
          <rect x="66" y="192" width="28" height="32" rx="4" strokeWidth="3" stroke="#33304A" />
          <rect x="210" y="192" width="28" height="32" rx="4" strokeWidth="3" />
        </g>
        <g fill="none" stroke="#FFF0D9" strokeWidth="2.4"><path d="M80 194 V222 M68 208 H92 M224 194 V222 M212 208 H236" /></g>
        <path d="M64 230 H96 M208 230 H240" stroke="#FFF0D9" strokeWidth="4" strokeLinecap="round" />
        <rect x="98" y="198" width="108" height="102" rx="6" fill="#931F0C" />
        <rect x="104" y="204" width="96" height="96" rx="4" fill="#FFF0D9" />
        <g fill="none" stroke="#E2C9A6" strokeWidth="2"><path d="M106 244 H198 M106 262 H198 M106 280 H198" /></g>
        <g fill="#CFEBFF" strokeWidth="2.4">{HUBLOTS.map((x) => <circle key={x} cx={x} cy="224" r="8" />)}</g>
        <g fill="none" stroke="#FFFFFF" strokeWidth="1.8" strokeLinecap="round" opacity=".9">
          <path d="M124 221 Q126 218 129 218 M148 221 Q150 218 153 218 M172 221 Q174 218 177 218" />
        </g>
      </g>
      <g id="pompier-fil-derriere" />
      <g id="pompier-cloche" />

      <path d="M0 298 H360 V450 H0 Z" fill="url(#pompier-cour)" />
      <path d="M0 298 H360" stroke="#E2C29A" strokeWidth="2.4" />
      <g stroke="#E8CFAA" strokeWidth="1.4" opacity=".8">
        <path d="M0 330 H360 M0 362 H230 M40 298 V330 M120 298 V330 M200 298 V330 M280 298 V330 M80 330 V362 M160 330 V362" />
      </g>
      <path d="M0 412 C70 404 150 408 220 404 C290 400 330 404 360 402 V450 H0 Z" fill="url(#pompier-herbe)" stroke="#5E9F58" strokeWidth="2" />
      <g fill="none" stroke="#5E9F58" strokeWidth="2" strokeLinecap="round"><path d="M30 430 l3 -7 l3 7 M110 438 l3 -7 l3 7 M200 432 l3 -7 l3 7 M290 440 l3 -7 l3 7" /></g>
      <g stroke="#33304A" strokeLinejoin="round">
        <path d="M232 380 Q232 364 250 364 H340 Q356 364 356 380 Q356 396 340 396 H250 Q232 396 232 380 Z" fill="#9A6440" strokeWidth="2.6" />
        <path d="M240 372 Q248 368 260 368 H332 Q346 368 350 374" fill="none" stroke="#B9835A" strokeWidth="3" strokeLinecap="round" />
      </g>
      <g id="pompier-fleurs" />

      <g id="pompier-devidoir" />
      <path id="pompier-tuyau-contour" fill="none" stroke="#33304A" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path id="pompier-tuyau" fill="none" stroke="#EFE3C6" strokeWidth="5.4" strokeLinecap="round" strokeLinejoin="round" />
      <path id="pompier-tuyau-ombre" fill="none" stroke="#D2C29C" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <ellipse id="pompier-ombre-sol" cx="132" cy="384" rx="34" ry="8" fill="#8A5A3A" opacity=".22" />
      <g id="pompier-lance-sol" opacity="0" />
      <g id="pompier-jet">
        <path className="jet-contour" fill="none" stroke="#3C8DDA" strokeWidth="7.6" strokeLinecap="round" strokeLinejoin="round" />
        <path className="jet-eau" fill="none" stroke="#BDE8FF" strokeWidth="4.6" strokeLinecap="round" strokeLinejoin="round" />
        <path className="jet-reflet" fill="none" stroke="#FFFFFF" strokeWidth="1.4" strokeLinecap="round" opacity=".8" />
        <g className="gouttes" fill="#E6F7FF" stroke="#3C8DDA" strokeWidth="1.2" />
        <g className="eclabousse" fill="#BDE8FF" stroke="#3C8DDA" strokeWidth="1.2" />
      </g>
      <g id="pompier-sam" />
      <g id="pompier-pluie" />
      <g id="pompier-ebroue" fill="#BDE8FF" stroke="#3C8DDA" strokeWidth="1.2" />
      <g id="pompier-fil-devant" />
      <g id="pompier-notes" />
      {[0, 1].map((k) => (
        <g key={k} id={`pompier-bulle-${k}`} opacity="0">
          <rect x="-32" y="-16" width="64" height="30" rx="14" fill="#FFFFFF" stroke="#33304A" strokeWidth="2.6" />
          <text y="6" textAnchor="middle" fontWeight="800" fontSize="17" fill="#931F0C" style={POLICE_DES_BULLES} />
        </g>
      ))}
      <g id="pompier-etincelles-de-la-tete" opacity="0" fill="#FFC93C" stroke="#33304A" strokeWidth="1.8" strokeLinejoin="round" />
      <g id="pompier-etincelles-du-pouce" opacity="0" fill="#FFC93C" stroke="#33304A" strokeWidth="1.5" strokeLinejoin="round" />

      <g transform="translate(180 60)">
        <g id="pompier-rayons" opacity="0" />
        <g id="pompier-cri" opacity="0">
          <text x="3" y="4" textAnchor="middle" dominantBaseline="middle" className="cri-de-victoire-ombre" fontWeight="800" fontSize="36" fill="#FFC93C" stroke="#33304A" strokeWidth="10" strokeLinejoin="round" paintOrder="stroke" data-testid="ombre-du-cri-de-victoire">{cri}</text>
          <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" className="cri-de-victoire" fontWeight="800" fontSize="36" fill="#C2341B" stroke="#FFFFFF" strokeWidth="5" strokeLinejoin="round" paintOrder="stroke" data-testid="cri-de-victoire">{cri}</text>
        </g>
      </g>
    </svg>
  );
}
