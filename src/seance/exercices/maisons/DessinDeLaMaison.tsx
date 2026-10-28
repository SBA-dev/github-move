import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import type { CleUnivers } from "@domain/motivation";
import { DESSINS_DES_MAISONS } from "./dessins/index.ts";

export const DUREE_DE_L_OUVERTURE_S = 0.35;

type Props = {
  readonly univers: CleUnivers;
  readonly ouverte: boolean;
  readonly allumee: boolean;
};

/**
 * Le dessin d'une maison : décor pour les yeux, jamais annoncé. La porte s'ouvre d'abord, puis la maison s'allume ;
 * avec les mouvements réduits, tout change d'un coup.
 */
export function DessinDeLaMaison({ univers, ouverte, allumee }: Props) {
  const p = useId();
  const mouvementsReduits = useReducedMotion();
  const { ouverture, degrades, fermee, ouverte: allumeeEtOuverte } = DESSINS_DES_MAISONS[univers];
  const transition = mouvementsReduits ? { duration: 0 } : { duration: DUREE_DE_L_OUVERTURE_S, ease: "easeOut" } as const;
  const horizontale = ouverture === "horizontale";
  const porteFermee = ouverte ? (horizontale ? { opacity: 0, scaleX: 0 } : { opacity: 0, scaleY: 0 }) : { opacity: 1, scaleX: 1, scaleY: 1 };
  const origine = horizontale ? "0% 50%" : "50% 0%";
  return (
    <svg className="dessin-de-la-maison" data-testid="dessin-de-la-maison" viewBox="0 0 200 200" aria-hidden="true" focusable="false">
      <defs>{degrades(p)}</defs>
      <g>
        {fermee.sol(p)}
        {fermee.maison(p)}
        {fermee.interieur(p)}
      </g>
      <motion.g initial={false} animate={{ opacity: allumee ? 1 : 0 }} transition={transition}>
        {allumeeEtOuverte.sol(p)}
        {allumeeEtOuverte.maison(p)}
        {allumeeEtOuverte.interieur(p)}
      </motion.g>
      <g data-testid="porte">
        <motion.g initial={false} animate={porteFermee} transition={transition} style={{ transformBox: "fill-box", transformOrigin: origine }}>
          {fermee.porte(p)}
        </motion.g>
        <motion.g initial={false} animate={{ opacity: ouverte ? 1 : 0 }} transition={transition}>
          {allumeeEtOuverte.porte(p)}
        </motion.g>
      </g>
    </svg>
  );
}
