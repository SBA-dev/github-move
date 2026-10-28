import { useCallback, useEffect, useRef, useState } from "react";
import { DUREE_DU_RETOUR_EN_MS, type GenreDeRetour, type RetourDeLaReponse } from "./retour-de-la-reponse.ts";

export type SignalerUnRetour = (genre: GenreDeRetour, cible: string, complet?: boolean) => void;

/** Garde le dernier retour de réponse le temps de l'animer, puis l'efface. */
export function useRetourDeLaReponse() {
  const [retour, setRetour] = useState<RetourDeLaReponse | undefined>();
  const numero = useRef(0);
  const minuteur = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const signaler: SignalerUnRetour = useCallback((genre, cible, complet = false) => {
    clearTimeout(minuteur.current);
    setRetour({ genre, cible, complet, numero: ++numero.current });
    minuteur.current = setTimeout(() => setRetour(undefined), DUREE_DU_RETOUR_EN_MS);
  }, []);

  useEffect(() => () => clearTimeout(minuteur.current), []);

  return { retour, signaler };
}
