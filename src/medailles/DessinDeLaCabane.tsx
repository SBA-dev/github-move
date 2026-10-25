import type { ReactNode } from "react";
import { descriptionDuDessin, type EtatDeLaCabane } from "@domain/motivation";

const COULEURS_DES_LIVRES = ["#E8604C", "#4C8FF5", "#FFC93C", "#4FB37A", "#7A4FD6", "#E86A8A"];
const COULEURS_DES_FANIONS = ["#E8604C", "#FFC93C", "#4C8FF5", "#4FB37A"];

function Etagere() {
  return (
    <>
      <rect x="410" y="128" width="150" height="10" rx="3" fill="#7A4A2A" />
      {COULEURS_DES_LIVRES.map((couleur, i) => (
        <rect key={couleur} x={418 + i * 22} y={88 + (i % 2) * 6} width="18" height={40 - (i % 2) * 6} rx="3" fill={couleur} />
      ))}
    </>
  );
}

function Guirlande() {
  return (
    <>
      <path d="M0 26 Q150 70 300 26 T600 26" fill="none" stroke="#5B3A22" strokeWidth="2" />
      {Array.from({ length: 11 }, (_, i) => {
        const x = 25 + i * 52;
        const y = 26 + Math.sin((x / 600) * Math.PI * 2) * -2 + (i % 5 ? 18 : 10);
        return <path key={x} d={`M${x - 10} ${y - 10}h20l-10 18z`} fill={COULEURS_DES_FANIONS[i % 4]} />;
      })}
    </>
  );
}

/** Les objets du dessin, accrochés à la `cle` de l'objet de la cabane (jamais à son nom affiché). */
const OBJETS_DESSINES: Readonly<Record<string, ReactNode>> = {
  "lanterne": (
    <>
      <path d="M92 0v46" stroke="#5B3A22" strokeWidth="3" />
      <rect x="78" y="46" width="28" height="36" rx="8" fill="#FFC93C" stroke="#9C5A33" strokeWidth="3" />
      <circle cx="92" cy="64" r="26" fill="#FFE07A" opacity=".35" />
    </>
  ),
  "tapis": (
    <>
      <ellipse cx="300" cy="300" rx="150" ry="26" fill="#E8604C" />
      <ellipse cx="300" cy="300" rx="110" ry="17" fill="none" stroke="#FFD36B" strokeWidth="5" />
    </>
  ),
  "pot-de-fleurs": (
    <>
      <path d="M40 272h44l-6 40H46z" fill="#C9601C" />
      <circle cx="52" cy="256" r="11" fill="#E86A8A" />
      <circle cx="70" cy="248" r="11" fill="#FFC93C" />
      <circle cx="64" cy="264" r="10" fill="#4C8FF5" />
      <path d="M62 272v-14" stroke="#2E8656" strokeWidth="4" />
    </>
  ),
  "etagere": <Etagere />,
  "tableau": (
    <>
      <rect x="140" y="64" width="96" height="70" rx="6" fill="#FFF4DD" stroke="#C07C4A" strokeWidth="7" />
      <path d="M150 124l26-34 18 22 12-14 22 26z" fill="#4FB37A" />
      <circle cx="214" cy="84" r="8" fill="#FFC93C" />
    </>
  ),
  "coussin": <path d="M400 300c0-26 70-30 84-4 10 18-6 28-42 28s-42-8-42-24z" fill="#7A4FD6" />,
  "guirlande": <Guirlande />,
  "telescope": (
    <>
      <path d="M318 312l14-44 14 44M332 268v44" stroke="#5B3A22" strokeWidth="4" fill="none" />
      <rect x="306" y="236" width="64" height="18" rx="9" transform="rotate(-28 338 245)" fill="#2F6FD1" />
    </>
  ),
  "globe": (
    <>
      <path d="M540 316h28M554 316v-16" stroke="#7A4A2A" strokeWidth="5" />
      <circle cx="554" cy="276" r="24" fill="#4C8FF5" />
      <path
        d="M538 268c8 4 12-6 22-2s6 14 12 14M544 290c6-4 14 0 18-4"
        stroke="#4FB37A"
        strokeWidth="6"
        fill="none"
        strokeLinecap="round"
      />
    </>
  ),
  "boite-a-tresor": (
    <>
      <rect x="176" y="282" width="68" height="40" rx="6" fill="#9C5A33" />
      <path d="M176 290c0-22 68-22 68 0z" fill="#C07C4A" />
      <rect x="204" y="284" width="12" height="16" rx="3" fill="#FFC93C" />
    </>
  ),
  "coupe": (
    <>
      <path d="M486 60h32v10a16 16 0 0 1-32 0z" fill="#FFC93C" />
      <path d="M496 86h12v10h8v6h-28v-6h8z" fill="#E88A00" />
    </>
  ),
  "etoile-magique": (
    <>
      <circle cx="330" cy="58" r="30" fill="#FFF6C2" opacity=".55" />
      <path d="M330 36l6 14 15 1-12 9 4 15-13-8-13 8 4-15-12-9 15-1z" fill="#FFC93C" />
    </>
  ),
};

/** La pièce de la cabane de Noisette, avec les objets déjà reçus. */
export function DessinDeLaCabane({ cabane }: { readonly cabane: EtatDeLaCabane }) {
  return (
    <svg className="dessin-de-la-cabane" viewBox="0 0 600 340" role="img" aria-label={descriptionDuDessin(cabane)}>
      <rect width="600" height="340" rx="24" fill="#E9C08F" />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M0 ${30 + i * 28}H600`} stroke="#D6A774" strokeWidth="2" />)}
      <rect y="270" width="600" height="70" fill="#B67B4C" />
      <path d="M0 270H600" stroke="#8E5A35" strokeWidth="5" />
      <rect x="262" y="96" width="136" height="104" rx="52" fill="#BFE5FF" stroke="#9C5A33" strokeWidth="8" />
      <path d="M330 96v104M262 150h136" stroke="#9C5A33" strokeWidth="5" />
      <circle cx="300" cy="128" r="10" fill="#FFFFFF" opacity=".8" />
      {cabane.objetsRecus.map((objet) => <g key={objet.cle} data-objet={objet.cle}>{OBJETS_DESSINES[objet.cle]}</g>)}
    </svg>
  );
}
