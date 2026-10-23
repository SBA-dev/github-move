import type { ChoixDeSeance } from "./choix-de-seance.ts";
import type { ReponseDonnee } from "./reponse.ts";

export type SeanceTermineeAEnregistrer = Readonly<{
  seance: string;
  enfant: string;
  lecon: string;
  choix: ChoixDeSeance;
  tirages: readonly (readonly string[])[];
  reponses: readonly (readonly ReponseDonnee[])[];
  termineeLe: Date;
}>;
