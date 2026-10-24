import type { AdresseEmail } from "../../domain/adresse-email.ts";
import type { EssaisDeReinitialisation } from "../../domain/essais-de-reinitialisation.ts";

export interface RegistreDesEssaisDeReinitialisation {
  pourAdresse(adresse: AdresseEmail): Promise<EssaisDeReinitialisation>;
  enregistrer(essais: EssaisDeReinitialisation, maintenant: Date): Promise<void>;
}
