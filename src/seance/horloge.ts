/** Le temps vu du front : l'heure qu'il est, et une minuterie qui bat à intervalle régulier. */
export type Horloge = {
  readonly maintenant: () => Date;
  /** Appelle `rappel` à chaque intervalle ; rend la fonction qui arrête la minuterie. */
  readonly battre: (rappel: () => void, intervalleEnMs: number) => () => void;
};

export const horlogeDuNavigateur: Horloge = {
  maintenant: () => new Date(),
  battre: (rappel, intervalleEnMs) => {
    const minuterie = setInterval(rappel, intervalleEnMs);
    return () => clearInterval(minuterie);
  },
};
