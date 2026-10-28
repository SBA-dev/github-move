import { useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const NOMBRE_DE_CONFETTIS = 16;
const DUREE_DE_LA_CHUTE_EN_S = 0.8;
const ECART_MAXIMAL_DU_DEPART_EN_S = 0.2;

const CONFETTIS = Array.from({ length: NOMBRE_DE_CONFETTIS }, (_, rang) => ({
  gauche: `${4 + Math.round((rang * 92) / (NOMBRE_DE_CONFETTIS - 1))}%`,
  delai: (rang * ECART_MAXIMAL_DU_DEPART_EN_S) / (NOMBRE_DE_CONFETTIS - 1),
  derive: rang % 2 === 0 ? 24 : -24,
  tour: rang % 3 === 0 ? -360 : 360,
}));
const DERNIER = NOMBRE_DE_CONFETTIS - 1;

/**
 * Des confettis qui tombent, 1 s au plus : `transform` et `opacity` seulement, sans hasard ni clignotement.
 * Ils ne captent aucun toucher et ne prennent jamais le focus. Absents quand l'appareil demande des mouvements réduits.
 */
export function Confettis() {
  const [etat, setEtat] = useState<"tombent" | "tombes">("tombent");
  if (useReducedMotion()) return null;
  return (
    <div className="confettis" aria-hidden="true" data-testid="confettis" data-etat={etat}>
      {etat === "tombent" && CONFETTIS.map(({ gauche, delai, derive, tour }, rang) => (
        <motion.span
          key={gauche}
          className="confetti"
          style={{ left: gauche }}
          initial={{ y: "-5vh", x: 0, rotate: 0, opacity: 1 }}
          animate={{ y: "105vh", x: derive, rotate: tour, opacity: [1, 1, 0] }}
          transition={{ duration: DUREE_DE_LA_CHUTE_EN_S, delay: delai, ease: "easeIn", opacity: { times: [0, 0.8, 1] } }}
          onAnimationComplete={rang === DERNIER ? () => setEtat("tombes") : undefined}
        />
      ))}
    </div>
  );
}
