import type { AdresseEmail } from "../../domain/adresse-email.ts";
import type { EssaisDeReinitialisation } from "../../domain/essais-de-reinitialisation.ts";

/** Deux essais simultanés ont lu la même version : le second doit relire l'état à jour et recommencer. */
export class EssaisDeReinitialisationModifiesEnMemeTemps extends Error {}

export interface RegistreDesEssaisDeReinitialisation {
  pourAdresse(adresse: AdresseEmail): Promise<EssaisDeReinitialisation>;
  enregistrer(essais: EssaisDeReinitialisation, maintenant: Date): Promise<void>;
}
