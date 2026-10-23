export type NombreDEtoiles = 1 | 2 | 3;

const ERREURS_MAXIMALES_POUR_DEUX_ETOILES = 3;

export class Etoiles {
  private constructor(readonly nombre: NombreDEtoiles) {}

  static de(nombre: NombreDEtoiles): Etoiles {
    return new Etoiles(nombre);
  }

  meilleureQue(autre: Etoiles | undefined): Etoiles {
    return autre && autre.nombre > this.nombre ? autre : this;
  }

  static depuisErreurs(erreurs: number): Etoiles {
    if (erreurs === 0) return new Etoiles(3);
    if (erreurs <= ERREURS_MAXIMALES_POUR_DEUX_ETOILES) return new Etoiles(2);
    return new Etoiles(1);
  }
}
