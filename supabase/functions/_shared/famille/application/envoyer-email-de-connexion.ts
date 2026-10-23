import { AdresseEmail } from "../domain/adresse-email.ts";
import { CodeDeConnexion } from "../domain/code-de-connexion.ts";
import { EmailDeConnexion } from "../domain/email-de-connexion.ts";
import { LienDeConnexion } from "../domain/lien-de-connexion.ts";
import { EnvoiDeLEmailImpossible } from "../domain/erreurs.ts";
import type { ExpediteurDEmails } from "./ports/expediteur-d-emails.ts";

export class EnvoyerEmailDeConnexion {
  constructor(private readonly expediteur: ExpediteurDEmails) {}

  async executer(adresse: string, lien: string, code: string): Promise<void> {
    const email = EmailDeConnexion.composer(
      AdresseEmail.de(adresse),
      LienDeConnexion.de(lien),
      CodeDeConnexion.de(code),
    );
    try {
      await this.expediteur.envoyer(email);
    } catch (erreur) {
      if (erreur instanceof EnvoiDeLEmailImpossible) throw erreur;
      throw new EnvoiDeLEmailImpossible();
    }
  }
}
