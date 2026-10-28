import { useId } from "react";
import type { CleUnivers } from "@domain/motivation";
import { PALETTES } from "../univers/palettes.ts";

const FLEURS = [
  { x: 60, y: 104, petales: "#FFFFFF" },
  { x: 92, y: 90, petales: "#FF8FA8" },
  { x: 226, y: 88, petales: "#FFC93C" },
  { x: 262, y: 106, petales: "#FFFFFF" },
  { x: 140, y: 112, petales: "#FF8FA8" },
  { x: 210, y: 114, petales: "#FFFFFF" },
] as const;

function Fleur({ x, y, petales }: (typeof FLEURS)[number]) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <g fill={petales}>
        <circle cx="0" cy="-5" r="4" />
        <circle cx="0" cy="5" r="4" />
        <circle cx="-5" cy="0" r="4" />
        <circle cx="5" cy="0" r="4" />
      </g>
      <circle r="3.2" fill="#FFC93C" />
    </g>
  );
}

/** L'arrivée du dessin du parcours : un fanion à la couleur de l'univers, sur une petite colline fleurie. Aucune étoile, aucun texte, aucune récompense. */
export function FinDuDessin({ univers }: { readonly univers: CleUnivers }) {
  const palette = PALETTES[univers];
  const identifiant = useId();
  const herbe = `${identifiant}-herbe`;
  return (
    <div className="fin-du-dessin" data-testid="fin-du-dessin" data-univers={univers} aria-hidden="true">
      <svg viewBox="0 0 300 130" overflow="visible">
        <defs>
          <radialGradient id={herbe} cx="35%" cy="30%" r="80%">
            <stop offset="0" stopColor={palette.collines[0]} />
            <stop offset="1" stopColor={palette.collines[1]} />
          </radialGradient>
        </defs>
        <path
          data-testid="colline"
          d="M0 130 C 30 84 90 58 150 58 C 215 58 270 84 300 130 Z"
          fill={`url(#${herbe})`}
          stroke={palette.collines[2]}
          strokeWidth="3"
          strokeLinejoin="round"
        />
        <g data-testid="fleurs">
          {FLEURS.map((fleur) => <Fleur key={`${fleur.x}-${fleur.y}`} {...fleur} />)}
        </g>
        <g data-testid="fanion" data-couleur={palette.principale}>
          <line x1="186" y1="64" x2="186" y2="12" stroke="#5E3416" strokeWidth="4" strokeLinecap="round" />
          <path d="M188 14 L228 26 L188 40 Z" fill={palette.principale} stroke={palette.foncee} strokeWidth="3" strokeLinejoin="round" />
          <ellipse cx="186" cy="66" rx="9" ry="4" fill={palette.collines[2]} />
        </g>
      </svg>
    </div>
  );
}
