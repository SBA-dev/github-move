import { useEffect, useState } from "react";
import { type Defi, defiOuvertParLaSeance, type GrandDefi, parcoursDeLaMatiere } from "@domain/apprentissage";
import type { MeilleuresEtoilesDuProfil } from "@domain/motivation";
import { entreesAvantEtApresLaSeance, type Seance } from "../seance/fin-de-seance/entrees-avant-et-apres-la-seance.ts";
import { lireLesDefisReleves } from "./lire-les-defis-releves.ts";

export type DefiOuvert = { readonly pret: boolean; readonly defi: Defi | GrandDefi | undefined };

async function defiOuvertParLaSeanceTerminee(
  seance: Seance,
  niveau: string,
  meilleuresAvant: Promise<MeilleuresEtoilesDuProfil | undefined>,
): Promise<Defi | GrandDefi | undefined> {
  const [entrees, defisReleves] = await Promise.all([
    entreesAvantEtApresLaSeance(seance, niveau, meilleuresAvant),
    lireLesDefisReleves(seance.enfant),
  ]);
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
 * Le défi que la séance a ouvert, une fois lues les meilleures étoiles d'avant la séance.
 * Sans elles (lecture impossible) ou sans bibliothèque, aucun défi n'est annoncé.
 */
export function useDefiOuvertParLaSeance(
  seance: Seance,
  niveau: string,
  meilleuresAvant: Promise<MeilleuresEtoilesDuProfil | undefined>,
  terminee: boolean,
): DefiOuvert {
  const [ouvert, setOuvert] = useState<DefiOuvert>({ pret: false, defi: undefined });
  const { enfant, lecon } = seance;
  useEffect(() => {
    if (!terminee) return;
    let annule = false;
    void defiOuvertParLaSeanceTerminee({ enfant, lecon }, niveau, meilleuresAvant)
      .catch(() => undefined)
      .then((defi) => {
        if (!annule) setOuvert({ pret: true, defi });
      });
    return () => {
      annule = true;
    };
  }, [enfant, lecon, niveau, meilleuresAvant, terminee]);
  return ouvert;
}
