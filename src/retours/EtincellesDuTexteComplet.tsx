import { useContext } from "react";
import { motion, useReducedMotion } from "motion/react";
import { ContexteDuRetour } from "./contexte-du-retour.ts";

const ETINCELLES = [
  { gauche: "10%", delai: 0 },
  { gauche: "30%", delai: 0.1 },
  { gauche: "50%", delai: 0.05 },
  { gauche: "70%", delai: 0.15 },
  { gauche: "90%", delai: 0.1 },
] as const;

/** Une petite pluie d'étincelles quand la dernière réponse complète l'exercice ; rien avec les mouvements réduits. */
export function EtincellesDuTexteComplet() {
  const retour = useContext(ContexteDuRetour);
  const mouvementsReduits = useReducedMotion();
  if (!retour?.complet || mouvementsReduits) return null;
  return (
    <div key={retour.numero} className="etincelles etincelles-du-texte" aria-hidden="true" data-testid="etincelles-du-texte" data-etincelles="texte-complet">
      {ETINCELLES.map(({ gauche, delai }) => (
        <motion.span
          key={gauche}
          style={{ left: gauche }}
          initial={{ opacity: 0, y: -16, scale: 0.4 }}
          animate={{ opacity: [0, 1, 0], y: [-16, 24, 56], scale: [0.4, 1, 0.6] }}
          transition={{ duration: 0.4, delay: delai, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}
