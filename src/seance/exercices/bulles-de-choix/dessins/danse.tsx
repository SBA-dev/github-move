import { type DessinDeBulle, Fixe, HAUTEUR_DE_REFERENCE, LARGEUR_DE_REFERENCE, type Mesures } from "./dessin-de-bulle.tsx";

const TRAIT = "#B565AE";
const MARGE_DU_BORD = 6;
type Paillette = { readonly degres: number; readonly forme: "rond" | "losange"; readonly couleur: string };

/** Les paillettes d'un bout, de bas en haut (angle sous l'axe de la bulle, négatif au-dessus). */
const PAILLETTES: readonly Paillette[] = [
  { degres: 55, forme: "rond", couleur: "#F4A5D2" },
  { degres: 20, forme: "losange", couleur: "#B58AE8" },
  { degres: -20, forme: "rond", couleur: "#7FD0F0" },
  { degres: -55, forme: "losange", couleur: "#FFFFFF" },
];

const Forme = ({ forme, couleur }: Omit<Paillette, "degres">) =>
  forme === "rond"
    ? <circle r="2.6" fill={couleur} stroke={TRAIT} strokeWidth="1" />
    : <path d="M0 -3.4L2.4 0L0 3.4L-2.4 0Z" fill={couleur} stroke={TRAIT} strokeWidth="1" />;

/** Les paillettes suivent le bout arrondi de la bulle de référence (56 sur 156), avec le plafond du décor ; leur taille, elle, ne change pas. Le bout droit est le miroir du gauche. */
function Paillettes({ mesures }: { readonly mesures: Mesures }) {
  const rayon = HAUTEUR_DE_REFERENCE / 2;
  const anneau = rayon - MARGE_DU_BORD;
  return (
    <>
      {([1, -1] as const).flatMap((cote) =>
        PAILLETTES.map(({ degres, ...paillette }) => {
          const radians = degres * Math.PI / 180;
          const x = (cote === 1 ? rayon : LARGEUR_DE_REFERENCE - rayon) - cote * anneau * Math.cos(radians);
          const y = rayon + cote * anneau * Math.sin(radians);
          return (
            <Fixe key={`${cote}-${degres}`} mesures={mesures} cote={cote === 1 ? "gauche" : "droit"} x={x} y={y}>
              <Forme {...paillette} />
            </Fixe>
          );
        })
      )}
    </>
  );
}

/** Bulle à paillettes : capsule claire, paillettes fixes sur le contour des bouts seulement. */
export const BULLE_DE_LA_DANSE: DessinDeBulle = {
  fond: "#FFFAFE",
  trait: () => TRAIT,
  decor: (mesures) => <Paillettes mesures={mesures} />,
};
