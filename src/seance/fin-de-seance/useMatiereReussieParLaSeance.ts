import { useEffect, useState } from "react";
import { matiereReussieParLaSeance } from "@domain/apprentissage";
import type { MeilleuresEtoilesDuProfil } from "@domain/motivation";
import { entreesAvantEtApresLaSeance, type Seance } from "./entrees-avant-et-apres-la-seance.ts";

export type MatiereReussie = { readonly pret: boolean; readonly reussie: boolean };

/**
 * Vrai si la séance rend la matière de sa leçon réussie, une fois lues les meilleures étoiles d'avant la séance.
 * Sans elles (lecture impossible) ou sans bibliothèque, la matière n'est pas annoncée réussie.
 */
export function useMatiereReussieParLaSeance(
  seance: Seance,
  niveau: string,
  meilleuresAvant: Promise<MeilleuresEtoilesDuProfil | undefined>,
  terminee: boolean,
): MatiereReussie {
  const [resultat, setResultat] = useState<MatiereReussie>({ pret: false, reussie: false });
  const { enfant, lecon } = seance;
  useEffect(() => {
    if (!terminee) return;
    let annule = false;
    void entreesAvantEtApresLaSeance({ enfant, lecon }, niveau, meilleuresAvant)
      .then((entrees) => entrees !== undefined && matiereReussieParLaSeance(entrees.avant, entrees.apres, entrees.matiere))
      .catch(() => false)
      .then((reussie) => {
        if (!annule) setResultat({ pret: true, reussie });
      });
    return () => {
      annule = true;
    };
  }, [enfant, lecon, niveau, meilleuresAvant, terminee]);
  return resultat;
}
