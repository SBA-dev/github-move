import type { EmailDeConnexion } from "../../domain/email-de-connexion.ts";

export interface ExpediteurDEmails {
  envoyer(email: EmailDeConnexion): Promise<void>;
}
