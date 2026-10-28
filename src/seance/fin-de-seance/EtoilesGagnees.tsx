import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const ETOILES_POSSIBLES = [1, 2, 3] as const;
const POINTS_DE_L_ETOILE = "12,2 15,9 22,9.5 16.5,14 18.5,21.5 12,17.5 5.5,21.5 7.5,14 2,9.5 9,9";
const ECART_ENTRE_DEUX_ETOILES_EN_S = 0.1;
const DUREE_DE_L_APPARITION_EN_S = 0.25;

type Props = {
  readonly nombre: number;
  /** Appelé une fois, quand toutes les étoiles gagnées sont affichées (tout de suite avec les mouvements réduits). */
  readonly onToutesAffichees: () => void;
};

/** Les étoiles gagnées apparaissent une à une avec un rebond ; avec les mouvements réduits, elles sont là tout de suite. Décoratif : le texte voisin dit la même chose. */
export function EtoilesGagnees({ nombre, onToutesAffichees }: Props) {
  const sansMouvement = useReducedMotion();
  const [apparues, setApparues] = useState(0);
  const toutesAffichees = sansMouvement || nombre === 0 || apparues >= nombre;
  useEffect(() => {
    if (toutesAffichees) onToutesAffichees();
  }, [toutesAffichees, onToutesAffichees]);
  return (
    <div
      className="etoiles-dessinees"
      aria-hidden="true"
      data-testid="etoiles-dessinees"
      data-etat={toutesAffichees ? "affichees" : "apparition"}
    >
      {ETOILES_POSSIBLES.map((rang) => {
        const gagnee = rang <= nombre;
        const apparait = gagnee && !sansMouvement;
        return (
          <motion.svg
            key={rang}
            viewBox="0 0 24 24"
            data-testid="etoile"
            data-allumee={gagnee ? "true" : "false"}
            data-apparue={gagnee ? String(!apparait || apparues >= rang) : undefined}
            initial={apparait ? { opacity: 0, scale: 0.3 } : false}
            animate={{ opacity: 1, scale: apparait ? [0.3, 1.25, 1] : 1 }}
            transition={{
              duration: DUREE_DE_L_APPARITION_EN_S,
              delay: (rang - 1) * ECART_ENTRE_DEUX_ETOILES_EN_S,
              times: [0, 0.6, 1],
              ease: "easeOut",
            }}
            onAnimationComplete={apparait ? () => setApparues((deja) => Math.max(deja, rang)) : undefined}
          >
            <polygon points={POINTS_DE_L_ETOILE} />
          </motion.svg>
        );
      })}
    </div>
  );
}
