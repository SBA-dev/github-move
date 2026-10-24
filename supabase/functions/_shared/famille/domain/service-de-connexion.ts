import type { AdresseEmail } from "./adresse-email.ts";
import type { CodeDeConnexion } from "./code-de-connexion.ts";
import type { ParentId } from "./parent-id.ts";

export interface ServiceDeConnexion {
  envoyerLienEtCodeDeConnexion(adresse: AdresseEmail): Promise<void>;
  ouvrirLaConnexionAvecLeCode(adresse: AdresseEmail, code: CodeDeConnexion): Promise<ParentId>;
  ouvrirLaConnexionAvecLeMotDePasse(adresse: AdresseEmail, motDePasse: string): Promise<ParentId>;
  deconnecter(): Promise<void>;
}
