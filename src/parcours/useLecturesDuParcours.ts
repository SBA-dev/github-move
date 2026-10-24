import { useEffect, useState } from "react";
import type { Etoiles } from "@domain/apprentissage";
import type { Lecon } from "@domain/catalogue";
import { chargerToutesLesLecons } from "../seance/bibliotheque.ts";
import { lireLesMeilleuresEtoilesDuProfil } from "../seance/fin-de-seance/meilleures-etoiles-du-profil.ts";
import { reseauDisponible } from "../seance/fin-de-seance/reseau-disponible.ts";
import { attendreLesEnvoisEnCours } from "../seance/fin-de-seance/sauvegarde-de-la-seance.ts";

export type LecturesDuParcours = {
  readonly lecons: readonly Lecon[];
  readonly meilleuresEtoiles: ReadonlyMap<string, Etoiles>;
};

/** Les leçons de la bibliothèque et les meilleures étoiles du profil ; `undefined` pendant la lecture. */
export function useLecturesDuParcours(profil: string): LecturesDuParcours | undefined {
  const [lectures, setLectures] = useState<LecturesDuParcours | undefined>();
  useEffect(() => {
    let annule = false;
    void (async () => {
      if (reseauDisponible()) await attendreLesEnvoisEnCours();
      const [lecons, meilleuresEtoiles] = await Promise.all([chargerToutesLesLecons(), lireLesMeilleuresEtoilesDuProfil(profil)]);
      if (!annule) setLectures({ lecons, meilleuresEtoiles });
    })();
    return () => {
      annule = true;
    };
  }, [profil]);
  return lectures;
}
