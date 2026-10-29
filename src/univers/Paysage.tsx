import { useId } from "react";
import { motion } from "motion/react";
import { useMouvementsReduits } from "../transitions/mouvements-reduits.ts";
import type { CleUnivers } from "@domain/motivation";
import { PALETTES } from "./palettes.ts";

const DERIVE_DES_NUAGES = { duration: 40, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" } as const;

export function Paysage({ univers }: { readonly univers: CleUnivers }) {
  const palette = PALETTES[univers];
  const mouvementsReduits = useMouvementsReduits();
  const identifiant = useId();
  const ciel = `${identifiant}-ciel`;
  const soleil = `${identifiant}-soleil`;
  return (
    <div className="paysage" data-testid="paysage" data-univers={univers} aria-hidden="true" style={{ backgroundColor: palette.collines[2] }}>
      <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMax slice">
        <defs>
          <linearGradient id={ciel} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor={palette.ciel[0]} />
            <stop offset=".75" stopColor={palette.ciel[1]} />
          </linearGradient>
          <radialGradient id={soleil}>
            <stop offset="0" stopColor="#FFFFFF" />
            <stop offset=".55" stopColor={palette.soleil} />
            <stop offset="1" stopColor={palette.soleil} stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width="1200" height="800" fill={`url(#${ciel})`} />
        <circle cx="960" cy="170" r="150" fill={`url(#${soleil})`} />
        <motion.g key={String(mouvementsReduits)} fill="#FFFFFF" opacity=".85" animate={{ x: mouvementsReduits ? 0 : [0, 40] }} transition={mouvementsReduits ? { duration: 0 } : DERIVE_DES_NUAGES}>
          <ellipse cx="210" cy="140" rx="74" ry="22" />
          <ellipse cx="250" cy="125" rx="46" ry="27" />
          <ellipse cx="650" cy="96" rx="60" ry="18" />
          <ellipse cx="684" cy="84" rx="36" ry="22" />
        </motion.g>
        <path d="M0 380 L120 270 L210 340 L330 230 L470 350 L560 290 L700 360 L820 260 L960 350 L1060 300 L1200 360 V800 H0 Z" fill={palette.lointain} opacity=".7" />
        <path d="M0 450 C180 380 320 440 480 410 C650 375 820 440 980 400 C1080 375 1140 390 1200 400 V800 H0 Z" fill={palette.collines[0]} />
        <path d="M0 540 C160 490 300 540 470 515 C660 485 860 560 1200 500 V800 H0 Z" fill={palette.collines[1]} />
        <path d="M0 660 C200 610 420 670 640 635 C860 600 1020 660 1200 630 V800 H0 Z" fill={palette.collines[2]} />
        <g fill={palette.arbres}>
          <circle cx="90" cy="580" r="34" />
          <circle cx="125" cy="595" r="26" />
          <circle cx="1090" cy="560" r="40" />
          <circle cx="1130" cy="580" r="28" />
        </g>
      </svg>
    </div>
  );
}
