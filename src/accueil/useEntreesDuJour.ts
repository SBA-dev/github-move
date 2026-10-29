import { useEffect, useState } from "react";
import type { EntreesDuJour } from "@domain/apprentissage";
import type { ProfilEnCours } from "@domain/famille";
import { useLecturesDuParcours } from "../parcours/index.ts";
import { derniereSeanceTerminee } from "./derniere-seance-terminee.ts";
import { entreesDuJour } from "./entrees-du-jour.ts";

function useLeconDeLaDerniereSeance(profil: string): { readonly lecon: string | undefined } | undefined {
  const [lue, setLue] = useState<{ readonly pour: string; readonly lecon: string | undefined } | undefined>();
  useEffect(() => {
    let annule = false;
    void derniereSeanceTerminee(profil).then((seance) => {
      if (!annule) setLue({ pour: profil, lecon: seance?.lecon });
    });
    return () => {
      annule = true;
    };
  }, [profil]);
  return lue?.pour === profil ? lue : undefined;
}

/**
 * Ce que l'accueil donne au domaine : le parcours du profil et la matière de sa dernière séance terminée ; `undefined` pendant la lecture.
 * Une bibliothèque vide (indisponible) ou un niveau inconnu donnent un parcours inconnu : l'accueil ne montre alors ni leçon du jour ni tuile de matière.
 */
export function useEntreesDuJour(profil: ProfilEnCours): EntreesDuJour | undefined {
  const lectures = useLecturesDuParcours(profil.id);
  const derniere = useLeconDeLaDerniereSeance(profil.id);
  if (lectures === undefined || derniere === undefined) return undefined;
  return entreesDuJour(lectures, derniere.lecon, profil.niveau);
}
