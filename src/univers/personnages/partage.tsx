import type { ReactNode } from "react";
import { motion, type SVGMotionProps } from "motion/react";
import type { Humeur } from "@domain/motivation";

export type DessinDuPersonnage = (
  props: { readonly humeur: Humeur; readonly id: string; readonly tenue?: string },
) => ReactNode;

export function choisir<T>(humeur: Humeur, parHumeur: Readonly<Record<Humeur, T>>): T {
  return parHumeur[humeur];
}

const CLIGNEMENT: SVGMotionProps<SVGGElement> = {
  animate: { scaleY: [1, 1, 0.1, 1] },
  transition: { duration: 0.3, times: [0, 0.1, 0.5, 1], repeat: Infinity, repeatDelay: 3.5 },
  style: { transformBox: "fill-box", transformOrigin: "center" },
};

export function Yeux({ children }: { readonly children: ReactNode }) {
  return <motion.g {...CLIGNEMENT}>{children}</motion.g>;
}
