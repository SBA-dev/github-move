export type InstantDeMot = { readonly position: number; readonly debutMs: number };

export function instantsDesMots(phrase: string, dureeMs: number): readonly InstantDeMot[] {
  const mots = [...phrase.matchAll(/\S+/g)];
  const total = mots.reduce((somme, mot) => somme + mot[0].length, 0);
  if (total === 0 || dureeMs <= 0) return [];
  let caracteresAvant = 0;
  return mots.map((mot) => {
    const instant = { position: mot.index, debutMs: Math.floor((caracteresAvant * dureeMs) / total) };
    caracteresAvant += mot[0].length;
    return instant;
  });
}
