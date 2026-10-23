import { useEffect } from "react";
import { renvoyerLesSeancesGardees } from "./sauvegarde-de-la-seance.ts";

/** Les séances terminées gardées sur l'appareil sont renvoyées au lancement et au retour du réseau. */
export function useRenvoiDesSeancesGardees(connecte: boolean): void {
  useEffect(() => {
    if (!connecte) return;
    void renvoyerLesSeancesGardees();
    const auRetourDuReseau = () => void renvoyerLesSeancesGardees();
    addEventListener("online", auRetourDuReseau);
    return () => removeEventListener("online", auRetourDuReseau);
  }, [connecte]);
}
