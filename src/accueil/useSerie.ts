import { useEffect, useState } from "react";
import { type Serie, serieDeJours } from "@domain/motivation";
import { jourDuNavigateur } from "../seance/jour-du-navigateur.ts";
import { joursDeSeanceDuProfil } from "./jours-de-seance-du-profil.ts";

/**
 * La série du profil, recalculée à chaque affichage de l'accueil et quand `maintenant` change.
 * `undefined` pendant la lecture ; `null` quand les jours de séance sont inconnus (pas de pastille).
 */
export function useSerie(profil: string, maintenant: Date): Serie | null | undefined {
  const [lue, setLue] = useState<{ readonly pour: string; readonly serie: Serie | null } | undefined>();
  useEffect(() => {
    let annule = false;
    joursDeSeanceDuProfil(profil, maintenant).then((jours) => {
      if (!annule) setLue({ pour: profil, serie: jours ? serieDeJours(jours, jourDuNavigateur(maintenant)) : null });
    }).catch(() => {
      if (!annule) setLue({ pour: profil, serie: null });
    });
    return () => {
      annule = true;
    };
  }, [profil, maintenant]);
  return lue?.pour === profil ? lue.serie : undefined;
}
