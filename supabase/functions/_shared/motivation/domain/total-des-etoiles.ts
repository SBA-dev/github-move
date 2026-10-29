export type MeilleuresEtoilesDuProfil = ReadonlyMap<string, number>;

export class NombreDEtoilesInvalide extends Error {
  constructor(readonly etoiles: number) {
    super(`${etoiles} n'est pas un nombre d'étoiles valide : une leçon rapporte de 1 à 3 étoiles.`);
    this.name = "NombreDEtoilesInvalide";
  }
}

function verifierNombreDEtoiles(etoiles: number): number {
  if (!Number.isInteger(etoiles) || etoiles < 1 || etoiles > 3) throw new NombreDEtoilesInvalide(etoiles);
  return etoiles;
}

export function totalDesEtoiles(meilleures: MeilleuresEtoilesDuProfil): number {
  let total = 0;
  for (const etoiles of meilleures.values()) total += verifierNombreDEtoiles(etoiles);
  return total;
}

export class TotalDEtoilesInvalide extends Error {
  constructor(readonly total: number) {
    super(`${total} n'est pas un total d'étoiles valide : il faut un nombre entier positif ou nul.`);
    this.name = "TotalDEtoilesInvalide";
  }
}

export function verifierTotalDEtoiles(total: number): number {
  if (!Number.isInteger(total) || total < 0) throw new TotalDEtoilesInvalide(total);
  return total;
}

export type TotauxAvantEtApresLaSeance = { readonly avant: number; readonly apres: number };

export function totauxAvantEtApresLaSeance(
  meilleuresAvant: MeilleuresEtoilesDuProfil,
  lecon: string,
  etoilesDeLaSeance: number,
): TotauxAvantEtApresLaSeance {
  const etoilesValides = verifierNombreDEtoiles(etoilesDeLaSeance);
  const meilleurAvant = meilleuresAvant.get(lecon) ?? 0;
  const avant = totalDesEtoiles(meilleuresAvant);
  return { avant, apres: avant - meilleurAvant + Math.max(meilleurAvant, etoilesValides) };
}
