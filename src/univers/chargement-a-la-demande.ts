/** Le morceau d'une scène est demandé une seule fois : le préchargement et l'affichage partagent la même promesse. Une erreur n'est pas gardée : l'appel suivant retente. */
export const memoriser = <T,>(charger: () => Promise<T>) => {
  let promesse: Promise<T> | undefined;
  return () =>
    promesse ??= charger().catch((erreur: unknown) => {
      promesse = undefined;
      throw erreur;
    });
};
