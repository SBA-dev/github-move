import type { RefObject } from "react";

type Props = { readonly racine: RefObject<SVGSVGElement | null>; readonly cri: string };

const LAMPES_DE_LA_RAMPE = Array.from({ length: 9 }, (_, i) => {
  const x = 36 + i * 36;
  return { x, y: Math.round((455 + 8 * Math.sin((x / 360) * Math.PI)) * 100) / 100 };
});

/**
 * Le décor fixe de la scène (salle en pénombre, coulisses, faisceaux, plancher, rampe, rideaux, public en silhouettes)
 * et les groupes que le moteur remplit à chaque image. Les groupes à identifiant sont vides ici : React n'y touche pas.
 */
export function DecorDeLaDanse({ racine, cri }: Props) {
  return (
    <svg ref={racine} viewBox="30 110 300 375" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="danse-fond" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3B2358" />
          <stop offset=".6" stopColor="#5A3A7A" />
          <stop offset="1" stopColor="#7A4F94" />
        </linearGradient>
        <linearGradient id="danse-rideau" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#4A1686" />
          <stop offset=".5" stopColor="#8A47D6" />
          <stop offset="1" stopColor="#4A1686" />
        </linearGradient>
        <linearGradient id="danse-plancher" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3E2A20" />
          <stop offset="1" stopColor="#5A3C2C" />
        </linearGradient>
        <radialGradient id="danse-projecteur" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#FFF6D8" stopOpacity=".55" />
          <stop offset=".6" stopColor="#FFE9C8" stopOpacity=".22" />
          <stop offset="1" stopColor="#FFE9C8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="danse-cone" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#FFF3D6" stopOpacity=".42" />
          <stop offset="1" stopColor="#FFF3D6" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="danse-lampe" cx=".5" cy=".5" r=".5">
          <stop offset="0" stopColor="#FFE9A8" stopOpacity=".9" />
          <stop offset="1" stopColor="#FFE9A8" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="danse-salle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2A1A3E" stopOpacity="0" />
          <stop offset="1" stopColor="#1E1230" />
        </linearGradient>
        <clipPath id="danse-clip-oeil"><ellipse rx="7.4" ry="9.6" /></clipPath>
        <clipPath id="danse-clip-bouche"><path d="M-11 11 Q0 27 11 11 Z" /></clipPath>
      </defs>

      <rect width="360" height="500" fill="url(#danse-fond)" />
      <g fill="#2E1A48" opacity=".9">
        <rect x="60" y="110" width="30" height="190" /><rect x="270" y="110" width="30" height="190" />
        <rect x="96" y="150" width="14" height="150" opacity=".6" /><rect x="250" y="150" width="14" height="150" opacity=".6" />
      </g>
      <g id="danse-faisceaux" opacity=".85">
        <path d="M128 96 L152 96 L250 310 L120 310 Z" fill="url(#danse-cone)" />
        <path d="M232 96 L208 96 L110 310 L240 310 Z" fill="url(#danse-cone)" />
        <path d="M168 96 L192 96 L230 310 L130 310 Z" fill="url(#danse-cone)" opacity=".7" />
        <g className="danse-poussiere-lumineuse" fill="#FFF7E0">
          <circle cx="150" cy="150" r="1.4" /><circle cx="190" cy="190" r="1.1" /><circle cx="214" cy="140" r="1.5" /><circle cx="168" cy="236" r="1.2" />
          <circle cx="232" cy="262" r="1" /><circle cx="136" cy="268" r="1.3" /><circle cx="204" cy="118" r="1" /><circle cx="178" cy="286" r="1.1" />
        </g>
      </g>
      <rect x="0" y="296" width="360" height="190" fill="url(#danse-plancher)" />
      <g fill="none" stroke="#2A1A12" strokeWidth="2.4" opacity=".8"><path d="M0 296 H360 M0 332 H360 M0 374 H360 M0 420 H360" /></g>
      <g fill="none" stroke="#2A1A12" strokeWidth="2" opacity=".6"><path d="M84 296 V332 M232 296 V332 M150 332 V374 M300 332 V374 M60 374 V420 M212 374 V420 M120 420 V458 M280 420 V458" /></g>
      <g fill="none" stroke="#8A6248" strokeWidth="1.2" opacity=".35"><path d="M0 299 H360 M0 335 H360 M0 377 H360 M0 423 H360" /></g>
      <ellipse cx="180" cy="430" rx="170" ry="46" fill="url(#danse-projecteur)" />
      <ellipse id="danse-cercle-lumiere" cx="180" cy="440" rx="62" ry="15" fill="url(#danse-projecteur)" opacity=".9" />
      <g stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" opacity=".32"><path d="M112 404 L124 412 M124 404 L112 412 M248 386 L258 393 M258 386 L248 393 M184 452 L192 457 M192 452 L184 457" /></g>
      <path d="M-10 452 Q180 468 370 452 V500 H-10 Z" fill="#2B1A12" />
      <path d="M-10 452 Q180 468 370 452" fill="none" stroke="#FFC93C" strokeWidth="4" />
      <path d="M-10 458 Q180 474 370 458" fill="none" stroke="#C98A12" strokeWidth="2" opacity=".8" />
      <g>
        {LAMPES_DE_LA_RAMPE.map(({ x, y }) => (
          <g key={x}>
            <circle cx={x} cy={y} r="9" fill="url(#danse-lampe)" />
            <circle cx={x} cy={y} r="3.2" fill="#FFE9A8" stroke="#33304A" strokeWidth="1.4" />
          </g>
        ))}
      </g>
      <rect x="0" y="470" width="360" height="40" fill="url(#danse-salle)" />
      <g fill="#1E1230" opacity=".92">
        <ellipse cx="40" cy="496" rx="18" ry="16" /><ellipse cx="96" cy="500" rx="17" ry="15" /><ellipse cx="150" cy="494" rx="19" ry="17" />
        <ellipse cx="210" cy="499" rx="17" ry="15" /><ellipse cx="266" cy="495" rx="18" ry="16" /><ellipse cx="322" cy="500" rx="17" ry="15" />
        <rect x="0" y="498" width="360" height="20" />
      </g>
      <g>
        <path d="M0 96 H96 Q100 190 72 250 Q92 290 60 304 Q30 318 0 304 Z" fill="url(#danse-rideau)" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" />
        <path d="M16 96 Q28 190 14 250 Q20 280 8 304 M40 96 Q56 190 36 250 Q46 280 30 304 M66 96 Q84 190 58 250 Q70 280 50 304" fill="none" stroke="#3A0F6E" strokeWidth="7" opacity=".6" />
        <path d="M16 96 Q28 190 14 250 M40 96 Q56 190 36 250 M66 96 Q84 190 58 250" fill="none" stroke="#B88BF0" strokeWidth="2" opacity=".45" transform="translate(6 0)" />
        <path d="M360 96 H264 Q260 190 288 250 Q268 290 300 304 Q330 318 360 304 Z" fill="url(#danse-rideau)" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" />
        <path d="M344 96 Q332 190 346 250 Q340 280 352 304 M320 96 Q304 190 324 250 Q314 280 330 304 M294 96 Q276 190 302 250 Q290 280 310 304" fill="none" stroke="#3A0F6E" strokeWidth="7" opacity=".6" />
        <path d="M344 96 Q332 190 346 250 M320 96 Q304 190 324 250 M294 96 Q276 190 302 250" fill="none" stroke="#B88BF0" strokeWidth="2" opacity=".45" transform="translate(-6 0)" />
        <path d="M46 238 Q72 228 90 252 Q72 266 52 258 Z M314 238 Q288 228 270 252 Q288 266 308 258 Z" fill="#FFC93C" stroke="#33304A" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M0 96 H360 V122 Q330 148 300 124 Q270 150 240 124 Q210 150 180 124 Q150 150 120 124 Q90 150 60 124 Q30 148 0 122 Z" fill="#6C2AB8" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" />
        <path d="M0 122 Q30 148 60 124 Q90 150 120 124 Q150 150 180 124 Q210 150 240 124 Q270 150 300 124 Q330 148 360 122" fill="none" stroke="#FFC93C" strokeWidth="4" />
      </g>
      <g id="danse-ruban" fill="none" stroke="#FF8FB8" strokeWidth="4.5" strokeLinecap="round" strokeLinejoin="round" opacity="0">
        <path className="trace" />
        <path className="eclat" stroke="#FFFFFF" strokeWidth="1.6" opacity=".7" />
      </g>
      <g id="danse-etoile-ruban" opacity="0">
        <path fill="#FFC93C" stroke="#33304A" strokeWidth="3" strokeLinejoin="round" d="M0 -46 L13 -14 L47 -14 L20 7 L30 40 L0 20 L-30 40 L-20 7 L-47 -14 L-13 -14 Z" />
        <path fill="#FFE27A" d="M0 -30 L8 -10 L30 -10 L13 3 L19 24 L0 12 L-19 24 L-13 3 L-30 -10 L-8 -10 Z" />
      </g>
      <ellipse id="danse-ombre-de-lili" cx="180" cy="420" rx="34" ry="8" fill="#1E1230" opacity=".3" />
      <g id="danse-vitesse" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" opacity="0" />
      <g id="danse-lili" />
      <g id="danse-etoiles" opacity="0" fill="#FFC93C" stroke="#33304A" strokeWidth="1.8" strokeLinejoin="round" />
      <g id="danse-gouttes" opacity="0" fill="#9FD3FF" stroke="#33304A" strokeWidth="1.5" />

      <g transform="translate(180 160)">
        <g id="danse-rayons" opacity="0" />
        <g id="danse-cri" opacity="0">
          <text x="3" y="4" textAnchor="middle" dominantBaseline="middle" className="cri-de-victoire-ombre" fontWeight="800" fontSize="56" fill="#FFC93C" stroke="#33304A" strokeWidth="12" strokeLinejoin="round" paintOrder="stroke" data-testid="ombre-du-cri-de-victoire">{cri}</text>
          <text x="0" y="0" textAnchor="middle" dominantBaseline="middle" className="cri-de-victoire" fontWeight="800" fontSize="56" fill="#7A35C8" stroke="#FFFFFF" strokeWidth="6" strokeLinejoin="round" paintOrder="stroke" data-testid="cri-de-victoire">{cri}</text>
        </g>
      </g>
    </svg>
  );
}
