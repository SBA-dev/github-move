import { BoutDroit, Fixe, type DessinDeBulle } from "./dessin-de-bulle.tsx";

/** Bulle magique irisée : contour aux couleurs de l'arc-en-ciel pâle, petite étoile fixe sur un bout. */
export const BULLE_DES_PRINCESSES: DessinDeBulle = {
  fond: "#FDF8FF",
  trait: (p) => `url(#${p}-arc)`,
  degrades: (p) => (
    <linearGradient id={`${p}-arc`} x1="0" x2="1">
      <stop offset="0" stopColor="#EE8FC3" />
      <stop offset=".35" stopColor="#B992EC" />
      <stop offset=".7" stopColor="#8DB8F2" />
      <stop offset="1" stopColor="#86D8B8" />
    </linearGradient>
  ),
  decor: (mesures) => (
    <>
      <BoutDroit mesures={mesures}>
        <path
          d="M128 18.48L130.57 24.46L137.05 25.06L132.16 29.35L133.6 35.7L128 32.38L122.4 35.7L123.84 29.35L118.95 25.06L125.43 24.46Z"
          fill="#E4C8FA"
          stroke="#8A52BE"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </BoutDroit>
      <Fixe mesures={mesures} cote="droit" x={140.6} y={43.4}>
        <circle r="2.2" fill="#9FD8F5" />
      </Fixe>
      <Fixe mesures={mesures} cote="gauche" x={17.36} y={17.36}>
        <circle r="2.6" fill="#C9A8F2" />
      </Fixe>
      <Fixe mesures={mesures} cote="gauche" x={11.2} y={29.4}>
        <circle r="2" fill="#F5A9D2" />
      </Fixe>
    </>
  ),
};
