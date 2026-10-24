import {
  AdresseDejaUtilisee,
  AdresseEmailInvalide,
  InformationsDeReinitialisationIncorrectes,
  MotDePasseNonConforme,
  MotDePasseTropLong,
  PrenomObligatoire,
  TropDEssaisDeReinitialisation,
} from "../domain/erreurs.ts";
import { EntreeInvalide, lireLeCorpsJson, repondre, texteObligatoire } from "./http-famille.ts";

/** Caractères d'un mot de passe : 64 au plus, mais le texte reçu peut dépasser (le domaine le refuse en 422). */
const LONGUEUR_MAXIMALE_DU_CORPS = 10_000;

export function motDePasseObligatoire(corps: Record<string, unknown>): string {
  const valeur = corps.motDePasse;
  if (typeof valeur !== "string" || valeur === "" || valeur.length > LONGUEUR_MAXIMALE_DU_CORPS) {
    throw new EntreeInvalide("Le champ « motDePasse » est obligatoire.");
  }
  return valeur;
}

export function adresseObligatoire(corps: Record<string, unknown>): string {
  return texteObligatoire(corps, "adresse");
}

/** Contrat HTTP des fonctions appelées sans parent connecté (décision 0019). Jamais la saisie dans le message. */
export function statutEtMessageSansConnexion(cause: unknown): { statut: number; message: string } {
  if (cause instanceof AdresseDejaUtilisee) return { statut: 409, message: cause.message };
  if (cause instanceof InformationsDeReinitialisationIncorrectes) return { statut: 401, message: cause.message };
  if (cause instanceof TropDEssaisDeReinitialisation) return { statut: 429, message: cause.message };
  if (
    cause instanceof EntreeInvalide || cause instanceof AdresseEmailInvalide || cause instanceof PrenomObligatoire ||
    cause instanceof MotDePasseNonConforme || cause instanceof MotDePasseTropLong
  ) return { statut: 422, message: cause.message };
  return { statut: 500, message: "La demande n'a pas pu être traitée." };
}

/** Gabarit commun : méthode, corps JSON, erreurs métier en codes HTTP. L'appelant n'est pas connecté : pas de JWT. */
export async function traiterUneDemandeSansConnexion(
  requete: Request,
  traiter: (corps: Record<string, unknown>) => Promise<void>,
  origines: readonly string[],
): Promise<Response> {
  if (requete.method === "OPTIONS") return repondre(requete, origines, 204, null);
  if (requete.method !== "POST") {
    return repondre(requete, origines, 405, { error: { message: "Méthode non autorisée." } });
  }
  try {
    await traiter(lireLeCorpsJson(await requete.text()));
    return repondre(requete, origines, 200, {});
  } catch (cause) {
    const { statut, message } = statutEtMessageSansConnexion(cause);
    if (statut === 500) {
      console.error("Demande sans connexion en échec :", cause instanceof Error ? cause.name : "erreur inconnue");
    }
    return repondre(requete, origines, statut, { error: { message } });
  }
}
