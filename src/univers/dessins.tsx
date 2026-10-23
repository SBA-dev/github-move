import type { ReactNode } from "react";
import { motion, type SVGMotionProps } from "motion/react";
import type { Humeur } from "@domain/motivation";
import type { Accessoire, ApparenceHumaine, Chapeau } from "./apparences.ts";

const BOUCHE = "#5B2C1A";

export function Bouche({ humeur, content, reflechit, applaudit }: {
  readonly humeur: Humeur;
  readonly content: string;
  readonly reflechit: string;
  readonly applaudit: string;
}) {
  if (humeur === "applaudit") return <path d={applaudit} fill={BOUCHE} />;
  const trait = humeur === "reflechit" ? reflechit : content;
  return <path d={trait} stroke={BOUCHE} strokeWidth="3" fill="none" strokeLinecap="round" />;
}

const CLIGNEMENT: SVGMotionProps<SVGGElement> = {
  animate: { scaleY: [1, 1, 0.1, 1] },
  transition: { duration: 0.3, times: [0, 0.1, 0.5, 1], repeat: Infinity, repeatDelay: 3.5 },
  style: { transformBox: "fill-box", transformOrigin: "center" },
};

export function Yeux({ children }: { readonly children: ReactNode }) {
  return <motion.g {...CLIGNEMENT}>{children}</motion.g>;
}

export function Ecureuil({ humeur, id }: { readonly humeur: Humeur; readonly id: string }) {
  return (
    <svg viewBox="0 0 200 200" overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}f`} cx="35%" cy="30%" r="75%">
          <stop offset="0" stopColor="#FFC28A" />
          <stop offset=".6" stopColor="#F48C3C" />
          <stop offset="1" stopColor="#C9601C" />
        </radialGradient>
        <radialGradient id={`${id}b`} cx="40%" cy="30%" r="70%">
          <stop offset="0" stopColor="#FFFFFF" />
          <stop offset="1" stopColor="#FFE0BF" />
        </radialGradient>
      </defs>
      <path d="M138 176 C206 160 200 60 150 48 C176 86 150 120 126 122 Z" fill={`url(#${id}f)`} />
      <ellipse cx="96" cy="150" rx="44" ry="46" fill={`url(#${id}f)`} />
      <ellipse cx="96" cy="160" rx="26" ry="30" fill={`url(#${id}b)`} />
      <path d="M60 58 L52 18 L86 44 Z M132 58 L140 18 L106 44 Z" fill={`url(#${id}f)`} />
      <path d="M64 50 L60 30 L78 44 Z M128 50 L132 30 L114 44 Z" fill="#FFB3C7" />
      <circle cx="96" cy="84" r="46" fill={`url(#${id}f)`} />
      <ellipse cx="96" cy="100" rx="28" ry="20" fill={`url(#${id}b)`} />
      <g data-testid="visage" data-humeur={humeur}>
        <Yeux>
          <ellipse cx="78" cy="80" rx="9" ry="11" fill="#1B1530" />
          <ellipse cx="114" cy="80" rx="9" ry="11" fill="#1B1530" />
          <circle cx="81" cy="76" r="3.4" fill="#FFFFFF" />
          <circle cx="117" cy="76" r="3.4" fill="#FFFFFF" />
        </Yeux>
        <ellipse cx="96" cy="94" rx="6" ry="4.5" fill="#5B2C1A" />
        <ellipse cx="66" cy="98" rx="8" ry="5" fill="#FF8FA8" opacity=".55" />
        <ellipse cx="126" cy="98" rx="8" ry="5" fill="#FF8FA8" opacity=".55" />
        <Bouche
          humeur={humeur}
          content="M86 103 Q96 113 106 103"
          reflechit="M88 107 Q96 103 104 107"
          applaudit="M84 101 Q96 121 108 101 Z"
        />
      </g>
    </svg>
  );
}

const CHAPEAUX: Readonly<Record<Chapeau, ReactNode>> = {
  tiare: <path d="M33 24 l4 -8 l4 6 l4 -9 l4 9 l4 -6 l4 8 Z" fill="#FFC93C" />,
  casquette: (
    <>
      <path d="M30 30 Q31 16 46 16 Q60 16 61 30 Z" fill="#E8604C" />
      <path d="M58 29 h14 q2 0 0 3 h-14 Z" fill="#C24432" />
    </>
  ),
  police: (
    <>
      <path d="M29 29 Q30 17 46 17 Q61 17 62 29 Z" fill="#26397A" />
      <rect x="28" y="27" width="35" height="5" rx="2" fill="#16245A" />
      <circle cx="45.5" cy="22" r="3.5" fill="#FFC93C" />
    </>
  ),
  casque: (
    <>
      <path d="M28 32 Q28 12 46 12 Q63 12 63 32 Z" fill="#F2C230" />
      <path d="M24 31 h44 q3 0 0 4 h-44 q-3 0 0 -4 Z" fill="#D9A21C" />
      <rect x="42" y="14" width="7" height="12" rx="2" fill="#D9381E" />
    </>
  ),
  chignon: null,
};

