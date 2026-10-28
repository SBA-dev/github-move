import { useCallback, useEffect, useRef, useState } from "react";
import { matieresDuParcours, parcoursDeLaMatiere } from "@domain/apprentissage";
import type { CodeDeMatiere } from "@domain/catalogue";
import type { ProfilEnCours } from "@domain/famille";
import { niveauDuProfil } from "./niveau-du-profil.ts";
import { type LecturesDuParcours, lireLesLecturesDuParcours } from "./useLecturesDuParcours.ts";

/** La prochaine leçon vue la dernière fois dans chaque matière (aucune pour une matière réussie). */
export type ProchainesLeconsConnues = ReadonlyMap<CodeDeMatiere, string | undefined>;

type Releve = { readonly profil: string; readonly parMatiere: ProchainesLeconsConnues };

function prochainesLecons(lectures: LecturesDuParcours, profil: ProfilEnCours): ProchainesLeconsConnues {
  const niveau = niveauDuProfil(profil.niveau);
  if (!niveau) return new Map();
  const entrees = { ...lectures, niveau };
  return new Map(matieresDuParcours(entrees).map((matiere) => [matiere.code, parcoursDeLaMatiere(entrees, matiere).prochaineLecon]));
}

const AUCUNE: ProchainesLeconsConnues = new Map();

/**
 * La prochaine leçon connue de chaque matière, gardée en mémoire le temps de l'utilisation, jamais enregistrée.
 * Relevée au premier choix du profil de l'utilisation, puis mise à jour à chaque passage sur « Mon parcours ».
 */
export function useProchainesLeconsConnues(profil: ProfilEnCours | undefined) {
  const [releve, setReleve] = useState<Releve>();
  const releveGarde = useRef<Releve>(undefined);
  useEffect(() => {
    releveGarde.current = releve;
  }, [releve]);
  useEffect(() => {
    if (!profil || releveGarde.current?.profil === profil.id) return;
    let annule = false;
    void lireLesLecturesDuParcours(profil.id).then((lectures) => {
      if (annule) return;
      setReleve((actuel) => {
        const dejaMemorisees = actuel?.profil === profil.id ? actuel.parMatiere : AUCUNE;
        return { profil: profil.id, parMatiere: new Map([...prochainesLecons(lectures, profil), ...dejaMemorisees]) };
      });
    });
    return () => {
      annule = true;
    };
  }, [profil]);
  const profilId = profil?.id;
  const memoriser = useCallback((matiere: CodeDeMatiere, leconId: string | undefined) => {
    if (profilId === undefined) return;
    setReleve((actuel) => {
      const dejaConnues = actuel?.profil === profilId ? actuel.parMatiere : AUCUNE;
      if (dejaConnues.has(matiere) && dejaConnues.get(matiere) === leconId) return actuel;
      return { profil: profilId, parMatiere: new Map(dejaConnues).set(matiere, leconId) };
    });
  }, [profilId]);
  const oublier = useCallback(() => setReleve(undefined), []);
  const connues = releve && releve.profil === profilId ? releve.parMatiere : AUCUNE;
  return { connues, memoriser, oublier };
}
