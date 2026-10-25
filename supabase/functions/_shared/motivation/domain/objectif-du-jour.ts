export type FaitsDuJour = {
  readonly leconsDesSeancesTermineesDuJour: readonly string[];
  readonly nombreDeSeancesDeRevisionTermineesDuJour: number;
};

export type ObjectifDuJour = {
  readonly nombreVise: number;
  readonly nombreJoue: number;
  readonly estAtteint: boolean;
};

const NOMBRE_VISE = 2;

export function objectifDuJour(faits: FaitsDuJour): ObjectifDuJour {
  const leconsDistinctes = new Set(faits.leconsDesSeancesTermineesDuJour).size;
  const revision = faits.nombreDeSeancesDeRevisionTermineesDuJour > 0 ? 1 : 0;
  const nombreJoue = Math.min(leconsDistinctes + revision, NOMBRE_VISE);
  return {
    nombreVise: NOMBRE_VISE,
    nombreJoue,
    estAtteint: nombreJoue >= NOMBRE_VISE,
  };
}
