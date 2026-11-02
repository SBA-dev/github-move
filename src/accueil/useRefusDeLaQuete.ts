import { useCallback, useState } from "react";

/** Un refus vaut pour un profil et un jour : un nouveau jour repropose la quête. */
function cle(profil: string, jour: string): string {
  return `${profil}/${jour}`;
}

/** Les « Autre chose » dits à la quête du jour : en mémoire le temps de l'utilisation, jamais enregistrés. */
export function useRefusDeLaQuete() {
  const [refus, setRefus] = useState<ReadonlySet<string>>(new Set());
  const refusee = useCallback((profil: string, jour: string) => refus.has(cle(profil, jour)), [refus]);
  const refuser = useCallback((profil: string, jour: string) => setRefus((actuels) => new Set(actuels).add(cle(profil, jour))), []);
  const oublier = useCallback(() => setRefus(new Set()), []);
  return { refusee, refuser, oublier };
}
