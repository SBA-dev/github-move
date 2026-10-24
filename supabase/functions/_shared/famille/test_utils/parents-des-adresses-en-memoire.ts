import type { ParentsDesAdresses } from "../application/ports/parents-des-adresses.ts";
import type { AdresseEmail } from "../domain/adresse-email.ts";
import type { ParentId } from "../domain/parent-id.ts";

export class ParentsDesAdressesEnMemoire implements ParentsDesAdresses {
  private readonly parentsParAdresse = new Map<string, ParentId>();
  lectures = 0;

  ajouter(adresse: AdresseEmail, parent: ParentId): void {
    this.parentsParAdresse.set(adresse.valeur.toLowerCase(), parent);
  }

  parentDeLAdresse(adresse: AdresseEmail): Promise<ParentId | undefined> {
    this.lectures += 1;
    return Promise.resolve(this.parentsParAdresse.get(adresse.valeur.toLowerCase()));
  }
}
