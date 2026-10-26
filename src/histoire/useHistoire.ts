import { useEffect, useState } from "react";
import { type EtatDeLHistoire, histoireDe } from "@domain/motivation";
import { seancesTermineesDuProfilAvecRepliSurLaDerniereLecture } from "./seances-terminees-du-profil.ts";

export type LectureDeLHistoire = {
  readonly chargee: boolean;
  /** Absente quand les séances du serveur ne peuvent pas être lues : la section n'apparaît pas. */
  readonly histoire: EtatDeLHistoire | undefined;
};

/** L'histoire des Savanturiers du profil, recalculée à partir de ses séances terminées. */
export function useHistoire(profil: string): LectureDeLHistoire {
  const [lecture, setLecture] = useState<LectureDeLHistoire>({ chargee: false, histoire: undefined });
  useEffect(() => {
    let annule = false;
    void seancesTermineesDuProfilAvecRepliSurLaDerniereLecture(profil)
      .then((seances) => (seances === undefined ? undefined : histoireDe(seances.nombre())))
      .catch(() => undefined)
      .then((histoire) => {
        if (!annule) setLecture({ chargee: true, histoire });
      });
    return () => {
      annule = true;
    };
  }, [profil]);
  return lecture;
}
