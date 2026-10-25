import { useEffect, useState } from "react";
import type { Lecon } from "@domain/catalogue";
import { lireLesLeconsPersonnellesDuProfil } from "./lecons-personnelles-lues.ts";

/** Les leçons personnelles du profil en cours, la plus récente d'abord ; `undefined` pendant la lecture. */
export function useLeconsPersonnellesDuProfil(profil: string): readonly Lecon[] | undefined {
  const [lues, setLues] = useState<{ readonly pour: string; readonly lecons: readonly Lecon[] } | undefined>();
  useEffect(() => {
    let annule = false;
    void lireLesLeconsPersonnellesDuProfil(profil).then((lecons) => {
      if (!annule) setLues({ pour: profil, lecons });
    });
    return () => {
      annule = true;
    };
  }, [profil]);
  return lues?.pour === profil ? lues.lecons : undefined;
}
