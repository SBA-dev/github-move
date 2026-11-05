import { useEffect, useState } from "react";
import { type Defi, defiOuvertParLaSeance, type GrandDefi, parcoursDeLaMatiere } from "@domain/apprentissage";
import type { EntreesAvantEtApres } from "../seance/fin-de-seance/entrees-avant-et-apres-la-seance.ts";
import { lireLesDefisReleves } from "./lire-les-defis-releves.ts";

export type DefiOuvert = { readonly pret: boolean; readonly defi: Defi | GrandDefi | undefined };

async function defiOuvertParLaSeanceTerminee(
  enfant: string,
  entreesAvantEtApres: Promise<EntreesAvantEtApres | undefined>,
): Promise<Defi | GrandDefi | undefined> {
  const [entrees, defisReleves] = await Promise.all([entreesAvantEtApres, lireLesDefisReleves(enfant)]);
  if (!entrees) return undefined;
  const { avant, apres, matiere } = entrees;
  return defiOuvertParLaSeance(
    parcoursDeLaMatiere(avant, matiere),
    parcoursDeLaMatiere(apres, matiere),
    matiere,
    entrees.niveau,
    defisReleves,
  );
}

/**
 * Le défi que la séance a ouvert, une fois lues les entrées du parcours d'avant et d'après la séance.
 * Sans elles (lecture impossible ou sans bibliothèque), aucun défi n'est annoncé.
 */
export function useDefiOuvertParLaSeance(
  enfant: string,
  entrees: Promise<EntreesAvantEtApres | undefined>,
  terminee: boolean,
): DefiOuvert {
  const [ouvert, setOuvert] = useState<DefiOuvert>({ pret: false, defi: undefined });
  useEffect(() => {
    if (!terminee) return;
    let annule = false;
    void defiOuvertParLaSeanceTerminee(enfant, entrees)
      .catch(() => undefined)
      .then((defi) => {
        if (!annule) setOuvert({ pret: true, defi });
      });
    return () => {
      annule = true;
    };
  }, [enfant, entrees, terminee]);
  return ouvert;
}
