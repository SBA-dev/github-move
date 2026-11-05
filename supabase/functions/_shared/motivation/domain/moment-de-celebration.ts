export type MomentDeCelebration = "defiReleve" | "matiereReussie" | "tenueRecue";

export type FaitsDeLaFinPourLaCelebration = {
  readonly defiRelevePourLaPremiereFois: boolean;
  readonly matiereReussieParLaSeance: boolean;
};

export function momentDeCelebrationDeLaFin(
  faits: FaitsDeLaFinPourLaCelebration,
): MomentDeCelebration | undefined {
  if (faits.matiereReussieParLaSeance) return "matiereReussie";
  return faits.defiRelevePourLaPremiereFois ? "defiReleve" : undefined;
}

export function titreDeLaMatiereReussie(): string {
  return "Matière réussie !";
}
