import { CleDeQuestion } from "../domain/cle-de-question.ts";
import { CleDeQuestionInvalide } from "../domain/erreurs.ts";
import { NOMBRE_MAXIMAL_DE_QUESTIONS_PAR_SEANCE_DE_REVISION } from "../domain/file-de-revision.ts";
import type { ReponseDonnee } from "../domain/reponse.ts";
import type { SeanceDeRevisionTermineeAEnregistrer } from "../domain/seance-de-revision-terminee-a-enregistrer.ts";
import { NOMBRE_MAXIMAL_D_ETIQUETTES } from "../../catalogue/domain/index.ts";
import { uuidObligatoire } from "../../famille/infrastructure/http-famille.ts";
import { lireLaDateDeFin, lireLeJour, lireUneReponse, listeDe, texteCourt } from "./corps-de-la-seance-terminee.ts";
import { EntreeInvalide } from "./http-apprentissage.ts";

const CHAMPS = ["id", "enfant", "questions", "tirages", "reponses", "termineeLe", "jour"];
const QUESTIONS_AU_PLUS = NOMBRE_MAXIMAL_DE_QUESTIONS_PAR_SEANCE_DE_REVISION;
/** Borne technique du corps HTTP : la revalidation du domaine applique la vraie limite de chaque question. */
const REPONSES_AU_PLUS_PAR_QUESTION = 1000;

export function lireUneCle(brute: unknown): CleDeQuestion {
  try {
    return CleDeQuestion.depuisLaValeur(texteCourt(brute, "questions"));
  } catch (cause) {
    if (cause instanceof CleDeQuestionInvalide) {
      throw new EntreeInvalide("Le champ « questions » ne contient que des clés de question valides.");
    }
    throw cause;
  }
}

export function lireLesTirages(corps: Record<string, unknown>, auPlus = QUESTIONS_AU_PLUS): string[][] {
  return listeDe(corps.tirages, "tirages", auPlus).map((groupe) =>
    listeDe(groupe, "tirages", NOMBRE_MAXIMAL_D_ETIQUETTES).map((choix) => texteCourt(choix, "tirages"))
  );
}

export function lireLesReponses(corps: Record<string, unknown>, auPlus = QUESTIONS_AU_PLUS): ReponseDonnee[][] {
  return listeDe(corps.reponses, "reponses", auPlus).map((groupe) =>
    listeDe(groupe, "reponses", REPONSES_AU_PLUS_PAR_QUESTION).map(lireUneReponse)
  );
}

/** Lit le corps de la requête. Ni les résultats ni la file n'y figurent : le serveur les recalcule. */
export function lireLaSeanceDeRevisionTerminee(
  corps: Record<string, unknown>,
  maintenant: Date,
): SeanceDeRevisionTermineeAEnregistrer {
  const inconnu = Object.keys(corps).find((cle) => !CHAMPS.includes(cle));
  if (inconnu !== undefined) throw new EntreeInvalide(`Le champ « ${inconnu} » est inconnu.`);
  for (const champ of CHAMPS) {
    if (corps[champ] === undefined) throw new EntreeInvalide(`Le champ « ${champ} » est obligatoire.`);
  }
  return {
    id: uuidObligatoire(corps, "id"),
    enfant: uuidObligatoire(corps, "enfant"),
    questions: listeDe(corps.questions, "questions", QUESTIONS_AU_PLUS).map(lireUneCle),
    tirages: lireLesTirages(corps),
    reponses: lireLesReponses(corps),
    termineeLe: lireLaDateDeFin(corps.termineeLe, maintenant),
    jour: lireLeJour(corps.jour),
  };
}
