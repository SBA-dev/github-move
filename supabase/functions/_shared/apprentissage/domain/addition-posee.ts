type Rang = "unites" | "dizaines" | "centaines";
type Couleur = "bleue" | "rose" | "verte";

export type ColonneDAdditionPosee = {
  readonly rang: Rang;
  readonly couleur: Couleur;
  readonly chiffres: readonly number[];
};

const RANGS: readonly { rang: Rang; couleur: Couleur }[] = [
  { rang: "unites", couleur: "bleue" },
  { rang: "dizaines", couleur: "rose" },
  { rang: "centaines", couleur: "verte" },
];

export class AdditionPosee {
  private constructor(readonly colonnes: readonly ColonneDAdditionPosee[]) {}

  static depuis(nombres: readonly number[]): AdditionPosee {
    const somme = nombres.reduce((total, nombre) => total + nombre, 0);
    const colonnes = RANGS.flatMap(({ rang, couleur }, indice) => {
      const valeurDuRang = 10 ** indice;
      if (indice > 0 && somme < valeurDuRang) return [];
      const chiffres = nombres
        .filter((nombre) => indice === 0 || nombre >= valeurDuRang)
        .map((nombre) => Math.floor(nombre / valeurDuRang) % 10);
      return [{ rang, couleur, chiffres }];
    });
    return new AdditionPosee(colonnes);
  }
}
