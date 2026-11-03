export type MomentDeCelebration = "defiReleve" | "matiereReussie" | "tenueRecue";

export type FaitsDeLaFinPourLaCelebration = {
  readonly defiRelevePourLaPremiereFois: boolean;
};

export function momentDeCelebrationDeLaFin(
  faits: FaitsDeLaFinPourLaCelebration,
): MomentDeCelebration | undefined {
  return faits.defiRelevePourLaPremiereFois ? "defiReleve" : undefined;
}
