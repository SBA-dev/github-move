import { EtapeCalculer } from "./etape-calculer.ts";
import { EtapePoser } from "./etape-poser.ts";
import type { ModeDeReponse } from "./mode-de-reponse.ts";
import type { Tireur } from "./tireur.ts";
import { type Couleur, type Rang, RANGS } from "./rangs-d-addition.ts";

export type ColonneDAdditionPosee = {
  readonly rang: Rang;
  readonly couleur: Couleur;
  readonly chiffres: readonly number[];
};

export class AdditionPosee {
  private constructor(
    private readonly nombres: readonly number[],
    readonly colonnes: readonly ColonneDAdditionPosee[],
  ) {}

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
    return new AdditionPosee(nombres, colonnes);
  }

  etapePoser(): EtapePoser {
    return EtapePoser.pour(this.nombres);
  }

  etapeCalculer(mode: ModeDeReponse, tireur: Tireur): EtapeCalculer {
    return EtapeCalculer.pour(this.nombres, this.colonnes, mode, tireur);
  }
}
