import { useEffect } from "react";
import { renvoyerLesTestsDeDepartGardes } from "./sauvegarde-du-test-de-depart.ts";

/** Les tests de départ gardés sur l'appareil sont renvoyés au lancement et au retour du réseau. */
export function useRenvoiDesTestsDeDepartGardes(connecte: boolean): void {
  useEffect(() => {
    if (!connecte) return;
    void renvoyerLesTestsDeDepartGardes();
    const auRetourDuReseau = () => void renvoyerLesTestsDeDepartGardes();
    addEventListener("online", auRetourDuReseau);
    return () => removeEventListener("online", auRetourDuReseau);
  }, [connecte]);
}
