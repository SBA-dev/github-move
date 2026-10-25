/** Le résultat de la lecture, ou `undefined` si elle dépasse le délai maximal. */
export async function avecDelaiMaximal<T>(lecture: Promise<T | undefined>, delaiEnMs: number): Promise<T | undefined> {
  let annulerLAbandon = () => {};
  const abandon = new Promise<undefined>((resoudre) => {
    const minuteur = setTimeout(resoudre, delaiEnMs);
    annulerLAbandon = () => clearTimeout(minuteur);
  });
  try {
    return await Promise.race([lecture, abandon]);
  } finally {
    annulerLAbandon();
  }
}
