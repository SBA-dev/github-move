import { BoutGauche, type DessinDeBulle } from "./dessin-de-bulle.tsx";

/** Bulle bleue à étoile d'insigne : capsule bleu très clair, petite étoile fixe sur un bout. */
export const BULLE_DE_LA_POLICE: DessinDeBulle = {
  fond: "#EEF4FF",
  trait: () => "#253B9C",
  decor: (mesures) => (
    <BoutGauche mesures={mesures}>
      <path
        d="M28 16.8L31.03 23.83L38.65 24.54L32.9 29.59L34.58 37.06L28 33.15L21.42 37.06L23.1 29.59L17.35 24.54L24.97 23.83Z"
        fill="#7F9DEC"
        stroke="#253B9C"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </BoutGauche>
  ),
};
