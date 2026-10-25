import { type Matiere, matiereDeCode, Niveau, NiveauInconnu, toutesLesMatieres } from "../../catalogue/domain/index.ts";
import { ProfilEnfantIntrouvable } from "../../famille/domain/erreurs.ts";
import {
  EntreeInvalide,
  lireLeCorpsJson,
  NonAuthentifie,
  ouvrirLaSessionDuParent,
  repondre,
  type SessionDuParent,
  texteObligatoire,
  uuidObligatoire,
} from "../../famille/infrastructure/http-famille.ts";
import {
  AucuneCitationDansLaSection,
  AucuneSectionDuProgramme,
  LeconImpossibleAPreparer,
  LeconPersonnelleIntrouvable,
  LeconPersonnelleInvalide,
  ParentNonRattache,
  TexteTropCourt,
  TexteTropLong,
} from "../domain/erreurs.ts";

export { EntreeInvalide };

const PREFIXE_D_UNE_LECON_PERSONNELLE = "perso-";
const LONGUEUR_MAXIMALE_D_UN_IDENTIFIANT = 100;
// Le domaine borne le texte à 3000 caractères après un `trim()` : cette limite évite seulement de lire un corps démesuré.
const LONGUEUR_MAXIMALE_DU_CORPS_DU_TEXTE = 10000;

export type CorpsDeCreation = {
  profil: string;
  texte: string;
  niveau: Niveau;
  matiere?: Matiere;
};

export function lireLaCreation(corps: Record<string, unknown>): CorpsDeCreation {
  const texte = corps.texte;
  if (typeof texte !== "string" || texte.length > LONGUEUR_MAXIMALE_DU_CORPS_DU_TEXTE) {
    throw new EntreeInvalide("Le champ « texte » doit être un texte.");
  }
  const matiere = lireLaMatiere(corps.matiere);
  return {
    profil: uuidObligatoire(corps, "profil"),
    texte,
    niveau: Niveau.de(texteObligatoire(corps, "niveau")),
    ...(matiere ? { matiere } : {}),
  };
}

function lireLaMatiere(brute: unknown): Matiere | undefined {
  if (brute === undefined) return undefined;
  const code = toutesLesMatieres().find((matiere) => matiere.code === brute)?.code;
  if (code === undefined) throw new EntreeInvalide("Le champ « matiere » n'est pas une matière connue.");
  return matiereDeCode(code);
}

export function lireLaSuppression(corps: Record<string, unknown>): { lecon: string } {
  const lecon = texteObligatoire(corps, "lecon");
  if (
    !lecon.startsWith(PREFIXE_D_UNE_LECON_PERSONNELLE) || lecon.length > LONGUEUR_MAXIMALE_D_UN_IDENTIFIANT
  ) throw new EntreeInvalide("Le champ « lecon » doit être l'identifiant d'une leçon personnelle.");
  return { lecon };
}

export function statutEtMessage(cause: unknown): { statut: number; message: string } {
  if (cause instanceof NonAuthentifie) return { statut: 401, message: "Connecte-toi pour continuer." };
  if (cause instanceof ParentNonRattache || cause instanceof ProfilEnfantIntrouvable) {
    return { statut: 404, message: new ProfilEnfantIntrouvable().message };
  }
  if (cause instanceof LeconPersonnelleIntrouvable) return { statut: 404, message: cause.message };
  if (
    cause instanceof EntreeInvalide || cause instanceof NiveauInconnu || cause instanceof TexteTropCourt ||
    cause instanceof TexteTropLong || cause instanceof AucuneSectionDuProgramme ||
    cause instanceof AucuneCitationDansLaSection || cause instanceof LeconImpossibleAPreparer
  ) return { statut: 400, message: cause.message };
  if (cause instanceof LeconPersonnelleInvalide) {
    return { statut: 422, message: "Cette leçon n'a pas pu être vérifiée." };
  }
  return { statut: 500, message: "La leçon personnelle n'a pas pu être enregistrée." };
}

/** Gabarit des fonctions d'écriture d'Accompagnement : méthode, session du parent, corps, erreurs métier en codes HTTP. */
export async function traiterUneEcritureDAccompagnement(
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
      console.error("Écriture d'Accompagnement refusée ou en échec :", cause instanceof Error ? cause.name : "erreur");
    }
    return repondre(requete, origines, statut, { error: { message } });
  }
}
