import { useEffect } from "react";
import { renvoyerLesSeancesDeRevisionGardees } from "./sauvegarde-de-la-seance-de-revision.ts";

/** Les séances de révision gardées sur l'appareil sont renvoyées au lancement et au retour du réseau. */
export function useRenvoiDesSeancesDeRevisionGardees(connecte: boolean): void {
  useEffect(() => {
    if (!connecte) return;
    void renvoyerLesSeancesDeRevisionGardees();
    const auRetourDuReseau = () => void renvoyerLesSeancesDeRevisionGardees();
    addEventListener("online", auRetourDuReseau);
    return () => removeEventListener("online", auRetourDuReseau);
  }, [connecte]);
}