const ACCESSOIRES: Readonly<Record<Accessoire, ReactNode>> = {
  baguette: (
    <>
      <path d="M60 64 L80 34" stroke="#FFC93C" strokeWidth="3" strokeLinecap="round" />
      <path d="M80 22 l3.5 8 8.5 .6 -6.5 5.5 2 8.3 -7.5 -4.5 -7.5 4.5 2 -8.3 -6.5 -5.5 8.5 -.6 z" fill="#FFC93C" />
    </>
  ),
  ballon: (
    <>
      <circle cx="76" cy="86" r="10" fill="#FFFFFF" stroke="#D5E2DC" />
      <path d="M76 76 l4 6 -4 4 -4 -4 z" fill="#17302A" />
    </>
  ),
  insigne: <path d="M45 62 l3 6 6 1 -4.5 4 1 6 -5.5 -3 -5.5 3 1 -6 -4.5 -4 6 -1 z" fill="#FFC93C" />,
  lance: (
    <>
      <path d="M60 70 q18 0 20 -20" stroke="#5A5A5A" strokeWidth="5" fill="none" strokeLinecap="round" />
      <circle cx="82" cy="44" r="2.5" fill="#9CCFFF" />
      <circle cx="86" cy="38" r="2" fill="#9CCFFF" />
    </>
  ),
  ruban: <path d="M62 64 q14 -20 4 -34 q-10 -12 6 -20" stroke="#FF8FB8" strokeWidth="3" fill="none" strokeLinecap="round" />,
};

export function Humain({ apparence, humeur, id }: {
  readonly apparence: ApparenceHumaine;
  readonly humeur: Humeur;
  readonly id: string;
}) {
  const { peau, cheveux, tenue, ailes, chapeau, accessoire } = apparence;
  return (
    <svg viewBox="0 0 90 110" overflow="visible" aria-hidden="true">
      <defs>
        <radialGradient id={`${id}s`} cx="38%" cy="32%" r="75%">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".55" />
          <stop offset=".35" stopColor={peau} />
          <stop offset="1" stopColor={peau} />
        </radialGradient>
        <linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFFFFF" stopOpacity=".35" />
          <stop offset=".4" stopColor={tenue} />
          <stop offset="1" stopColor={tenue} />
        </linearGradient>
      </defs>
      {ailes && (
        <>
          <ellipse cx="28" cy="52" rx="20" ry="28" fill="#CFEAFF" opacity=".8" transform="rotate(-20 28 52)" />
          <ellipse cx="62" cy="52" rx="20" ry="28" fill="#CFEAFF" opacity=".8" transform="rotate(20 62 52)" />
        </>
      )}
      <path d="M45 50 Q66 70 68 100 H22 Q24 70 45 50 Z" fill={`url(#${id}c)`} />
      {chapeau === "chignon" && <circle cx="45.5" cy="17" r="8" fill={cheveux} />}
      <circle cx="45" cy="38" r="16" fill={`url(#${id}s)`} />
      <path d="M28 37 C29 17 61 15 62 37 C57 28 35 27 28 37 Z" fill={cheveux} />
      {CHAPEAUX[chapeau]}
      <g data-testid="visage" data-humeur={humeur}>
        <Yeux>
          <ellipse cx="39.5" cy="39" rx="2.6" ry="3.2" fill="#1B1530" />
          <ellipse cx="51" cy="39" rx="2.6" ry="3.2" fill="#1B1530" />
          <circle cx="40.4" cy="38" r=".9" fill="#FFFFFF" />
          <circle cx="51.9" cy="38" r=".9" fill="#FFFFFF" />
        </Yeux>
        <ellipse cx="35" cy="44" rx="3" ry="1.8" fill="#FF8FA8" opacity=".5" />
        <ellipse cx="56" cy="44" rx="3" ry="1.8" fill="#FF8FA8" opacity=".5" />
        <Bouche
          humeur={humeur}
          content="M41 45 Q45.5 49 50 45"
          reflechit="M41.5 46.5 Q45.5 44.5 49.5 46.5"
          applaudit="M40 44 Q45.5 53 51 44 Z"
        />
      </g>
      {ACCESSOIRES[accessoire]}
    </svg>
  );
}
