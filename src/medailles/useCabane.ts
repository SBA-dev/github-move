import { useEffect, useState } from "react";
import { cabaneDe, type EtatDeLaCabane, totalDesEtoiles } from "@domain/motivation";
import { lireLesMeilleuresEtoilesPourLaCabane } from "../seance/fin-de-seance/meilleures-etoiles-pour-la-cabane.ts";

export type LectureDeLaCabane = {
  readonly chargee: boolean;
  /** Absente quand les étoiles du serveur ne peuvent pas être lues : la section n'apparaît pas. */
  readonly cabane: EtatDeLaCabane | undefined;
};

/** La cabane du profil, recalculée à partir de ses meilleures étoiles. */
export function useCabane(profil: string): LectureDeLaCabane {
  const [lecture, setLecture] = useState<LectureDeLaCabane>({ chargee: false, cabane: undefined });
  useEffect(() => {
    let annule = false;
    void lireLesMeilleuresEtoilesPourLaCabane(profil)
      .then((meilleures) => (meilleures === undefined ? undefined : cabaneDe(totalDesEtoiles(meilleures))))
      .catch(() => undefined)
      .then((cabane) => {
        if (!annule) setLecture({ chargee: true, cabane });
      });
    return () => {
      annule = true;
    };
  }, [profil]);
  return lecture;
}
