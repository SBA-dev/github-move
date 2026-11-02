import { BoutDroit, BoutGauche, type DessinDeBulle } from "./dessin-de-bulle.tsx";

const TRAIT = "#B565AE";

/** Bulle à paillettes : capsule claire, paillettes fixes sur le contour des bouts seulement. */
export const BULLE_DE_LA_DANSE: DessinDeBulle = {
  fond: "#FFFAFE",
  trait: () => TRAIT,
  decor: (mesures) => (
    <>
      <BoutGauche mesures={mesures}>
        <circle cx="15.38" cy="46.02" r="2.6" fill="#F4A5D2" stroke={TRAIT} strokeWidth="1" />
        <path d="M7.33 32.12L9.73 35.52L7.33 38.92L4.93 35.52Z" fill="#B58AE8" stroke={TRAIT} strokeWidth="1" />
        <circle cx="7.33" cy="20.48" r="2.6" fill="#7FD0F0" stroke={TRAIT} strokeWidth="1" />
        <path d="M15.38 6.58L17.78 9.98L15.38 13.38L12.98 9.98Z" fill="#FFFFFF" stroke={TRAIT} strokeWidth="1" />
      </BoutGauche>
      <BoutDroit mesures={mesures}>
        <circle cx="140.62" cy="9.98" r="2.6" fill="#F4A5D2" stroke={TRAIT} strokeWidth="1" />
        <path d="M148.67 17.08L151.07 20.48L148.67 23.88L146.27 20.48Z" fill="#B58AE8" stroke={TRAIT} strokeWidth="1" />
        <circle cx="148.67" cy="35.52" r="2.6" fill="#7FD0F0" stroke={TRAIT} strokeWidth="1" />
        <path d="M140.62 42.62L143.02 46.02L140.62 49.42L138.22 46.02Z" fill="#FFFFFF" stroke={TRAIT} strokeWidth="1" />
      </BoutDroit>
    </>
  ),
};
