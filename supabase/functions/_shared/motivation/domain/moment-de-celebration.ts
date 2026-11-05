import type { TenueDuPersonnageGuide } from "./tenues.ts";

export type MomentDeCelebration = "defiReleve" | "matiereReussie" | "tenueRecue";

export type FaitsDeLaFinPourLaCelebration = {
  readonly defiRelevePourLaPremiereFois: boolean;
  readonly matiereReussieParLaSeance: boolean;
  readonly tenueRecue: TenueDuPersonnageGuide | undefined;
};

export function momentDeCelebrationDeLaFin(
  faits: FaitsDeLaFinPourLaCelebration,
): MomentDeCelebration | undefined {
  if (faits.matiereReussieParLaSeance) return "matiereReussie";
  if (faits.tenueRecue !== undefined) return "tenueRecue";
  return faits.defiRelevePourLaPremiereFois ? "defiReleve" : undefined;
}

export function titreDeLaMatiereReussie(): string {
  return "Matière réussie !";
}
