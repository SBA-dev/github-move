import { BoutGauche, Fixe, type DessinDeBulle, type Mesures } from "./dessin-de-bulle.tsx";

const PARTIE_HAUTE = 0.32;

/** Arc irisé le long du bord haut, du bout gauche au bout droit. */
function ArcIrise({ largeur, hauteur, p }: Mesures) {
  const rayon = (hauteur - 12) / 2;
  const contour = `M${6 + rayon} 6H${largeur - 6 - rayon}A${rayon} ${rayon} 0 0 1 ${largeur - 6 - rayon} ${hauteur - 6}H${6 + rayon}A${rayon} ${rayon} 0 0 1 ${6 + rayon} 6Z`;
  return (
    <>
      <clipPath id={`${p}-haut`}>
        <rect x="0" y="0" width={largeur} height={hauteur * PARTIE_HAUTE} />
      </clipPath>
      <path d={contour} fill="none" stroke={`url(#${p}-iris)`} strokeWidth="3.5" strokeLinecap="round" clipPath={`url(#${p}-haut)`} />
    </>
  );
}

/** Bulle de savon : capsule claire, reflet irisé sur le bord haut, petit reflet blanc en haut à gauche. */
export const BULLE_DES_ANIMAUX: DessinDeBulle = {
  fond: "#F4FBFF",
  trait: () => "#5E8DB5",
  degrades: (p) => (
    <linearGradient id={`${p}-iris`} x1="0" x2="1">
      <stop offset="0" stopColor="#F5A9D2" />
      <stop offset=".33" stopColor="#9FD8F5" />
      <stop offset=".66" stopColor="#A8EBC4" />
      <stop offset="1" stopColor="#C9A8F2" />
    </linearGradient>
  ),
  decor: (mesures) => (
    <>
      <ArcIrise {...mesures} />
      <BoutGauche mesures={mesures}>
        <ellipse cx="20.16" cy="15.4" rx="5.6" ry="2.8" transform="rotate(-35 20.16 15.4)" fill="#fff" />
      </BoutGauche>
      <Fixe mesures={mesures} cote="droit" x={136.4} y={40.6}>
        <circle r="2.6" fill="#fff" stroke="#9FD8F5" strokeWidth="1.2" />
      </Fixe>
    </>
  ),
};
