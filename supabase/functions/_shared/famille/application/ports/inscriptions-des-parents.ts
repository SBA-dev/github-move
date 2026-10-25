import type { AdresseEmail } from "../../domain/adresse-email.ts";
import type { ParentId } from "../../domain/parent-id.ts";

export interface InscriptionsDesParents {
  /** Lève `AdresseDejaUtilisee` si un compte existe déjà pour cette adresse. */
  inscrire(adresse: AdresseEmail, motDePasse: string): Promise<ParentId>;
}
