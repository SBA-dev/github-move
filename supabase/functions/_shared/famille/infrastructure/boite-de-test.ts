import type { ExpediteurDEmails } from "../application/ports/expediteur-d-emails.ts";
import type { EmailDeConnexion } from "../domain/email-de-connexion.ts";

const suffixeDesAdressesDeTest = "@exemple.test";

export interface StockageDeLaBoiteDeTest {
  ranger(email: EmailDeConnexion): Promise<void>;
}

export class AdresseRefuseeParLaBoiteDeTest extends Error {
  constructor() {
    super(`La boîte de test n'accepte que les adresses en ${suffixeDesAdressesDeTest}.`);
    this.name = "AdresseRefuseeParLaBoiteDeTest";
  }
}

export class ExpediteurBoiteDeTest implements ExpediteurDEmails {
  constructor(private readonly stockage: StockageDeLaBoiteDeTest) {}

  envoyer(email: EmailDeConnexion): Promise<void> {
    if (!email.destinataire.valeur.endsWith(suffixeDesAdressesDeTest)) {
      return Promise.reject(new AdresseRefuseeParLaBoiteDeTest());
    }
    return this.stockage.ranger(email);
  }
}
