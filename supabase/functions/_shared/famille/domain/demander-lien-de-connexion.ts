import { AdresseEmail } from "./adresse-email.ts";
import type { ServiceDeConnexion } from "./service-de-connexion.ts";

export class DemanderLienDeConnexion {
  constructor(private readonly service: ServiceDeConnexion) {}

  async executer(adresseSaisie: string): Promise<void> {
    await this.service.envoyerLienEtCodeDeConnexion(AdresseEmail.de(adresseSaisie));
  }
}
