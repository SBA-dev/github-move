import { useId } from "react";
import { motion, type TargetAndTransition, useReducedMotion } from "motion/react";
import type { CleUnivers, Humeur, Univers } from "@domain/motivation";
import { useTenueDuProfil } from "../tenue/TenueDuProfil.tsx";
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

/** Capitaine Sam garde son dessin d'avant la refonte. */
const DESSINS_REDESSINES: ReadonlySet<CleUnivers> = new Set(["sports", "danse", "animaux", "princesse", "police"]);

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

type Props = {
  readonly univers: Univers;
  readonly humeur: Humeur;
  /** Clé de la tenue à montrer ; à défaut, celle que l'enfant a choisie (aucune hors de ses écrans). */
  readonly tenue?: string;
  /** Là où la tenue compte, le dessin est annoncé aux lecteurs d'écran ; ailleurs il reste décoratif. */
  readonly libelle?: string;
  readonly identifiantDeTest?: string;
};

export function PersonnageGuide({ univers, humeur, tenue: tenueDemandee, libelle, identifiantDeTest }: Props) {
  const tenueDuProfil = useTenueDuProfil();
  const tenue = tenueDemandee ?? tenueDuProfil;
  const identifiant = useId();
  const mouvementsReduits = useReducedMotion() ?? false;
  const geste = gesteDe(humeur, mouvementsReduits);
  const Dessin = DESSINS[univers.cle];
  return (
    <motion.div
      className="personnage-guide"
      {...(libelle === undefined ? { "aria-hidden": "true" } : { role: "img", "aria-label": libelle })}
      data-testid={identifiantDeTest ?? "personnage-guide"}
      data-personnage-guide={univers.personnageGuide.nom}
      data-humeur={humeur}
      {...(DESSINS_REDESSINES.has(univers.cle) ? { "data-dessin": "valide" } : {})}
      {...(tenue === undefined ? {} : { "data-tenue": tenue })}
      data-geste={geste}
      animate={MOUVEMENT_PAR_GESTE[geste]}
      transition={{ duration: DUREE_PAR_GESTE[geste], ease: "easeInOut" }}
    >
      <motion.div
        animate={{ scaleY: [1, 1.03, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        style={{ transformOrigin: "50% 100%" }}
      >
        <Dessin humeur={humeur} id={identifiant} tenue={tenue} />
      </motion.div>
    </motion.div>
  );
}
