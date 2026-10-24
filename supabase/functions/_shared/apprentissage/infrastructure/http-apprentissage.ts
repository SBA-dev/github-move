import { ProfilEnfantIntrouvable } from "../../famille/domain/erreurs.ts";
import {
  EntreeInvalide,
  lireLeCorpsJson,
  NonAuthentifie,
  ouvrirLaSessionDuParent,
  repondre,
  type SessionDuParent,
} from "../../famille/infrastructure/http-famille.ts";
import { LeconIntrouvable, ParentNonRattache, SeanceIncoherente } from "../domain/erreurs.ts";

export { EntreeInvalide };

export function statutEtMessage(cause: unknown): { statut: number; message: string } {
  if (cause instanceof NonAuthentifie) return { statut: 401, message: "Connecte-toi pour continuer." };
  if (cause instanceof ParentNonRattache || cause instanceof ProfilEnfantIntrouvable) {
    return { statut: 404, message: new ProfilEnfantIntrouvable().message };
  }
  if (cause instanceof LeconIntrouvable) return { statut: 404, message: "Cette leçon est introuvable." };
  if (cause instanceof SeanceIncoherente) return { statut: 422, message: "Cette séance n'a pas pu être vérifiée." };
  if (cause instanceof EntreeInvalide) return { statut: 400, message: cause.message };
  return { statut: 500, message: "La séance n'a pas pu être enregistrée." };
}

/** Gabarit des fonctions d'écriture d'Apprentissage : méthode, session du parent, corps, erreurs métier en codes HTTP. */
export async function traiterUneEcritureDApprentissage(
  requete: Request,
  ecrire: (session: SessionDuParent, corps: Record<string, unknown>) => Promise<unknown>,
  origines: readonly string[],
): Promise<Response> {
  if (requete.method === "OPTIONS") return repondre(requete, origines, 204, null);
  if (requete.method !== "POST") {
    return repondre(requete, origines, 405, { error: { message: "Méthode non autorisée." } });
  }
  try {
    const session = await ouvrirLaSessionDuParent(requete);
    const corps = lireLeCorpsJson(await requete.text());
    return repondre(requete, origines, 200, await ecrire(session, corps));
  } catch (cause) {
    const { statut, message } = statutEtMessage(cause);
    if (statut === 422 || statut === 500) {
      console.error("Écriture d'Apprentissage refusée ou en échec :", cause instanceof Error ? cause.name : "erreur");
    }
    return repondre(requete, origines, statut, { error: { message } });
  }
}
