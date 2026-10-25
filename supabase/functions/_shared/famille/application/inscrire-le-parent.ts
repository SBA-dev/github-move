import { AdresseEmail } from "../domain/adresse-email.ts";
import { MotDePasseDuParent } from "../domain/mot-de-passe-du-parent.ts";
import type { ParentId } from "../domain/parent-id.ts";
import type { InscriptionsDesParents } from "./ports/inscriptions-des-parents.ts";

export class InscrireLeParent {
  constructor(private readonly inscriptions: InscriptionsDesParents) {}

  async executer(adresseSaisie: string, motDePasseSaisi: string): Promise<ParentId> {
    const adresse = AdresseEmail.de(adresseSaisie);
    MotDePasseDuParent.de(motDePasseSaisi);
    return await this.inscriptions.inscrire(adresse, motDePasseSaisi);
  }
}
