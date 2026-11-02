import { BoutDroit, BoutGauche, type DessinDeBulle } from "./dessin-de-bulle.tsx";

const COUTURES = "M15.4 8.4Q28 28 15.4 47.6M5.6 19.04Q11.2 28 5.6 36.96";

/** Ballon de sport : capsule claire avec les coutures d'un ballon sur les deux bouts seulement. */
export const BULLE_DES_SPORTS: DessinDeBulle = {
  fond: "#FFFFFF",
  trait: () => "#1F63D8",
  decor: (mesures) => (
    <>
      <BoutGauche mesures={mesures}>
        <path d={COUTURES} fill="none" stroke="#1F63D8" strokeWidth="2.6" strokeLinecap="round" />
      </BoutGauche>
      <BoutDroit mesures={mesures}>
        <g transform="translate(156 0) scale(-1 1)">
          <path d={COUTURES} fill="none" stroke="#1F63D8" strokeWidth="2.6" strokeLinecap="round" />
        </g>
      </BoutDroit>
    </>
  ),
};
