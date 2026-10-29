import type { EntreesDuJour } from "@domain/apprentissage";
import { niveauDuProfil, type LecturesDuParcours } from "../parcours/index.ts";

/**
 * Ce que l'accueil donne au domaine : le parcours du profil et la matière de sa dernière séance terminée.
 * Une bibliothèque vide (indisponible) ou un niveau inconnu donnent un parcours inconnu.
 */
export function entreesDuJour(lectures: LecturesDuParcours, leconDeLaDerniereSeance: string | undefined, niveauDuProfilBrut: string): EntreesDuJour {
  const niveau = niveauDuProfil(niveauDuProfilBrut);
  const bibliothequeChargee = lectures.lecons.length > 0;
  const matiereDeLaDerniereSeance = lectures.lecons.find((lecon) => lecon.id === leconDeLaDerniereSeance)?.matiere.code;
  return {
    parcours: bibliothequeChargee && niveau ? { ...lectures, niveau } : undefined,
    matiereDeLaDerniereSeance,
  };
}
