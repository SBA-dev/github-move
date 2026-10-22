export type VoixDisponible = {
  readonly nom: string;
  readonly langue: string;
};

const SCORE_FRANCAIS_DE_FRANCE = 30;
const SCORE_AUTRE_FRANCAIS = 20;

const BONUS_ET_MALUS_DU_NOM: ReadonlyArray<readonly [RegExp, number]> = [
  [/natural|neural|online/i, 40],
  [/premium/i, 35],
  [/enhanced|am[eé]lior/i, 30],
  [/google/i, 20],
  [/compact|espeak|robot/i, -30],
];

function estFrancaise(voix: VoixDisponible): boolean {
  return /^fr/i.test(voix.langue);
}

export function scoreDeLaVoix(voix: VoixDisponible): number {
  const base = /^fr[-_]FR/i.test(voix.langue) ? SCORE_FRANCAIS_DE_FRANCE : SCORE_AUTRE_FRANCAIS;
  return BONUS_ET_MALUS_DU_NOM.reduce(
    (score, [motif, points]) => motif.test(voix.nom) ? score + points : score,
    base,
  );
}

export function voixFrancaisesTriees(
  voix: readonly VoixDisponible[],
): VoixDisponible[] {
  return voix
    .filter(estFrancaise)
    .sort((a, b) => scoreDeLaVoix(b) - scoreDeLaVoix(a));
}
