import { useEffect, useState } from "react";
import { leconsAcquises } from "@domain/apprentissage";
import { type Badge, badgesDuProfil } from "@domain/motivation";
import { lireLesMeilleuresEtoilesDuProfilSiLisibles } from "../seance/fin-de-seance/meilleures-etoiles-du-profil-lues.ts";
import { chargerToutesLesLecons } from "../seance/bibliotheque.ts";

export type LectureDesBadges = {
  readonly charges: boolean;
  /** Absents quand les étoiles du serveur ne peuvent pas être lues : la section n'apparaît pas. */
  readonly badges: readonly Badge[] | undefined;
};

async function lesBadgesDuProfil(profil: string): Promise<readonly Badge[] | undefined> {
  const meilleures = await lireLesMeilleuresEtoilesDuProfilSiLisibles(profil);
  if (meilleures === undefined) return undefined;
  return badgesDuProfil(leconsAcquises(meilleures), await chargerToutesLesLecons());
}

/** Les badges du profil, recalculés à partir de ses meilleures étoiles et des leçons de la bibliothèque. */
export function useBadges(profil: string): LectureDesBadges {
  const [lecture, setLecture] = useState<LectureDesBadges>({ charges: false, badges: undefined });
  useEffect(() => {
    let annule = false;
    void lesBadgesDuProfil(profil)
      .catch(() => undefined)
      .then((badges) => {
        if (!annule) setLecture({ charges: true, badges });
      });
    return () => {
      annule = true;
    };
  }, [profil]);
  return lecture;
}
