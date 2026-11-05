import { useEffect, useState } from "react";
import { matiereReussieParLaSeance } from "@domain/apprentissage";
import type { EntreesAvantEtApres } from "./entrees-avant-et-apres-la-seance.ts";

export type MatiereReussie = { readonly pret: boolean; readonly reussie: boolean };

/**
 * Vrai si la séance rend la matière de sa leçon réussie, une fois lues les entrées du parcours d'avant et d'après la séance.
 * Sans elles (lecture impossible ou sans bibliothèque), la matière n'est pas annoncée réussie.
 */
export function useMatiereReussieParLaSeance(
  entrees: Promise<EntreesAvantEtApres | undefined> | undefined,
  terminee: boolean,
): MatiereReussie {
  const [resultat, setResultat] = useState<MatiereReussie>({ pret: false, reussie: false });
  useEffect(() => {
    if (!terminee || !entrees) return;
    let annule = false;
    void entrees
      .then((lues) => lues !== undefined && matiereReussieParLaSeance(lues.avant, lues.apres, lues.matiere))
      .catch(() => false)
      .then((reussie) => {
        if (!annule) setResultat({ pret: true, reussie });
      });
    return () => {
      annule = true;
    };
  }, [entrees, terminee]);
  return resultat;
}
