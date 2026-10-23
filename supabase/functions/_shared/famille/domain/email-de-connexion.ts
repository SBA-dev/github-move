import type { AdresseEmail } from "./adresse-email.ts";
import type { CodeDeConnexion } from "./code-de-connexion.ts";
import type { LienDeConnexion } from "./lien-de-connexion.ts";

export class EmailDeConnexion {
  private constructor(
    readonly destinataire: AdresseEmail,
    readonly sujet: string,
    readonly texte: string,
  ) {}

  static composer(adresse: AdresseEmail, lien: LienDeConnexion, code: CodeDeConnexion): EmailDeConnexion {
    const texte = [
      "Bonjour,",
      "",
      "Pour te connecter à Savanturier, ouvre ce lien :",
      lien.valeur,
      "",
      "Tu peux aussi saisir ce code de connexion sur l'appareil où tu as fait la demande :",
      code.valeur,
      "",
      "Le lien et le code valent une heure et ne servent qu'une seule fois.",
      "Si tu n'as rien demandé, tu peux ignorer cet e-mail.",
    ].join("\n");
    return new EmailDeConnexion(adresse, "Ta connexion à Savanturier", texte);
  }
}
