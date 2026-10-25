import { nombreRequis, type Objet } from "../lecture.ts";
import { LeconMalFormee } from "../erreurs.ts";
import { type GenerateurComplet, lireGenerateur } from "./generateur-d-operations.ts";

const DUREE_PAR_DEFAUT_EN_SECONDES = 60;

export type ExerciceFluence = Readonly<{
  type: "fluence";
  titre?: string;
  consigne?: string;
  duree: number;
  generateur: GenerateurComplet;
}>;

export function lireFluence(brut: Objet, communs: { titre?: string; consigne?: string }): ExerciceFluence {
  return Object.freeze({
    type: "fluence",
    ...communs,
    duree: lireDuree(brut.duree),
    generateur: lireGenerateur(brut.generateur),
  });
}

function lireDuree(brut: unknown): number {
  if (brut === undefined) return DUREE_PAR_DEFAUT_EN_SECONDES;
  const duree = nombreRequis(brut, "la durée d'un exercice de fluence");
  if (duree <= 0) throw new LeconMalFormee("la durée d'un exercice de fluence n'est pas positive");
  return duree;
}

export function cleDeLaFluence(exercice: ExerciceFluence): string {
  return exercice.titre ?? exercice.generateur.op;
}
