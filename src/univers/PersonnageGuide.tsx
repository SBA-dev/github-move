import { useId } from "react";
import { motion, type TargetAndTransition, useReducedMotion } from "motion/react";
import type { Humeur, Univers } from "@domain/motivation";
import { APPARENCES } from "./apparences.ts";
import { Ecureuil, Humain } from "./dessins.tsx";

type Geste = "saute" | "penche" | "aucun";

const MOUVEMENT_PAR_GESTE: Readonly<Record<Geste, TargetAndTransition>> = {
  saute: { y: [0, -16, 0, -16, 0, -16, 0] },
  penche: { rotate: [0, -8, 6, 0] },
  aucun: { y: 0, rotate: 0 },
};

const DUREE_PAR_GESTE = { saute: 1.5, penche: 1.2, aucun: 0.2 } as const;

function gesteDe(humeur: Humeur, mouvementsReduits: boolean): Geste {
  if (mouvementsReduits) return "aucun";
  if (humeur === "applaudit") return "saute";
  if (humeur === "reflechit") return "penche";
  return "aucun";
}

export function PersonnageGuide({ univers, humeur }: { readonly univers: Univers; readonly humeur: Humeur }) {
  const identifiant = useId();
  const mouvementsReduits = useReducedMotion() ?? false;
  const geste = gesteDe(humeur, mouvementsReduits);
  const apparence = APPARENCES[univers.cle];
  return (
    <motion.div
      className="personnage-guide"
      role="img"
      aria-label={univers.personnageGuide.nom}
      data-testid="personnage-guide"
      data-humeur={humeur}
      data-geste={geste}
      animate={MOUVEMENT_PAR_GESTE[geste]}
      transition={{ duration: DUREE_PAR_GESTE[geste], ease: "easeInOut" }}
    >
      <motion.div
        animate={{ scaleY: [1, 1.03, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50% 100%" }}
      >
        {"animal" in apparence
          ? <Ecureuil humeur={humeur} id={identifiant} />
          : <Humain apparence={apparence} humeur={humeur} id={identifiant} />}
      </motion.div>
    </motion.div>
  );
}
