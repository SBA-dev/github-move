import { useEffect, useRef, useState } from "react";
import type { Seance, SeanceTerminee } from "@domain/apprentissage";
import { type Sauvegarde, sauvegarderLaSeance } from "./sauvegarde-de-la-seance.ts";

export const MESSAGE_DE_SAUVEGARDE_IMPOSSIBLE = "Sauvegarde en ligne impossible : la progression est gardée sur cet appareil.";

function messageDeSauvegarde(sauvegarde: Sauvegarde | undefined): string | undefined {
  if (sauvegarde === "gardee") return MESSAGE_DE_SAUVEGARDE_IMPOSSIBLE;
  return sauvegarde === "perdue" ? "Sauvegarde en ligne impossible." : undefined;
}

/**
 * Termine la séance une seule fois, puis l'envoie au serveur en arrière-plan : l'écran de fin ne l'attend pas.
 * Rend la séance terminée (étoiles, scores de fluence) et le message à montrer si l'envoi n'a pas pu se faire.
 */
export function useSauvegardeDeLaSeance(seance: Seance) {
  const lancee = useRef(false);
  const [terminee, setTerminee] = useState<SeanceTerminee | undefined>();
  const [sauvegarde, setSauvegarde] = useState<Sauvegarde | undefined>();
  useEffect(() => {
    if (lancee.current) return;
    lancee.current = true;
    setTerminee(seance.terminer(new Date()));
    void sauvegarderLaSeance(seance.aEnregistrer()).then(setSauvegarde);
  }, [seance]);
  return { terminee, message: messageDeSauvegarde(sauvegarde) };
}
