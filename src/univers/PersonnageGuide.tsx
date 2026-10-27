import { useId } from "react";
import { motion, type TargetAndTransition, useReducedMotion } from "motion/react";
import type { CleUnivers, Humeur, Univers } from "@domain/motivation";
import { AgentMax } from "./personnages/AgentMax.tsx";
import { CapitaineSam } from "./personnages/CapitaineSam.tsx";
import { CoachLeo } from "./personnages/CoachLeo.tsx";
import { Lili } from "./personnages/Lili.tsx";
import { Lumi } from "./personnages/Lumi.tsx";
import { Noisette } from "./personnages/Noisette.tsx";
import type { DessinDuPersonnage } from "./personnages/partage.tsx";

const DESSINS: Readonly<Record<CleUnivers, DessinDuPersonnage>> = {
  sports: CoachLeo,
  danse: Lili,
  animaux: Noisette,
  princesse: Lumi,
  police: AgentMax,
  pompier: CapitaineSam,
};

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
  const Dessin = DESSINS[univers.cle];
  return (
    <motion.div
      className="personnage-guide"
      aria-hidden="true"
      data-testid="personnage-guide"
      data-personnage-guide={univers.personnageGuide.nom}
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
        <Dessin humeur={humeur} id={identifiant} />
      </motion.div>
    </motion.div>
  );
}
