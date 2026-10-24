import { AdresseEmail } from "./adresse-email.ts";
import { MotDePasseObligatoire } from "./erreurs.ts";
import type { ParentId } from "./parent-id.ts";
import type { ServiceDeConnexion } from "./service-de-connexion.ts";

export class SeConnecterAvecLeMotDePasse {
  constructor(private readonly service: ServiceDeConnexion) {}

  async executer(adresseSaisie: string, motDePasseSaisi: string): Promise<ParentId> {
    const adresse = AdresseEmail.de(adresseSaisie);
    if (motDePasseSaisi === "") throw new MotDePasseObligatoire();
    return await this.service.ouvrirLaConnexionAvecLeMotDePasse(adresse, motDePasseSaisi);
  }
}
