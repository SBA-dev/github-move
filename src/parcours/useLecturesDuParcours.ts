import { useEffect, useState } from "react";
import type { DefiReleve, Etoiles } from "@domain/apprentissage";
import type { Lecon } from "@domain/catalogue";
import { lireLesDefisReleves } from "../defis/lire-les-defis-releves.ts";
import { chargerToutesLesLecons } from "../seance/bibliotheque.ts";
import { lireLesMeilleuresEtoilesDuProfil } from "../seance/fin-de-seance/meilleures-etoiles-du-profil.ts";
import { reseauDisponible } from "../reseau/reseau-disponible.ts";
import { attendreLesEnvoisEnCours } from "../seance/fin-de-seance/sauvegarde-de-la-seance.ts";
import { lireLEtatDuTestDeDepart } from "../test-de-depart/etat-du-test-de-depart.ts";

export type LecturesDuParcours = {
  readonly lecons: readonly Lecon[];
  readonly meilleuresEtoiles: ReadonlyMap<string, Etoiles>;
  readonly leconsReussiesAuTestDeDepart: ReadonlySet<string>;
  readonly defisReleves: readonly DefiReleve[];
};

/** Les leçons de la bibliothèque, les meilleures étoiles du profil, ses leçons réussies au test de départ et ses défis relevés. */
export async function lireLesLecturesDuParcours(profil: string): Promise<LecturesDuParcours> {
  if (reseauDisponible()) await attendreLesEnvoisEnCours();
  const [lecons, meilleuresEtoiles, testDeDepart, defisReleves] = await Promise.all([
    chargerToutesLesLecons(),
    lireLesMeilleuresEtoilesDuProfil(profil),
    lireLEtatDuTestDeDepart(profil),
    lireLesDefisReleves(profil),
  ]);
  return { lecons, meilleuresEtoiles, leconsReussiesAuTestDeDepart: testDeDepart.leconsReussies, defisReleves };
}

/** Les lectures du parcours du profil ; `undefined` pendant la lecture. */
export function useLecturesDuParcours(profil: string): LecturesDuParcours | undefined {
  const [lectures, setLectures] = useState<LecturesDuParcours | undefined>();
  useEffect(() => {
    let annule = false;
    void lireLesLecturesDuParcours(profil).then((lues) => {
      if (!annule) setLectures(lues);
    });
    return () => {
      annule = true;
    };
  }, [profil]);
  return lectures;
}
