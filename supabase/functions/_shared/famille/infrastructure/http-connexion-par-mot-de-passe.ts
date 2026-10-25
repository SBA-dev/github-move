import {
  AdresseDejaUtilisee,
  AdresseEmailInvalide,
  InformationsDeReinitialisationIncorrectes,
  MotDePasseNonConforme,
  MotDePasseTropLong,
  PrenomObligatoire,
  ServiceDeConnexionIndisponible,
  TropDEssaisDeReinitialisation,
} from "../domain/erreurs.ts";
import { EntreeInvalide, lireLeCorpsJson, repondre, texteObligatoire } from "./http-famille.ts";

export const TAILLE_MAXIMALE_DU_CORPS = 4_096;

export function motDePasseObligatoire(corps: Record<string, unknown>): string {
  const valeur = corps.motDePasse;
  if (typeof valeur !== "string" || valeur === "") {
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
  if (cause instanceof ServiceDeConnexionIndisponible) return { statut: 503, message: cause.message };
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
  if (corpsAnnoncePlusGrandQueLeMaximum(requete)) return reponseCorpsTropVolumineux(requete, origines);
  try {
    const texte = await lireLeCorpsBorne(requete);
    if (texte === undefined) return reponseCorpsTropVolumineux(requete, origines);
    await traiter(lireLeCorpsJson(texte));
    return repondre(requete, origines, 200, {});
  } catch (cause) {
    const { statut, message } = statutEtMessageSansConnexion(cause);
    if (statut === 500) {
      console.error("Demande sans connexion en échec :", cause instanceof Error ? cause.name : "erreur inconnue");
    }
    return repondre(requete, origines, statut, { error: { message } });
  }
}

/** Texte du corps, ou `undefined` s'il dépasse la taille maximale (annoncée, ou comptée en octets pendant la lecture). */
async function lireLeCorpsBorne(requete: Request): Promise<string | undefined> {
  const lecteur = requete.body?.getReader();
  if (!lecteur) return "";
  const morceaux: Uint8Array[] = [];
  let total = 0;
  for (let lu = await lecteur.read(); !lu.done; lu = await lecteur.read()) {
    total += lu.value.byteLength;
    if (total > TAILLE_MAXIMALE_DU_CORPS) {
      await lecteur.cancel();
      return undefined;
    }
    morceaux.push(lu.value);
  }
  return new TextDecoder().decode(concatener(morceaux, total));
}

function concatener(morceaux: readonly Uint8Array[], total: number): Uint8Array {
  const octets = new Uint8Array(total);
  let position = 0;
  for (const morceau of morceaux) {
    octets.set(morceau, position);
    position += morceau.byteLength;
  }
  return octets;
}

function corpsAnnoncePlusGrandQueLeMaximum(requete: Request): boolean {
  return Number(requete.headers.get("content-length")) > TAILLE_MAXIMALE_DU_CORPS;
}

function reponseCorpsTropVolumineux(requete: Request, origines: readonly string[]): Response {
  return repondre(requete, origines, 413, { error: { message: "La demande est trop volumineuse." } });
}
