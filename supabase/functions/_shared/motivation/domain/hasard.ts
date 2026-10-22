export interface Hasard {
  entre0et1(): number;
}

export class TirageHorsIntervalle extends Error {
  constructor(tirage: number) {
    super(`Le hasard doit donner un tirage dans [0, 1[, reçu ${tirage}`);
    this.name = "TirageHorsIntervalle";
  }
}

export function tirage(hasard: Hasard): number {
  const valeur = hasard.entre0et1();
  if (valeur < 0 || valeur >= 1) throw new TirageHorsIntervalle(valeur);
  return valeur;
}
