import { useEffect, useState } from "react";
import { type ObjectifDuJour, objectifDuJour } from "@domain/motivation";
import { faitsDuJourDuProfil } from "./faits-du-jour-du-profil.ts";

/** L'objectif du jour du profil, recalculé à chaque affichage de l'accueil ; `undefined` pendant la lecture ou si elle échoue. */
export function useObjectifDuJour(profil: string, maintenant: Date): ObjectifDuJour | undefined {
  const [lu, setLu] = useState<{ readonly pour: string; readonly objectif: ObjectifDuJour } | undefined>();
  useEffect(() => {
    let annule = false;
    faitsDuJourDuProfil(profil, maintenant).then((faits) => {
      if (!annule) setLu({ pour: profil, objectif: objectifDuJour(faits) });
    }).catch(() => {});
    return () => {
      annule = true;
    };
  }, [profil, maintenant]);
  return lu?.pour === profil ? lu.objectif : undefined;
}
