import { useEffect, useState } from "react";
import type { DefiReleve } from "@domain/apprentissage";
import { lireLesDefisReleves } from "./lire-les-defis-releves.ts";

export type LectureDesDefisReleves = { readonly charges: boolean; readonly defisReleves: readonly DefiReleve[] };

/** Les défis relevés du profil, lus du serveur et de l'appareil. Illisibles, il n'y en a aucun à montrer. */
export function useDefisReleves(profil: string): LectureDesDefisReleves {
  const [lecture, setLecture] = useState<LectureDesDefisReleves>({ charges: false, defisReleves: [] });
  useEffect(() => {
    let annule = false;
    void lireLesDefisReleves(profil)
      .catch((): readonly DefiReleve[] => [])
      .then((defisReleves) => {
        if (!annule) setLecture({ charges: true, defisReleves });
      });
    return () => {
      annule = true;
    };
  }, [profil]);
  return lecture;
}
