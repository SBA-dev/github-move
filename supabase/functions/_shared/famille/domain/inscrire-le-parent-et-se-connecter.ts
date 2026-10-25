import { AdresseEmail } from "./adresse-email.ts";
import { ConfirmationDuMotDePasseDifferente } from "./erreurs.ts";
import { MotDePasseDuParent } from "./mot-de-passe-du-parent.ts";
import type { ParentId } from "./parent-id.ts";
import type { ServiceDeConnexion } from "./service-de-connexion.ts";

export class InscrireLeParentEtSeConnecter {
  constructor(private readonly service: ServiceDeConnexion) {}

  async executer(adresseSaisie: string, motDePasseSaisi: string, confirmation: string): Promise<ParentId> {
    const adresse = AdresseEmail.de(adresseSaisie);
    MotDePasseDuParent.de(motDePasseSaisi);
    if (confirmation !== motDePasseSaisi) throw new ConfirmationDuMotDePasseDifferente();
    await this.service.inscrire(adresse, motDePasseSaisi);
    return await this.service.ouvrirLaConnexionAvecLeMotDePasse(adresse, motDePasseSaisi);
  }
}
