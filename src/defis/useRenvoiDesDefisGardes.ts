import { useEffect } from "react";
import { renvoyerLesDefisGardes } from "./sauvegarde-du-defi.ts";

/** Les défis gardés sur l'appareil sont renvoyés au lancement et au retour du réseau. */
export function useRenvoiDesDefisGardes(connecte: boolean): void {
  useEffect(() => {
    if (!connecte) return;
    void renvoyerLesDefisGardes();
    const auRetourDuReseau = () => void renvoyerLesDefisGardes();
    addEventListener("online", auRetourDuReseau);
    return () => removeEventListener("online", auRetourDuReseau);
  }, [connecte]);
}
