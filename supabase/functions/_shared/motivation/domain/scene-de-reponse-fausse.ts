import { type CleUnivers, universDe } from "./univers.ts";

export type FaitsDeLaReponseFausse = {
  readonly sceneDejaJoueeDansLaSeance: boolean;
  readonly pendantLeChronoDUneFluence: boolean;
  readonly dansLeTestDeDepart: boolean;
  readonly personnageGuideEnPetit: boolean;
};

export type SceneDeReponseFausse = {
  readonly univers: CleUnivers;
};

export const SCENES_DE_REPONSE_FAUSSE: Partial<
  Record<CleUnivers, SceneDeReponseFausse>
> = {
  sports: { univers: "sports" },
};

export function sceneDeReponseFausse(
  _faits: FaitsDeLaReponseFausse,
  cleUnivers: string | undefined,
): SceneDeReponseFausse | undefined {
  return SCENES_DE_REPONSE_FAUSSE[universDe(cleUnivers).cle];
}
