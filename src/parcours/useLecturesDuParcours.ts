import { useEffect, useState } from "react";
import type { Etoiles } from "@domain/apprentissage";
import type { Lecon } from "@domain/catalogue";
import { chargerToutesLesLecons } from "../seance/bibliotheque.ts";
import { lireLesMeilleuresEtoilesDuProfil } from "../seance/fin-de-seance/meilleures-etoiles-du-profil.ts";
import { reseauDisponible } from "../reseau/reseau-disponible.ts";
import { attendreLesEnvoisEnCours } from "../seance/fin-de-seance/sauvegarde-de-la-seance.ts";
import { lireLEtatDuTestDeDepart } from "../test-de-depart/etat-du-test-de-depart.ts";

export type LecturesDuParcours = {
  readonly lecons: readonly Lecon[];
  readonly meilleuresEtoiles: ReadonlyMap<string, Etoiles>;
  readonly leconsReussiesAuTestDeDepart: ReadonlySet<string>;
};

/** Les leçons de la bibliothèque, les meilleures étoiles du profil et ses leçons réussies au test de départ ; `undefined` pendant la lecture. */
export function useLecturesDuParcours(profil: string): LecturesDuParcours | undefined {
  const [lectures, setLectures] = useState<LecturesDuParcours | undefined>();
  useEffect(() => {
    let annule = false;
    void (async () => {
      if (reseauDisponible()) await attendreLesEnvoisEnCours();
      const [lecons, meilleuresEtoiles, testDeDepart] = await Promise.all([
        chargerToutesLesLecons(),
        lireLesMeilleuresEtoilesDuProfil(profil),
        lireLEtatDuTestDeDepart(profil),
      ]);
      if (!annule) setLectures({ lecons, meilleuresEtoiles, leconsReussiesAuTestDeDepart: testDeDepart.leconsReussies });
    })();
    return () => {
      annule = true;
    };
  }, [profil]);
  return lectures;
}
