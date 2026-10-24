import type { RegistreDesEssaisDeReinitialisation } from "../application/ports/registre-des-essais-de-reinitialisation.ts";
import type { AdresseEmail } from "../domain/adresse-email.ts";
import { EssaisDeReinitialisation } from "../domain/essais-de-reinitialisation.ts";

export class RegistreDesEssaisDeReinitialisationEnMemoire implements RegistreDesEssaisDeReinitialisation {
  private readonly essaisParAdresse = new Map<string, EssaisDeReinitialisation>();
  enregistrements = 0;

  pourAdresse(adresse: AdresseEmail): Promise<EssaisDeReinitialisation> {
    const essais = this.essaisParAdresse.get(adresse.valeur.toLowerCase());
    return Promise.resolve(essais ?? EssaisDeReinitialisation.nouveaux(adresse));
  }

  enregistrer(essais: EssaisDeReinitialisation, maintenant: Date): Promise<void> {
    this.enregistrements += 1;
    const cle = essais.adresse.valeur.toLowerCase();
    if (essais.estOublie(maintenant)) {
      this.essaisParAdresse.delete(cle);
    } else {
      this.essaisParAdresse.set(cle, essais);
    }
    return Promise.resolve();
  }

  conserves(): EssaisDeReinitialisation[] {
    return [...this.essaisParAdresse.values()];
  }
}
