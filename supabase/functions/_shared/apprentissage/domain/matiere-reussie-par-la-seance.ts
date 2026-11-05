import type { Matiere } from "../../catalogue/domain/index.ts";
import { matiereReussieDuNiveau } from "./toutes-les-lecons.ts";
import type { EntreesDuParcours } from "./parcours.ts";

export function matiereReussieParLaSeance(
  avant: EntreesDuParcours,
  apres: EntreesDuParcours,
  matiere: Matiere,
): boolean {
  return !matiereReussieDuNiveau(avant, matiere) && matiereReussieDuNiveau(apres, matiere);
}
