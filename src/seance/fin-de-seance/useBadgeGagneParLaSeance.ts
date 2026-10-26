import { useEffect, useState } from "react";
import { leconAcquiseParLaSeance, leconsAcquises } from "@domain/apprentissage";
import { type Badge, badgeGagneParLaSeance, type MeilleuresEtoilesDuProfil } from "@domain/motivation";
import { chargerToutesLesLecons } from "../bibliotheque.ts";

export type BadgeGagne = { readonly pret: boolean; readonly badge: Badge | undefined };

async function leBadgeGagne(
  avant: MeilleuresEtoilesDuProfil,
  lecon: string,
  etoiles: number | undefined,
): Promise<Badge | undefined> {
  return badgeGagneParLaSeance(
    leconsAcquises(avant),
    leconAcquiseParLaSeance(avant, lecon, etoiles),
    await chargerToutesLesLecons(),
  );
}

/**
 * Le badge que la séance a fait gagner, une fois lues les meilleures étoiles d'avant la séance.
 * Sans elles (lecture impossible), aucun badge n'est annoncé.
 */
export function useBadgeGagneParLaSeance(
  meilleuresAvant: Promise<MeilleuresEtoilesDuProfil | undefined>,
  lecon: string,
  terminee: boolean,
  etoiles: number | undefined,
): BadgeGagne {
  const [gagne, setGagne] = useState<BadgeGagne>({ pret: false, badge: undefined });
  useEffect(() => {
    if (!terminee) return;
    let annule = false;
    void meilleuresAvant
      .then((avant) => avant === undefined ? undefined : leBadgeGagne(avant, lecon, etoiles))
      .catch(() => undefined)
      .then((badge) => {
        if (!annule) setGagne({ pret: true, badge });
      });
    return () => {
      annule = true;
    };
  }, [meilleuresAvant, lecon, terminee, etoiles]);
  return gagne;
}
