import type { DonneesDeLAppareil } from "../domain/donnees-de-l-appareil.ts";

export class DonneesDeLAppareilEnMemoire implements DonneesDeLAppareil {
  effacements = 0;

  constructor(private readonly echoue: boolean = false) {}

  effacer(): Promise<void> {
    this.effacements++;
    if (this.echoue) return Promise.reject(new Error("effacement impossible"));
    return Promise.resolve();
  }
}
