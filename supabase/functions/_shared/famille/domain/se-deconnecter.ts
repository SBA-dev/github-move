import type { DonneesDeLAppareil } from "./donnees-de-l-appareil.ts";
import type { ServiceDeConnexion } from "./service-de-connexion.ts";

export class SeDeconnecter {
  constructor(
    private readonly service: ServiceDeConnexion,
    private readonly donnees: DonneesDeLAppareil,
  ) {}

  async executer(): Promise<void> {
    await this.service.deconnecter();
    await this.donnees.effacer();
  }
}
