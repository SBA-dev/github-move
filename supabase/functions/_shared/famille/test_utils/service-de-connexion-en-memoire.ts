import type { AdresseEmail } from "../domain/adresse-email.ts";
import type { CodeDeConnexion } from "../domain/code-de-connexion.ts";
import { AdresseDejaUtilisee, AdresseOuMotDePasseIncorrect, CodeDeConnexionInvalide } from "../domain/erreurs.ts";
import { ParentId } from "../domain/parent-id.ts";
import type { ServiceDeConnexion } from "../domain/service-de-connexion.ts";

export class ServiceDeConnexionEnMemoire implements ServiceDeConnexion {
  readonly adressesAuxquellesOnAEnvoye: AdresseEmail[] = [];
  readonly ouverturesAvecLeCode: Array<{ adresse: AdresseEmail; code: CodeDeConnexion }> = [];
  readonly ouverturesAvecLeMotDePasse: Array<{ adresse: AdresseEmail; motDePasse: string }> = [];
  readonly inscriptions: Array<{ adresse: AdresseEmail; motDePasse: string }> = [];
  deconnexions = 0;
  private compte: { adresse: AdresseEmail; motDePasse: string } | undefined;
  private fermetureEnEchec = false;

  static quiEchoueALaFermeture(): ServiceDeConnexionEnMemoire {
    const service = new ServiceDeConnexionEnMemoire();
    service.fermetureEnEchec = true;
    return service;
  }

  static avecUnCompte(
    adresse: AdresseEmail,
    motDePasse: string,
    parent: ParentId = ParentId.de("parent-paul"),
  ): ServiceDeConnexionEnMemoire {
    const service = new ServiceDeConnexionEnMemoire("123456", parent);
    service.compte = { adresse, motDePasse };
    return service;
  }

  constructor(
    private readonly codeAccepte: string = "123456",
    private readonly parentConnecte: ParentId = ParentId.de("parent-paul"),
  ) {}

  envoyerLienEtCodeDeConnexion(adresse: AdresseEmail): Promise<void> {
    this.adressesAuxquellesOnAEnvoye.push(adresse);
    return Promise.resolve();
  }

  ouvrirLaConnexionAvecLeCode(adresse: AdresseEmail, code: CodeDeConnexion): Promise<ParentId> {
    this.ouverturesAvecLeCode.push({ adresse, code });
    if (code.valeur !== this.codeAccepte) return Promise.reject(new CodeDeConnexionInvalide());
    return Promise.resolve(this.parentConnecte);
  }

  inscrire(adresse: AdresseEmail, motDePasse: string): Promise<void> {
    this.inscriptions.push({ adresse, motDePasse });
    if (this.compte?.adresse.estLaMemeQue(adresse)) return Promise.reject(new AdresseDejaUtilisee());
    this.compte = { adresse, motDePasse };
    return Promise.resolve();
  }

  ouvrirLaConnexionAvecLeMotDePasse(adresse: AdresseEmail, motDePasse: string): Promise<ParentId> {
    this.ouverturesAvecLeMotDePasse.push({ adresse, motDePasse });
    const correspond = this.compte !== undefined && this.compte.adresse.estLaMemeQue(adresse) &&
      this.compte.motDePasse === motDePasse;
    if (!correspond) return Promise.reject(new AdresseOuMotDePasseIncorrect());
    return Promise.resolve(this.parentConnecte);
  }

  deconnecter(): Promise<void> {
    this.deconnexions++;
    if (this.fermetureEnEchec) return Promise.reject(new Error("fermeture impossible"));
    return Promise.resolve();
  }
}
