import type { ReactNode } from "react";
import { motion, type SVGMotionProps, useReducedMotion } from "motion/react";
import type { Humeur } from "@domain/motivation";

export type DessinDuPersonnage = (
  props: { readonly humeur: Humeur; readonly id: string; readonly tenue?: string },
) => ReactNode;

export function choisir<T>(humeur: Humeur, parHumeur: Readonly<Record<Humeur, T>>): T {
  return parHumeur[humeur];
}

const CLIGNEMENT_ANIME = [1, 1, 0.1, 1];
const TRANSITION_DU_CLIGNEMENT = { duration: 0.3, times: [0, 0.1, 0.5, 1], repeat: Infinity, repeatDelay: 3.5 };

const CLIGNEMENT: SVGMotionProps<SVGGElement> = {
  style: { transformBox: "fill-box", transformOrigin: "center" },
};

export function Yeux({ children }: { readonly children: ReactNode }) {
  const mouvementsReduits = useReducedMotion() ?? false;
  return (
    <motion.g key={String(mouvementsReduits)} {...CLIGNEMENT} animate={{ scaleY: mouvementsReduits ? 1 : CLIGNEMENT_ANIME }} transition={mouvementsReduits ? { duration: 0 } : TRANSITION_DU_CLIGNEMENT}>
      {children}
    </motion.g>
  );
}
