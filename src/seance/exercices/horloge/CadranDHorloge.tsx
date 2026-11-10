import { useId } from "react";
import type { HeureDeLHorloge } from "@domain/catalogue";

const CENTRE = 100;
const RAYON_DES_CHIFFRES = 70;
const RAYON_DES_GRADUATIONS = 86;
const CIRCONFERENCE_DES_GRADUATIONS = 2 * Math.PI * RAYON_DES_GRADUATIONS;
const HEURES_SUR_LE_CADRAN = 12;
const MINUTES_PAR_HEURE = 60;
const DEGRES_PAR_TOUR = 360;
const DEGRES_PAR_MINUTE_SUR_LE_CADRAN = DEGRES_PAR_TOUR / (HEURES_SUR_LE_CADRAN * MINUTES_PAR_HEURE);
const DEGRES_PAR_MINUTE = DEGRES_PAR_TOUR / MINUTES_PAR_HEURE;
const CHIFFRES_DU_CADRAN = Array.from({ length: HEURES_SUR_LE_CADRAN }, (_, rang) => rang + 1);

type Props = {
  readonly heure: HeureDeLHorloge;
  /** Dessiné seulement pour un exercice à la précision de la seconde. */
  readonly avecSecondes: boolean;
  /** Le libellé lu par les lecteurs d'écran : il ne dit l'heure qu'une fois la réponse donnée. */
  readonly libelle: string;
};

function positionDuChiffre(chiffre: number): { x: number; y: number } {
  const angle = (chiffre * DEGRES_PAR_TOUR / HEURES_SUR_LE_CADRAN) * Math.PI / 180;
  return { x: CENTRE + RAYON_DES_CHIFFRES * Math.sin(angle), y: CENTRE - RAYON_DES_CHIFFRES * Math.cos(angle) };
}

/** Un cadran à 12 chiffres, une petite aiguille (les heures), une grande (les minutes) et, au besoin, une fine pour les secondes. */
export function CadranDHorloge({ heure, avecSecondes, libelle }: Props) {
  const identifiant = useId();
  const minutesSurLeCadran = heure.surLeCadran();
  const angleDeLaPetiteAiguille = minutesSurLeCadran * DEGRES_PAR_MINUTE_SUR_LE_CADRAN;
  const angleDeLaGrandeAiguille = (minutesSurLeCadran % MINUTES_PAR_HEURE) * DEGRES_PAR_MINUTE;
  const angleDesSecondes = heure.secondes * DEGRES_PAR_MINUTE;
  return (
    <svg
      className="cadran-d-horloge"
      data-testid="horloge"
      viewBox="0 0 200 200"
      role="img"
      aria-label={libelle}
      focusable="false"
    >
      <defs>
        <radialGradient id={`${identifiant}-face`} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FFFDF5" />
          <stop offset="100%" stopColor="#FFE9B8" />
        </radialGradient>
      </defs>
      <circle cx={CENTRE} cy={CENTRE} r="96" fill="#4C8FF5" stroke="#5E3416" strokeWidth="4" />
      <circle cx={CENTRE} cy={CENTRE} r="90" fill={`url(#${identifiant}-face)`} stroke="#5E3416" strokeWidth="2" />
      <circle
        cx={CENTRE}
        cy={CENTRE}
        r={RAYON_DES_GRADUATIONS}
        fill="none"
        stroke="#9A7B56"
        strokeWidth="5"
        strokeDasharray={`1.4 ${CIRCONFERENCE_DES_GRADUATIONS / 60 - 1.4}`}
        strokeDashoffset="0.7"
        transform={`rotate(-90 ${CENTRE} ${CENTRE})`}
      />
      <circle
        cx={CENTRE}
        cy={CENTRE}
        r={RAYON_DES_GRADUATIONS}
        fill="none"
        stroke="#5E3416"
        strokeWidth="7"
        strokeDasharray={`3 ${CIRCONFERENCE_DES_GRADUATIONS / 12 - 3}`}
        strokeDashoffset="1.5"
        transform={`rotate(-90 ${CENTRE} ${CENTRE})`}
      />
      <g className="chiffres-du-cadran" fill="#2B1B0E" fontSize="17" fontWeight="800" textAnchor="middle" dominantBaseline="central">
        {CHIFFRES_DU_CADRAN.map((chiffre) => {
          const { x, y } = positionDuChiffre(chiffre);
          return <text key={chiffre} x={x} y={y}>{chiffre}</text>;
        })}
      </g>
      <g data-testid="petite-aiguille" transform={`rotate(${angleDeLaPetiteAiguille} ${CENTRE} ${CENTRE})`}>
        <rect x="93" y="64" width="14" height="46" rx="7" fill="#E8604C" stroke="#5E3416" strokeWidth="3" strokeLinejoin="round" />
      </g>
      <g data-testid="grande-aiguille" transform={`rotate(${angleDeLaGrandeAiguille} ${CENTRE} ${CENTRE})`}>
        <rect x="96" y="44" width="8" height="66" rx="4" fill="#2F6FD1" stroke="#5E3416" strokeWidth="3" strokeLinejoin="round" />
      </g>
      {avecSecondes && (
        <g data-testid="aiguille-des-secondes" transform={`rotate(${angleDesSecondes} ${CENTRE} ${CENTRE})`}>
          <rect x="98.5" y="38" width="3" height="76" rx="1.5" fill="#4FB37A" stroke="#5E3416" strokeWidth="1.5" />
        </g>
      )}
      <circle cx={CENTRE} cy={CENTRE} r="8" fill="#FFC93C" stroke="#5E3416" strokeWidth="3" />
    </svg>
  );
}
