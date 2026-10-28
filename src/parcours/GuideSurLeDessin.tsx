import { useState } from "react";
import { motion } from "motion/react";
import type { Univers } from "@domain/motivation";
import { PersonnageGuide } from "../univers/index.ts";
import type { Point } from "./geometrie-du-dessin.ts";

/** Une marche, d'un arrêt à un autre du dessin : des indices d'affichage, la fin du dessin étant l'arrêt qui suit la dernière leçon. */
export type Marche = { readonly depuis: number; readonly jusqua: number };

const DUREE_MAXIMALE_DE_LA_MARCHE_EN_SECONDES = 1.8;
const DUREE_DE_BASE_EN_SECONDES = 0.8;
const DUREE_PAR_LECON_EN_SECONDES = 0.25;

type Props = {
  readonly univers: Univers;
  /** Où le personnage guide peut se tenir : sur chaque leçon, puis à la fin du dessin. */
  readonly emplacements: readonly Point[];
  /** Le nom de chaque arrêt, tel qu'il est exposé : la place de la leçon, puis « fin ». */
  readonly noms: readonly string[];
  readonly arret: number;
  readonly marche: Marche | undefined;
  readonly onArrivee: () => void;
};

function dureeDeLaMarche(pas: number): number {
  return Math.min(DUREE_MAXIMALE_DE_LA_MARCHE_EN_SECONDES, DUREE_DE_BASE_EN_SECONDES + DUREE_PAR_LECON_EN_SECONDES * pas);
}

/** Le personnage guide sur le dessin : posé sur son arrêt, ou en marche le long du tracé (`transform` seulement). Il ne reçoit aucun toucher. */
export function GuideSurLeDessin({ univers, emplacements, noms, arret, marche, onArrivee }: Props) {
  const [enMarche, setEnMarche] = useState(marche !== undefined);
  const arrivee = emplacements[arret];
  if (!arrivee) return null;
  const pointsDeLaMarche = marche && enMarche ? emplacements.slice(marche.depuis, marche.jusqua + 1) : [arrivee];
  const depart = pointsDeLaMarche[0] ?? arrivee;
  const arriver = () => {
    if (!enMarche) return;
    setEnMarche(false);
    onArrivee();
  };
  return (
    <motion.div
      className="guide-du-dessin"
      data-testid="guide-du-dessin"
      data-place={noms[arret]}
      data-marche={marche === undefined ? "aucune" : enMarche ? "en-cours" : "terminee"}
      {...(marche ? { "data-marche-depuis": noms[marche.depuis], "data-marche-vers": noms[marche.jusqua], "data-marche-par": noms.slice(marche.depuis + 1, marche.jusqua).join(",") } : {})}
      initial={{ x: depart.x, y: depart.y }}
      animate={{ x: pointsDeLaMarche.map((point) => point.x), y: pointsDeLaMarche.map((point) => point.y) }}
      transition={{ duration: enMarche ? dureeDeLaMarche(pointsDeLaMarche.length - 1) : 0, ease: "easeInOut" }}
      onAnimationComplete={arriver}
    >
      <PersonnageGuide univers={univers} humeur="content" />
    </motion.div>
  );
}
