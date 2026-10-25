import { useState } from "react";
import { messageDeConnexion } from "./messages-de-connexion.ts";

export function useSoumission(onReussite: () => void) {
  const [erreur, setErreur] = useState<unknown>();
  const [enCours, setEnCours] = useState(false);

  const soumettre = async (action: () => Promise<unknown>) => {
    setErreur(undefined);
    setEnCours(true);
    try {
      await action();
      onReussite();
    } catch (cause) {
      setErreur(cause);
    } finally {
      setEnCours(false);
    }
  };

  return { erreur, message: erreur === undefined ? undefined : messageDeConnexion(erreur), enCours, soumettre };
}
