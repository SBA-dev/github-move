import { useEffect, useState } from "react";
import { jourDuNavigateur } from "../seance/jour-du-navigateur.ts";
import { lireLaFileDeRevision } from "./lire-la-file-de-revision.ts";

/** Les questions dues lues pour l'accueil : `lue` dit si la lecture est finie ; `nombre` reste `undefined` quand aucune file n'est connue. */
export type QuestionsDuesALAccueil = { readonly lue: boolean; readonly nombre: number | undefined };

const EN_COURS_DE_LECTURE: QuestionsDuesALAccueil = { lue: false, nombre: undefined };

/**
 * Le nombre de questions dues aujourd'hui dans la file de révision du profil, pour l'accueil de l'enfant.
 * Pas de nombre tant que la lecture n'est pas finie, hors de l'accueil (`actif`) et quand aucune file n'est connue (sans réseau) : sans message d'erreur.
 */
export function useQuestionsDuesALAccueil(profil: string | undefined, actif: boolean): QuestionsDuesALAccueil {
  const [dues, setDues] = useState(EN_COURS_DE_LECTURE);
  useEffect(() => {
    setDues(EN_COURS_DE_LECTURE);
    if (!actif || profil === undefined) return;
    let annule = false;
    lireLaFileDeRevision(profil).then((file) => {
      if (!annule) setDues({ lue: true, nombre: file?.questionsDues(jourDuNavigateur(new Date())).length });
    }).catch(() => {
      if (!annule) setDues({ lue: true, nombre: undefined });
    });
    return () => {
      annule = true;
    };
  }, [profil, actif]);
  return dues;
}
