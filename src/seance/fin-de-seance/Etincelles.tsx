import { motion, useReducedMotion } from "motion/react";

const ETINCELLES = [
  { gauche: "8%", delai: 0 },
  { gauche: "28%", delai: 0.3 },
  { gauche: "50%", delai: 0.1 },
  { gauche: "72%", delai: 0.4 },
  { gauche: "90%", delai: 0.2 },
] as const;

/** Décor de fête : absent quand l'appareil demande des mouvements réduits. */
export function Etincelles() {
  if (useReducedMotion()) return null;
  return (
    <div className="etincelles" aria-hidden="true" data-testid="etincelles">
      {ETINCELLES.map(({ gauche, delai }) => (
        <motion.span
          key={gauche}
          style={{ left: gauche }}
          initial={{ opacity: 0, y: 0, scale: 0.4 }}
          animate={{ opacity: [0, 1, 0], y: [0, -24, -48], scale: [0.4, 1, 0.6] }}
          transition={{ duration: 1.6, delay: delai, repeat: Infinity }}
        />
      ))}
    </div>
  );
}
