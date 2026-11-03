import type { ReactNode } from "react";
import type { CleUnivers } from "@domain/motivation";

/**
 * Les dessins des parchemins, un jeu de deux bandes (haut et bas) par univers, repris de la planche
 * `docs/stories/129/planches/parchemin.svg`. Les coordonnées sont celles de la planche : seule la fenêtre `viewBox`
 * découpe la bande. Le fond et les côtés du parchemin sont peints par la feuille de style, sous le texte.
 * Chaque forme est dans un élément de classe `decor-du-parchemin`.
 */
type Bande = { readonly fenetre: string; readonly hauteur: number; readonly formes: ReactNode };

type Dessins = { readonly haut: Bande; readonly bas: Bande };

const decor = "decor-du-parchemin";

const rouleau = (y: number): ReactNode => (
  <g className={decor}>
    <rect x="6" y={y} width="318" height="24" rx="12" fill="#E9C566" stroke="#B58B2A" strokeWidth="3.5" />
    <circle cx="8" cy={y + 12} r="12" fill="#FBE9B0" stroke="#B58B2A" strokeWidth="3.5" />
    <circle cx="322" cy={y + 12} r="12" fill="#FBE9B0" stroke="#B58B2A" strokeWidth="3.5" />
    <circle cx="8" cy={y + 12} r="4.5" fill="#E9C566" />
    <circle cx="322" cy={y + 12} r="4.5" fill="#E9C566" />
    <ellipse cx="135" cy={y + 7} rx="40" ry="3" fill="#fff" opacity=".6" />
  </g>
);

const NOEUD = (
  <g className={decor} transform="translate(298 20)">
    <path d="M0 0 C-12 -10 -18 -2 -14 6 C-10 12 -2 8 0 0Z" fill="#F5A9D2" stroke="#C9669A" strokeWidth="2.5" strokeLinejoin="round" transform="translate(-4 0)" />
    <path d="M0 0 C12 -10 18 -2 14 6 C10 12 2 8 0 0Z" fill="#F5A9D2" stroke="#C9669A" strokeWidth="2.5" strokeLinejoin="round" transform="translate(4 0)" />
    <circle cx="0" cy="2" r="4.5" fill="#F58AB8" stroke="#C9669A" strokeWidth="2.5" />
  </g>
);

const lignesDePortee = (y: number): ReactNode =>
  [0, 7, 14, 21, 28].map((decalage) => (
    <path key={decalage} d={`M22 ${y + decalage}H308`} stroke="#7A35C8" strokeWidth="1.8" strokeLinecap="round" />
  ));

const note = (x: number, y: number, queHaut: boolean): ReactNode => (
  <g key={x}>
    <ellipse cx={x} cy={y} rx="6.5" ry="4.8" transform={`rotate(-20 ${x} ${y})`} fill="#5A1F9E" />
    <path d={`M${x + 5.5} ${y - 1.5}V${queHaut ? y + 22 : y - 20}`} stroke="#5A1F9E" strokeWidth="2" strokeLinecap="round" />
  </g>
);

