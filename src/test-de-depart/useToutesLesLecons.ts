import { useEffect, useState } from "react";
import type { Lecon } from "@domain/catalogue";
import { chargerToutesLesLecons } from "../seance/bibliotheque.ts";

/** Les leçons lisibles de la bibliothèque ; `undefined` pendant le chargement, vide si elle est indisponible. */
export function useToutesLesLecons(): readonly Lecon[] | undefined {
  const [lecons, setLecons] = useState<readonly Lecon[] | undefined>();
  useEffect(() => {
    let annule = false;
    void chargerToutesLesLecons().then((chargees) => {
      if (!annule) setLecons(chargees);
    });
    return () => {
      annule = true;
    };
  }, []);
  return lecons;
}
