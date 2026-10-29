import { useEffect, useState } from "react";
import { type Defi, defiOuvertParLaSeance, Etoiles, meilleuresEtoilesReunies, parcoursDeLaMatiere } from "@domain/apprentissage";
import type { MeilleuresEtoilesDuProfil } from "@domain/motivation";
import { niveauDuProfil } from "../parcours/niveau-du-profil.ts";
import { chargerToutesLesLecons } from "../seance/bibliotheque.ts";
import { etoilesGagneesPendantLUtilisation } from "../seance/fin-de-seance/etoiles-gagnees-pendant-l-utilisation.ts";
import { lireLEtatDuTestDeDepart } from "../test-de-depart/etat-du-test-de-depart.ts";
import { lireLesDefisReleves } from "./lire-les-defis-releves.ts";

export type DefiOuvert = { readonly pret: boolean; readonly defi: Defi | undefined };

type Seance = { readonly enfant: string; readonly lecon: string };

function enEtoiles(meilleures: MeilleuresEtoilesDuProfil): ReadonlyMap<string, Etoiles> {
  const etoiles = [...meilleures].flatMap(([lecon, nombre]): [string, Etoiles][] =>
    nombre === 1 || nombre === 2 || nombre === 3 ? [[lecon, Etoiles.de(nombre)]] : []
  );
  return new Map(etoiles);
}

async function defiOuvertParLaSeanceTerminee(
  { enfant, lecon: leconId }: Seance,
  niveau: string,
  meilleuresAvant: Promise<MeilleuresEtoilesDuProfil | undefined>,
): Promise<Defi | undefined> {
  const niveauDeLEnfant = niveauDuProfil(niveau);
  const [avant, lecons, testDeDepart, defisReleves] = await Promise.all([
    meilleuresAvant,
    chargerToutesLesLecons(),
    lireLEtatDuTestDeDepart(enfant),
    lireLesDefisReleves(enfant),
  ]);
  const lecon = lecons.find(({ id }) => id === leconId);
  if (!niveauDeLEnfant || !avant || !lecon) return undefined;
  const entrees = { lecons, niveau: niveauDeLEnfant, leconsReussiesAuTestDeDepart: testDeDepart.leconsReussies };
  const etoilesAvant = enEtoiles(avant);
  const etoilesApres = meilleuresEtoilesReunies(etoilesAvant, etoilesGagneesPendantLUtilisation(enfant));
  return defiOuvertParLaSeance(
    parcoursDeLaMatiere({ ...entrees, meilleuresEtoiles: etoilesAvant }, lecon.matiere),
    parcoursDeLaMatiere({ ...entrees, meilleuresEtoiles: etoilesApres }, lecon.matiere),
    lecon.matiere,
    niveauDeLEnfant,
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
