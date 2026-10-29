import type { Humeur } from "@domain/motivation";
import { type DessinDuPersonnage, Yeux } from "./partage.tsx";
import { type Ancrage, TenueDerriere, TenueDevant } from "./tenues.tsx";

const PEAU = "#f3c9a5";
const CHEVEUX = "#a8461c";
const TENUE = "#d23a2a";
const BOUCHE = "#5B2C1A";

function Bouche({ humeur }: { readonly humeur: Humeur }) {
  if (humeur === "applaudit") return <path d="M40 44 Q45.5 53 51 44 Z" fill={BOUCHE} />;
  const trait = humeur === "reflechit" ? "M41.5 46.5 Q45.5 44.5 49.5 46.5" : "M41 45 Q45.5 49 50 45";
  return <path d={trait} stroke={BOUCHE} strokeWidth="3" fill="none" strokeLinecap="round" />;
}

const ANCRAGE: Ancrage = {
  cou: { x: 45, y: 53, echelle: 0.72 },
  dos: { x: 45, y: 76, echelle: 0.7, elargissement: 1.1 },
  pieds: { gauche: { x: 34, y: 99, echelle: 0.6 }, droit: { x: 56, y: 99, echelle: 0.6 }, tige: 10, derriere: true },
};

export const CapitaineSam: DessinDuPersonnage = ({ humeur, id, tenue }) => (
  <svg viewBox="0 0 90 110" overflow="visible" aria-hidden="true">
    <defs>
      <radialGradient id={`${id}s`} cx="38%" cy="32%" r="75%">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity=".55" />
        <stop offset=".35" stopColor={PEAU} />
        <stop offset="1" stopColor={PEAU} />
      </radialGradient>
      <linearGradient id={`${id}c`} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#FFFFFF" stopOpacity=".35" />
        <stop offset=".4" stopColor={TENUE} />
        <stop offset="1" stopColor={TENUE} />
      </linearGradient>
    </defs>
    <TenueDerriere tenue={tenue} ancrage={ANCRAGE} id={id} />
    <path d="M45 50 Q66 70 68 100 H22 Q24 70 45 50 Z" fill={`url(#${id}c)`} />
    <circle cx="45" cy="38" r="16" fill={`url(#${id}s)`} />
    <path d="M28 37 C29 17 61 15 62 37 C57 28 35 27 28 37 Z" fill={CHEVEUX} />
    <path d="M28 32 Q28 12 46 12 Q63 12 63 32 Z" fill="#F2C230" />
    <path d="M24 31 h44 q3 0 0 4 h-44 q-3 0 0 -4 Z" fill="#D9A21C" />
    <rect x="42" y="14" width="7" height="12" rx="2" fill="#D9381E" />
    <g data-testid="visage" data-humeur={humeur}>
      <Yeux>
        <ellipse cx="39.5" cy="39" rx="2.6" ry="3.2" fill="#1B1530" />
        <ellipse cx="51" cy="39" rx="2.6" ry="3.2" fill="#1B1530" />
        <circle cx="40.4" cy="38" r=".9" fill="#FFFFFF" />
        <circle cx="51.9" cy="38" r=".9" fill="#FFFFFF" />
      </Yeux>
      <ellipse cx="35" cy="44" rx="3" ry="1.8" fill="#FF8FA8" opacity=".5" />
      <ellipse cx="56" cy="44" rx="3" ry="1.8" fill="#FF8FA8" opacity=".5" />
      <Bouche humeur={humeur} />
    </g>
    <path d="M60 70 q18 0 20 -20" stroke="#5A5A5A" strokeWidth="5" fill="none" strokeLinecap="round" />
    <circle cx="82" cy="44" r="2.5" fill="#9CCFFF" />
    <circle cx="86" cy="38" r="2" fill="#9CCFFF" />
    <TenueDevant tenue={tenue} ancrage={ANCRAGE} id={id} />
  </svg>
);
