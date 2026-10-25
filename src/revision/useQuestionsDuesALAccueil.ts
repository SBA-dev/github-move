import { useEffect, useState } from "react";
import { jourDuNavigateur } from "../seance/jour-du-navigateur.ts";
import { lireLaFileDeRevision } from "./lire-la-file-de-revision.ts";

/**
 * Le nombre de questions dues aujourd'hui dans la file de révision du profil, pour l'accueil de l'enfant.
 * Zéro tant que la lecture n'est pas finie, hors de l'accueil (`actif`) et quand aucune file n'est connue (sans réseau) : sans message d'erreur.
 */
export function useQuestionsDuesALAccueil(profil: string | undefined, actif: boolean): number {
  const [dues, setDues] = useState(0);
  useEffect(() => {
    setDues(0);
    if (!actif || profil === undefined) return;
    let annule = false;
    void lireLaFileDeRevision(profil).then((file) => {
      if (!annule && file) setDues(file.questionsDues(jourDuNavigateur(new Date())).length);
    });
    return () => {
      annule = true;
    };
  }, [profil, actif]);
  return dues;
}
