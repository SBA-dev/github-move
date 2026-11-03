import { BoutDroit, BoutGauche, type DessinDeBulle } from "./dessin-de-bulle.tsx";

/** Bulle d'eau : capsule bleu-vert claire, reflet en goutte, comme une bulle sortie de la lance à eau. */
export const BULLE_DES_POMPIERS: DessinDeBulle = {
  fond: "#EAFAF8",
  trait: () => "#1A8CA6",
  decor: (mesures) => (
    <>
      <BoutGauche mesures={mesures}>
        <path d="M22.4 14.8Q29.4 24.8 27.4 28.8A5.5 5.5 0 1 1 17.4 28.8Q15.4 24.8 22.4 14.8Z" fill="#fff" stroke="#6CCBDC" strokeWidth="1.6" strokeLinejoin="round" />
      </BoutGauche>
      <BoutDroit mesures={mesures}>
        <circle cx="138.64" cy="14" r="3" fill="#fff" stroke="#6CCBDC" strokeWidth="1.4" />
        <circle cx="144.8" cy="30.8" r="2.2" fill="#fff" stroke="#6CCBDC" strokeWidth="1.2" />
      </BoutDroit>
    </>
  ),
};
