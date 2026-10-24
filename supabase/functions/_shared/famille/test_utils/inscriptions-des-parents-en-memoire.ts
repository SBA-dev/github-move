import type { InscriptionsDesParents } from "../application/ports/inscriptions-des-parents.ts";
import type { AdresseEmail } from "../domain/adresse-email.ts";
import { AdresseDejaUtilisee } from "../domain/erreurs.ts";
import type { GenerateurId } from "../domain/generateur-id.ts";
import { ParentId } from "../domain/parent-id.ts";

export class InscriptionsDesParentsEnMemoire implements InscriptionsDesParents {
  readonly inscriptions: Array<{ adresse: AdresseEmail; motDePasse: string; parent: ParentId }> = [];

  constructor(private readonly generateurId: GenerateurId) {}

  inscrire(adresse: AdresseEmail, motDePasse: string): Promise<ParentId> {
    if (this.inscriptions.some((inscription) => inscription.adresse.estLaMemeQue(adresse))) {
      return Promise.reject(new AdresseDejaUtilisee());
    }
    const parent = ParentId.de(this.generateurId.nouveau());
    this.inscriptions.push({ adresse, motDePasse, parent });
    return Promise.resolve(parent);
  }
}
