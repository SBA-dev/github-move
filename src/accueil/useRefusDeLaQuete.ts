import { useCallback, useState } from "react";

/** Les profils dont l'enfant a choisi « Autre chose » à la quête du jour : en mémoire le temps de l'utilisation, jamais enregistré. */
export function useRefusDeLaQuete() {
  const [refus, setRefus] = useState<ReadonlySet<string>>(new Set());
  const refuser = useCallback((profil: string) => setRefus((actuels) => new Set(actuels).add(profil)), []);
  const oublier = useCallback(() => setRefus(new Set()), []);
  return { refus, refuser, oublier };
}
