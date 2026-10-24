import { AdresseEmail } from "../domain/adresse-email.ts";
import { InformationsDeReinitialisationIncorrectes, ServiceDeConnexionIndisponible } from "../domain/erreurs.ts";
import type { EssaisDeReinitialisation } from "../domain/essais-de-reinitialisation.ts";
import { MotDePasseDuParent } from "../domain/mot-de-passe-du-parent.ts";
import type { ParentId } from "../domain/parent-id.ts";
import { Prenom } from "../domain/prenom.ts";
import type { MotsDePasseDesParents } from "./ports/mots-de-passe-des-parents.ts";
import type { ParentsDesAdresses } from "./ports/parents-des-adresses.ts";
import type { PrenomsDesEnfantsRattaches } from "./ports/prenoms-des-enfants-rattaches.ts";
import {
  EssaisDeReinitialisationModifiesEnMemeTemps,
  type RegistreDesEssaisDeReinitialisation,
} from "./ports/registre-des-essais-de-reinitialisation.ts";

const TENTATIVES_DE_RESERVATION_EN_CAS_D_ESSAIS_SIMULTANES = 5;

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

    const essais = await this.reserverUnEssai(adresseSaisie, maintenant);

    const parent = await this.parentSiLePrenomEstConnu(adresseSaisie, prenomSaisi);
    if (!parent) throw new InformationsDeReinitialisationIncorrectes();
    await this.motsDePasse.changer(parent, nouveauMotDePasse);
    essais.enregistrerUneReussite();
    await this.registre.enregistrer(essais, maintenant);
  }

  /** L'essai est compté comme raté avant toute lecture du prénom : deux essais simultanés comptent tous les deux. */
  private async reserverUnEssai(adresse: AdresseEmail, maintenant: Date): Promise<EssaisDeReinitialisation> {
    for (let tentative = 1; tentative <= TENTATIVES_DE_RESERVATION_EN_CAS_D_ESSAIS_SIMULTANES; tentative++) {
      const essais = await this.registre.pourAdresse(adresse);
      essais.verifierQueLaReinitialisationEstOuverte(maintenant);
      essais.enregistrerUnEssaiRate(maintenant);
      try {
        await this.registre.enregistrer(essais, maintenant);
        return essais;
      } catch (cause) {
        if (!(cause instanceof EssaisDeReinitialisationModifiesEnMemeTemps)) throw cause;
      }
    }
    throw new ServiceDeConnexionIndisponible();
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
}
