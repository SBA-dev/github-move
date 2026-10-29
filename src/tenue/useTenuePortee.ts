import { useCallback, useSyncExternalStore } from "react";
import type { TenuePortee } from "@domain/motivation";
import { lireLaTenuePortee, memoriserLaTenuePortee, suivreLaTenuePortee } from "./memoire-de-la-tenue-portee.ts";

/** La tenue portée par le personnage guide du profil (sa clé, ou rien) et de quoi la changer. */
export function useTenuePortee(profil: string | undefined): readonly [TenuePortee, (tenue: TenuePortee) => void] {
  const lire = useCallback(() => (profil === undefined ? undefined : lireLaTenuePortee(profil)), [profil]);
  const tenue = useSyncExternalStore(suivreLaTenuePortee, lire);
  const changer = useCallback((nouvelle: TenuePortee) => {
    if (profil !== undefined) memoriserLaTenuePortee(profil, nouvelle);
  }, [profil]);
  return [tenue, changer];
}
