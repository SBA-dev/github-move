import { AdresseEmail } from "./adresse-email.ts";
import { ConfirmationDuMotDePasseDifferente, ServiceDeConnexionIndisponible } from "./erreurs.ts";
import { MotDePasseDuParent } from "./mot-de-passe-du-parent.ts";
import type { ParentId } from "./parent-id.ts";
import { Prenom } from "./prenom.ts";
import type { ServiceDeConnexion } from "./service-de-connexion.ts";

export class ReinitialiserLeMotDePasseEtSeConnecter {
  constructor(private readonly service: ServiceDeConnexion) {}

  async executer(
    adresseSaisie: string,
    prenomSaisi: string,
    nouveauMotDePasse: string,
    confirmation: string,
  ): Promise<ParentId> {
    const adresse = AdresseEmail.de(adresseSaisie);
    const prenom = Prenom.de(prenomSaisi);
    MotDePasseDuParent.de(nouveauMotDePasse);
    if (confirmation !== nouveauMotDePasse) throw new ConfirmationDuMotDePasseDifferente();
    await this.service.reinitialiserLeMotDePasse(adresse, prenom, nouveauMotDePasse);
    const parent = await this.service.ouvrirLaConnexionAvecLeMotDePasse(adresse, nouveauMotDePasse);
    await this.fermerLesAutresConnexions();
    return parent;
  }

  private async fermerLesAutresConnexions(): Promise<void> {
    try {
      await this.service.fermerLesAutresConnexions();
    } catch {
      throw new ServiceDeConnexionIndisponible();
    }
  }
}
