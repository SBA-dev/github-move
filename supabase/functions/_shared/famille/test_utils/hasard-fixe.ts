import type { Hasard } from "../domain/hasard.ts";

export class HasardFixe implements Hasard {
  readonly tirages: Array<{ min: number; max: number }> = [];
  private suivant = 0;

  constructor(private readonly valeurs: number[]) {}

  entierEntre(min: number, max: number): number {
    this.tirages.push({ min, max });
    if (this.suivant >= this.valeurs.length) {
      throw new Error("HasardFixe : plus aucune valeur de tirage disponible");
    }
    return this.valeurs[this.suivant++];
  }
}
