import type { CodeDeMatiere, Niveau } from "@domain/catalogue";
import type { EtatDansLeParcours } from "@domain/apprentissage";
import { libelleDeLOnglet, reussiteDeLEtat } from "../parcours/index.ts";

export const AUCUNE_LECON_POUR_CE_CHOIX = "Aucune leçon pour ce choix.";
export const TOUTES_LES_MATIERES = "Toutes les matières";
export const TOUS_LES_NIVEAUX = "Tous les niveaux";

/** Ce que lit un lecteur d'écran pour une leçon de « Toutes les leçons ». */
export function annonceDeLaLeconDeToutesLesLecons(
  lecon: { readonly titre: string; readonly niveau: Niveau; readonly etat: EtatDansLeParcours },
  matiere: CodeDeMatiere,
): string {
  return `${lecon.titre}, ${lecon.niveau.valeur}, ${libelleDeLOnglet(matiere)} : ${reussiteDeLEtat(lecon.etat)}`;
}
