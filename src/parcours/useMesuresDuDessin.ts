import { type RefObject, useLayoutEffect, useState } from "react";
import { type Boite, centreDe, centreDeLaFin, emplacementAcoteDeLaLecon, emplacementSurLaColline, type Point } from "./geometrie-du-dessin.ts";

/** Ce que le dessin du parcours lit sur l'écran : où sont les leçons, et où le personnage guide peut se tenir. */
export type MesuresDuDessin = {
  readonly largeur: number;
  readonly hauteur: number;
  /** Le centre de chaque leçon, puis celui de la fin du dessin. */
  readonly centres: readonly Point[];
  /** Où se tient le personnage guide sur chaque leçon, puis à la fin du dessin. */
  readonly emplacements: readonly Point[];
};

const SELECTEUR_DES_LECONS = "ol > li[data-lecon] > button";
const SELECTEUR_DE_LA_FIN = '[data-testid="fin-du-dessin"]';

function boiteDe(element: HTMLElement): Boite {
  return { x: element.offsetLeft, y: element.offsetTop, largeur: element.offsetWidth, hauteur: element.offsetHeight };
}

function mesurer(dessin: HTMLElement): MesuresDuDessin {
  const lecons = [...dessin.querySelectorAll<HTMLElement>(SELECTEUR_DES_LECONS)].map(boiteDe);
  const fin = dessin.querySelector<HTMLElement>(SELECTEUR_DE_LA_FIN);
  const boiteDeLaFin = fin ? boiteDe(fin) : undefined;
  const largeur = dessin.offsetWidth;
  return {
    largeur,
    hauteur: dessin.offsetHeight,
    centres: [...lecons.map(centreDe), ...(boiteDeLaFin ? [centreDeLaFin(boiteDeLaFin)] : [])],
    emplacements: [
      ...lecons.map((lecon) => emplacementAcoteDeLaLecon(lecon, largeur)),
      ...(boiteDeLaFin ? [emplacementSurLaColline(boiteDeLaFin)] : []),
    ],
  };
}

/** Mesure le dessin à l'affichage, puis chaque fois que sa taille change (rotation, mode dys, police chargée). `undefined` avant la première mesure. */
export function useMesuresDuDessin(dessin: RefObject<HTMLElement | null>): MesuresDuDessin | undefined {
  const [mesures, setMesures] = useState<MesuresDuDessin>();
  useLayoutEffect(() => {
    const element = dessin.current;
    if (!element) return;
    const relever = () =>
      setMesures((actuelles) => {
        const nouvelles = mesurer(element);
        return JSON.stringify(actuelles) === JSON.stringify(nouvelles) ? actuelles : nouvelles;
      });
    relever();
    const observateur = new ResizeObserver(relever);
    observateur.observe(element);
    for (const enfant of element.querySelectorAll(`${SELECTEUR_DES_LECONS}, ${SELECTEUR_DE_LA_FIN}`)) observateur.observe(enfant);
    return () => observateur.disconnect();
  }, [dessin]);
  return mesures;
}
