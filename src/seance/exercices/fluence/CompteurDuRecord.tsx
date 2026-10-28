import { useEffect, useState } from "react";
import { animate } from "motion";
import { useReducedMotion } from "motion/react";

const DUREE_DU_DEFILEMENT_EN_S = 1;

/** Le compteur défile de 0 jusqu'au nouveau record ; avec les mouvements réduits, il affiche tout de suite le record. */
export function CompteurDuRecord({ record }: { readonly record: number }) {
  const sansMouvement = useReducedMotion();
  const [valeur, setValeur] = useState(sansMouvement ? record : 0);
  useEffect(() => {
    if (sansMouvement) {
      setValeur(record);
      return;
    }
    const animation = animate(0, record, {
      duration: DUREE_DU_DEFILEMENT_EN_S,
      ease: "easeOut",
      onUpdate: (courante) => setValeur(Math.round(courante)),
    });
    return () => animation.stop();
  }, [record, sansMouvement]);
  return (
    <p
      className="compteur-du-record"
      aria-hidden="true"
      data-testid="compteur-du-record"
      data-record={record}
      data-etat={valeur === record ? "arrive" : "defile"}
    >
      Record : {valeur}
    </p>
  );
}
