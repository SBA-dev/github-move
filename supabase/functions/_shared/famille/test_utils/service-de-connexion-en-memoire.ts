import type { AdresseEmail } from "../domain/adresse-email.ts";
import type { CodeDeConnexion } from "../domain/code-de-connexion.ts";
import { CodeDeConnexionInvalide } from "../domain/erreurs.ts";
import { ParentId } from "../domain/parent-id.ts";
import type { ServiceDeConnexion } from "../domain/service-de-connexion.ts";

export class ServiceDeConnexionEnMemoire implements ServiceDeConnexion {
  readonly adressesAuxquellesOnAEnvoye: AdresseEmail[] = [];
  readonly ouverturesAvecLeCode: Array<{ adresse: AdresseEmail; code: CodeDeConnexion }> = [];
  deconnexions = 0;

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

  deconnecter(): Promise<void> {
    this.deconnexions++;
    return Promise.resolve();
  }
}
