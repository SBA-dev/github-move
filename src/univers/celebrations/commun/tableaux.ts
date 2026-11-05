/** L'élément `i` d'un tableau qui doit l'avoir : une erreur claire plutôt qu'un `undefined` qui se propage dans un tracé. */
export function au<T>(tableau: readonly T[], i: number): T {
  const valeur = tableau[i];
  if (valeur === undefined) throw new Error(`Le tableau n'a pas d'élément ${i}`);
  return valeur;
}
