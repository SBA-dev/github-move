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
  danse: { univers: "danse" },
  animaux: { univers: "animaux" },
  princesse: { univers: "princesse" },
};

function laScenePeutSeJouer(faits: FaitsDeLaReponseFausse): boolean {
  return !faits.sceneDejaJoueeDansLaSeance &&
    !faits.pendantLeChronoDUneFluence &&
    !faits.dansLeTestDeDepart &&
    !faits.personnageGuideEnPetit;
}

export function sceneDeReponseFausse(
  faits: FaitsDeLaReponseFausse,
  cleUnivers: string | undefined,
): SceneDeReponseFausse | undefined {
  if (!laScenePeutSeJouer(faits)) return undefined;
  return SCENES_DE_REPONSE_FAUSSE[universDe(cleUnivers).cle];
}

export function sceneJoueeDansLaSeanceApres(
  dejaJouee: boolean,
  scene: SceneDeReponseFausse | undefined,
): boolean {
  return dejaJouee || scene !== undefined;
}
