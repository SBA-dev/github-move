/** Une suite de nombres toujours la même : la scène est identique à chaque fois, elle ne tire rien au hasard (le hasard ne choisit que la variante). */
export function suiteDeNombres(graine: number): () => number {
  let etat = graine;
  return () => {
    etat = (etat + 0x6D2B79F5) | 0;
    let z = Math.imul(etat ^ (etat >>> 15), 1 | etat);
    z = (z + Math.imul(z ^ (z >>> 7), 61 | z)) ^ z;
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}
