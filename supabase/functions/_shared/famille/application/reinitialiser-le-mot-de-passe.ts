import { AdresseEmail } from "../domain/adresse-email.ts";
import { InformationsDeReinitialisationIncorrectes } from "../domain/erreurs.ts";
import type { EssaisDeReinitialisation } from "../domain/essais-de-reinitialisation.ts";
import { MotDePasseDuParent } from "../domain/mot-de-passe-du-parent.ts";
import type { ParentId } from "../domain/parent-id.ts";
import { Prenom } from "../domain/prenom.ts";
import type { MotsDePasseDesParents } from "./ports/mots-de-passe-des-parents.ts";
import type { ParentsDesAdresses } from "./ports/parents-des-adresses.ts";
import type { PrenomsDesEnfantsRattaches } from "./ports/prenoms-des-enfants-rattaches.ts";
import type { RegistreDesEssaisDeReinitialisation } from "./ports/registre-des-essais-de-reinitialisation.ts";

export class ReinitialiserLeMotDePasse {
  constructor(
    private readonly registre: RegistreDesEssaisDeReinitialisation,
    private readonly parents: ParentsDesAdresses,
    private readonly prenoms: PrenomsDesEnfantsRattaches,
    private readonly motsDePasse: MotsDePasseDesParents,
  ) {}

  async executer(
    adresse: string,
    prenom: string,
    nouveauMotDePasse: string,
    maintenant: Date,
  ): Promise<void> {
    const adresseSaisie = AdresseEmail.de(adresse);
    const prenomSaisi = Prenom.de(prenom);
    MotDePasseDuParent.de(nouveauMotDePasse);

    const essais = await this.registre.pourAdresse(adresseSaisie);
    essais.verifierQueLaReinitialisationEstOuverte(maintenant);

    const parent = await this.parentSiLePrenomEstConnu(adresseSaisie, prenomSaisi);
    if (!parent) {
      await this.refuser(essais, maintenant);
    } else {
      await this.motsDePasse.changer(parent, nouveauMotDePasse);
      essais.enregistrerUneReussite();
      await this.registre.enregistrer(essais, maintenant);
    }
  }

  private async parentSiLePrenomEstConnu(
    adresse: AdresseEmail,
    prenomSaisi: Prenom,
  ): Promise<ParentId | undefined> {
    const parent = await this.parents.parentDeLAdresse(adresse);
    if (!parent) return undefined;
    const prenoms = await this.prenoms.duParent(parent);
    return prenoms.some((prenom) => prenom.correspondA(prenomSaisi)) ? parent : undefined;
  }

  private async refuser(essais: EssaisDeReinitialisation, maintenant: Date): Promise<never> {
    essais.enregistrerUnEssaiRate(maintenant);
    await this.registre.enregistrer(essais, maintenant);
    throw new InformationsDeReinitialisationIncorrectes();
  }
}
