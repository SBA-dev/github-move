import { useEffect, useState } from "react";
import type { EntreesDuJour } from "@domain/apprentissage";
import type { FaitsDuJour, QueteDuJour } from "@domain/motivation";
import { faitsDuJourDuProfil } from "./faits-du-jour-du-profil.ts";
import { queteDuJourDeLAccueil } from "./quete-du-jour.ts";

/**
 * La quête du jour du profil, recalculée à chaque affichage de l'accueil.
 * `undefined` pendant la lecture ; `null` quand les faits du jour sont illisibles (pas de quête, sans message).
 * `nombreDeQuestionsDues` est `undefined` tant que la file de révision n'est pas connue : il n'y a alors pas de quête.
 */
export function useQueteDuJour(
  profil: string,
  maintenant: Date,
  entrees: EntreesDuJour | undefined,
  nombreDeQuestionsDues: number | undefined,
  fileLue: boolean,
): QueteDuJour | null | undefined {
  const [lus, setLus] = useState<{ readonly pour: string; readonly faits: FaitsDuJour | null } | undefined>();
  useEffect(() => {
    let annule = false;
    faitsDuJourDuProfil(profil, maintenant).then((faits) => {
      if (!annule) setLus({ pour: profil, faits });
    }).catch(() => {
      if (!annule) setLus({ pour: profil, faits: null });
    });
    return () => {
      annule = true;
    };
  }, [profil, maintenant]);
  if (lus?.pour !== profil || entrees === undefined || !fileLue) return undefined;
  return lus.faits && queteDuJourDeLAccueil(entrees, nombreDeQuestionsDues, lus.faits);
}
