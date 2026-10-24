import { useEffect, useRef, useState } from "react";
import type { Seance } from "@domain/apprentissage";
import { retenirLesEtoilesGagnees } from "./etoiles-gagnees-pendant-l-utilisation.ts";
import { type Sauvegarde, sauvegarderLaSeance } from "./sauvegarde-de-la-seance.ts";

export const MESSAGE_DE_SAUVEGARDE_IMPOSSIBLE = "Sauvegarde en ligne impossible : la progression est gardée sur cet appareil.";

/**
 * Termine la séance une seule fois, puis l'envoie au serveur en arrière-plan : l'écran de fin ne l'attend pas.
 * Rend le message à montrer si l'envoi n'a pas pu se faire.
 */
export function useSauvegardeDeLaSeance(seance: Seance): string | undefined {
  const lancee = useRef(false);
  const [sauvegarde, setSauvegarde] = useState<Sauvegarde | undefined>();
  useEffect(() => {
    if (lancee.current) return;
    lancee.current = true;
    seance.terminer(new Date());
    retenirLesEtoilesGagnees(seance.enfant, seance.lecon, seance.etoiles());
    void sauvegarderLaSeance(seance.aEnregistrer()).then(setSauvegarde);
  }, [seance]);
  if (sauvegarde === "gardee") return MESSAGE_DE_SAUVEGARDE_IMPOSSIBLE;
  return sauvegarde === "perdue" ? "Sauvegarde en ligne impossible." : undefined;
}