export const DESSINS_DES_PARCHEMINS: Readonly<Record<CleUnivers, Dessins>> = {
  animaux: {
    haut: {
      fenetre: "0 -8 330 58",
      hauteur: 58,
      formes: (
        <>
          <path className={decor} d="M6 48 Q50 18 165 10 Q280 18 324 48Z" fill="#F1FAE6" stroke="#3F9A63" strokeWidth="4" strokeLinejoin="round" />
          <path className={decor} d="M165 11 Q167 0 181 -6" fill="none" stroke="#8A5A33" strokeWidth="6" strokeLinecap="round" />
          <path className={decor} d="M12 38q10 -10 24 -14M318 38q-10 -10 -24 -14" fill="none" stroke="#9CCF8B" strokeWidth="3" strokeLinecap="round" />
        </>
      ),
    },
    bas: {
      fenetre: "0 330 330 48",
      hauteur: 48,
      formes: (
        <>
          <path className={decor} d="M6 332 Q20 370 165 374 Q310 370 324 332Z" fill="#E9F7DE" stroke="#3F9A63" strokeWidth="4" strokeLinejoin="round" />
          <path className={decor} d="M30 348 Q165 378 300 348 Q165 362 30 348Z" fill="#7CC38A" stroke="#3F9A63" strokeWidth="2.5" strokeLinejoin="round" />
        </>
      ),
    },
  },
  princesse: {
    haut: { fenetre: "0 4 330 32", hauteur: 32, formes: <>{rouleau(8)}{NOEUD}</> },
    bas: { fenetre: "0 2 330 32", hauteur: 32, formes: rouleau(6) },
  },
  sports: {
    haut: {
      fenetre: "0 0 330 28",
      hauteur: 28,
      formes: (
        <>
          <rect className={decor} x="6" y="4" width="278" height="24" rx="22" fill="#4C8FF5" stroke="#164BA8" strokeWidth="3.5" />
          <circle className={decor} cx="276" cy="16" r="4.5" fill="#E8F0FF" stroke="#164BA8" strokeWidth="2" />
          <g className={decor} transform="translate(306 18) rotate(-20) scale(.8)">
            <rect x="-20" y="-6" width="20" height="12" rx="3" fill="#F5C242" stroke="#8A5A10" strokeWidth="2.5" />
            <circle cx="2" cy="0" r="11" fill="#FFD25A" stroke="#8A5A10" strokeWidth="2.5" />
            <circle cx="2" cy="0" r="4" fill="#fff" stroke="#8A5A10" strokeWidth="2" />
          </g>
        </>
      ),
    },
    bas: {
      fenetre: "0 364 330 52",
      hauteur: 52,
      formes: (
        <>
          <rect className={decor} x="6" y="368" width="278" height="26" rx="22" fill="#1F63D8" stroke="#164BA8" strokeWidth="3.5" />
          <rect className={decor} x="42" y="402" width="206" height="12" rx="6" fill="#164BA8" stroke="#164BA8" strokeWidth="2" />
          <rect className={decor} x="76" y="390" width="46" height="12" rx="6" fill="#E8604C" stroke="#9E3322" strokeWidth="2.5" />
        </>
      ),
    },
  },
  police: {
    haut: {
      fenetre: "0 4 330 40",
      hauteur: 40,
      formes: (
        <>
          <rect className={decor} x="4" y="14" width="322" height="30" rx="16" fill="#5470E2" stroke="#253B9C" strokeWidth="3.5" />
          {Array.from({ length: 11 }, (_, i) => (
            <rect key={i} className={decor} x={23 + 28 * i} y="8" width="10" height="28" rx="5" fill="#E4EAFF" stroke="#253B9C" strokeWidth="2.5" />
          ))}
        </>
      ),
    },
    bas: {
      fenetre: "0 326 330 46",
      hauteur: 46,
      formes: (
        <>
          <rect className={decor} x="4" y="330" width="322" height="30" rx="16" fill="#3450C8" stroke="#253B9C" strokeWidth="3.5" />
          <g className={decor} transform="translate(280 342)">
            <circle cx="0" cy="0" r="13" fill="#D8ECFF" stroke="#162662" strokeWidth="4" />
            <path d="M-7 -4 Q-5 -9 0 -9" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" />
            <path d="M10 10 L24 24" stroke="#162662" strokeWidth="7" strokeLinecap="round" />
          </g>
        </>
      ),
    },
  },
  pompier: {
    haut: {
      fenetre: "0 4 330 56",
      hauteur: 56,
      formes: (
        <>
          <rect className={decor} x="4" y="40" width="322" height="20" rx="16" fill="#F6A89A" stroke="#931F0C" strokeWidth="3.5" />
          <g className={decor} transform="translate(165 6)">
            <path d="M-28 36 Q-28 8 0 8 Q28 8 28 36Z" fill="#FFC93C" stroke="#931F0C" strokeWidth="3.5" strokeLinejoin="round" />
            <path d="M-4 9 Q-4 22 -4 36 H4 Q4 22 4 9Z" fill="#F0A818" stroke="#931F0C" strokeWidth="2" strokeLinejoin="round" />
            <path d="M-38 36 H38 Q41 44 30 45 H-30 Q-41 44 -38 36Z" fill="#F0A818" stroke="#931F0C" strokeWidth="3.5" strokeLinejoin="round" />
            <circle cx="0" cy="25" r="5.5" fill="#E8604C" stroke="#931F0C" strokeWidth="2" />
          </g>
        </>
      ),
    },
    bas: {
      fenetre: "0 342 330 32",
      hauteur: 32,
      formes: <rect className={decor} x="4" y="346" width="322" height="24" rx="16" fill="#EF8F7F" stroke="#931F0C" strokeWidth="3.5" />,
    },
  },
  danse: {
    haut: {
      fenetre: "0 4 330 54",
      hauteur: 54,
      formes: (
        <g className={decor}>
          {lignesDePortee(22)}
          <path
            d="M17 2 C25 8 24 17 15 21 C4 26 2 37 12 38 C21 39 22 29 14 28 M16 -2 V45 C16 52 6 52 6 46"
            fill="none"
            stroke="#5A1F9E"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            transform="translate(22 6) scale(.95)"
          />
          {note(120, 36, true)}
          {note(160, 29, true)}
          {note(206, 22, true)}
          {note(250, 29, true)}
          <path d="M308 22V50" stroke="#7A35C8" strokeWidth="3" />
        </g>
      ),
    },
    bas: {
      fenetre: "0 360 330 52",
      hauteur: 52,
      formes: (
        <g className={decor}>
          {lignesDePortee(376)}
          {note(100, 400, false)}
          {note(146, 393, false)}
          {note(194, 386, false)}
          <path d="M300 376V404M308 376V404" stroke="#7A35C8" strokeWidth="3" />
        </g>
      ),
    },
  },
};
