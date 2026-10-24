const LONGUEUR_MINIMALE = 3;
const MOTS = /[\p{L}'’-]+/gu;
const ELISION = /^(?:qu|\p{L})['’]/iu;

export type MotDuVers = Readonly<{ mot: string; debut: number }>;

export function motsDuVers(vers: string): readonly MotDuVers[] {
  return [...vers.matchAll(MOTS)].map(({ 0: brut, index }) => {
    const mot = brut.replace(ELISION, "");
    return { mot, debut: index + brut.length - mot.length };
  });
}

export function motCacheDuVers(vers: string): MotDuVers | undefined {
  let plusLong: MotDuVers | undefined;
  for (const candidat of motsDuVers(vers)) {
    if (candidat.mot.length >= LONGUEUR_MINIMALE && candidat.mot.length > (plusLong?.mot.length ?? 0)) {
      plusLong = candidat;
    }
  }
  return plusLong;
}

export function motCache(vers: string): string | undefined {
  return motCacheDuVers(vers)?.mot;
}

export function peutEtreUnDistracteur(mot: string): boolean {
  return mot.length >= LONGUEUR_MINIMALE;
}
