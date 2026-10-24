import {
  AdresseDejaUtilisee,
  AdresseEmailInvalide,
  AdresseOuMotDePasseIncorrect,
  ConfirmationDuMotDePasseDifferente,
  InformationsDeReinitialisationIncorrectes,
  MotDePasseNonConforme,
  MotDePasseObligatoire,
  MotDePasseTropLong,
  PrenomObligatoire,
  ServiceDeConnexionIndisponible,
  TropDEssaisDeReinitialisation,
} from "@domain/famille";

const ERREURS_METIER = [
  AdresseDejaUtilisee,
  AdresseEmailInvalide,
  AdresseOuMotDePasseIncorrect,
  ConfirmationDuMotDePasseDifferente,
  InformationsDeReinitialisationIncorrectes,
  MotDePasseNonConforme,
  MotDePasseObligatoire,
  MotDePasseTropLong,
  PrenomObligatoire,
  ServiceDeConnexionIndisponible,
  TropDEssaisDeReinitialisation,
];

export function messageDeConnexion(erreur: unknown): string {
  if (ERREURS_METIER.some((erreurMetier) => erreur instanceof erreurMetier)) return (erreur as Error).message;
  return "Un souci est survenu. Réessaie dans un instant.";
}

export const estAdresseDejaUtilisee = (erreur: unknown) => erreur instanceof AdresseDejaUtilisee;
export const estAdresseOuMotDePasseIncorrect = (erreur: unknown) => erreur instanceof AdresseOuMotDePasseIncorrect;
