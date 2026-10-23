import type { ExpediteurDEmails } from "../application/ports/expediteur-d-emails.ts";
import type { EmailDeConnexion } from "../domain/email-de-connexion.ts";

export class ExpediteurDEmailsEnMemoire implements ExpediteurDEmails {
  readonly emailsEnvoyes: EmailDeConnexion[] = [];

  private constructor(private readonly enPanne: boolean) {}

  static quiFonctionne(): ExpediteurDEmailsEnMemoire {
    return new ExpediteurDEmailsEnMemoire(false);
  }

  static enPanne(): ExpediteurDEmailsEnMemoire {
    return new ExpediteurDEmailsEnMemoire(true);
  }

  envoyer(email: EmailDeConnexion): Promise<void> {
    if (this.enPanne) return Promise.reject(new Error("panne du service d'e-mails"));
    this.emailsEnvoyes.push(email);
    return Promise.resolve();
  }
}
