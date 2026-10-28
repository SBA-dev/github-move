import { useEffect, useState } from "react";
import { leconAcquiseParLaSeance } from "@domain/apprentissage";
import type { MeilleuresEtoilesDuProfil } from "@domain/motivation";

export type LeconAcquise = { readonly pret: boolean; readonly acquise: boolean };

/**
 * Vrai si la séance rend la leçon acquise pour la première fois, une fois lues les meilleures étoiles d'avant la séance.
 * Sans elles (lecture impossible), la leçon n'est pas annoncée acquise.
 */
export function useLeconAcquiseParLaSeance(
  meilleuresAvant: Promise<MeilleuresEtoilesDuProfil | undefined>,
  lecon: string,
  terminee: boolean,
  etoiles: number | undefined,
): LeconAcquise {
  const [resultat, setResultat] = useState<LeconAcquise>({ pret: false, acquise: false });
  useEffect(() => {
    if (!terminee) return;
    let annule = false;
    void meilleuresAvant
      .then((avant) => avant !== undefined && leconAcquiseParLaSeance(avant, lecon, etoiles) !== undefined)
      .catch(() => false)
      .then((acquise) => {
        if (!annule) setResultat({ pret: true, acquise });
      });
    return () => {
      annule = true;
    };
  }, [meilleuresAvant, lecon, terminee, etoiles]);
  return resultat;
}
