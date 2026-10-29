import { useEffect, useState } from "react";
import { type EtatDesTenues, totalDesEtoiles, tenuesDe } from "@domain/motivation";
import { lireLesMeilleuresEtoilesDuProfilSiLisibles } from "../seance/fin-de-seance/meilleures-etoiles-du-profil-lues.ts";

export type LectureDesTenues = {
  readonly chargees: boolean;
  /** Absentes quand les étoiles du serveur ne peuvent pas être lues : la section n'apparaît pas et aucun choix n'est proposé. */
  readonly tenues: EtatDesTenues | undefined;
};

/** Les tenues reçues du profil, recalculées à partir de ses meilleures étoiles. */
export function useTenues(profil: string): LectureDesTenues {
  const [lecture, setLecture] = useState<LectureDesTenues>({ chargees: false, tenues: undefined });
  useEffect(() => {
    let annule = false;
    void lireLesMeilleuresEtoilesDuProfilSiLisibles(profil)
      .then((meilleures) => (meilleures === undefined ? undefined : tenuesDe(totalDesEtoiles(meilleures))))
      .catch(() => undefined)
      .then((tenues) => {
        if (!annule) setLecture({ chargees: true, tenues });
      });
    return () => {
      annule = true;
    };
  }, [profil]);
  return lecture;
}
