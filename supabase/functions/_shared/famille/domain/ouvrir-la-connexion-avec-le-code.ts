import { AdresseEmail } from "./adresse-email.ts";
import { CodeDeConnexion } from "./code-de-connexion.ts";
import type { ParentId } from "./parent-id.ts";
import type { ServiceDeConnexion } from "./service-de-connexion.ts";

export class OuvrirLaConnexionAvecLeCode {
  constructor(private readonly service: ServiceDeConnexion) {}

  async executer(adresseSaisie: string, codeSaisi: string): Promise<ParentId> {
    return await this.service.ouvrirLaConnexionAvecLeCode(
      AdresseEmail.de(adresseSaisie),
      CodeDeConnexion.de(codeSaisi),
    );
  }
}
