const LONGUEUR_MINIMALE = 3;
const MOTS = /[\p{L}'’-]+/gu;
const ELISION = /^(?:qu|\p{L})['’]/iu;

export function motCache(vers: string): string | undefined {
  let plusLong: string | undefined;
  for (const [mot] of vers.matchAll(MOTS)) {
    const sansElision = mot.replace(ELISION, "");
    if (
      sansElision.length >= LONGUEUR_MINIMALE &&
      sansElision.length > (plusLong?.length ?? 0)
    ) {
      plusLong = sansElision;
    }
  }
  return plusLong;
}
