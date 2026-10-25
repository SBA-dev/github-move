import type { PlanDuTestDeDepart } from "../domain/plan-du-test-de-depart.ts";
import type { ReponseDonnee } from "../domain/reponse.ts";
import type { TestDeDepartTermineAEnregistrer } from "../domain/test-de-depart-termine-a-enregistrer.ts";
import { NOMBRE_MAXIMAL_D_ETIQUETTES } from "../../catalogue/domain/index.ts";
import { texteObligatoire, uuidObligatoire } from "../../famille/infrastructure/http-famille.ts";
import { lireLaDateDeFin, lireUneReponse, listeDe, objet, texteCourt } from "./corps-de-la-seance-terminee.ts";
import { EntreeInvalide } from "./http-apprentissage.ts";

const CHAMPS = ["test", "enfant", "questions", "tirages", "reponses", "termineeLe"];
const QUESTIONS_AU_PLUS = 12;
const TIRAGES_AU_PLUS_PAR_QUESTION = 50;
const REPONSES_AU_PLUS_PAR_QUESTION = 1000;
const IDENTIFIANT_DE_LECON_AU_PLUS = 100;

function entierPositifOuNul(valeur: unknown, champ: string): number {
  if (typeof valeur !== "number" || !Number.isInteger(valeur) || valeur < 0) {
    throw new EntreeInvalide(`Le champ « ${champ} » doit contenir des entiers positifs ou nuls.`);
  }
  return valeur;
}

function lireLePlan(corps: Record<string, unknown>): PlanDuTestDeDepart {
  return listeDe(corps.questions, "questions", QUESTIONS_AU_PLUS).map((brute) => {
    const question = objet(brute, "questions");
    const leconId = texteObligatoire(question, "leconId");
    if (leconId.length === 0 || leconId.length > IDENTIFIANT_DE_LECON_AU_PLUS) {
      throw new EntreeInvalide("Le champ « leconId » doit contenir entre 1 et 100 caractères.");
    }
    return {
      leconId,
      exercice: entierPositifOuNul(question.exercice, "exercice"),
      rang: entierPositifOuNul(question.rang, "rang"),
    };
  });
}

function lireLesTirages(corps: Record<string, unknown>): string[][][] {
  return listeDe(corps.tirages, "tirages", QUESTIONS_AU_PLUS).map((groupe) =>
    listeDe(groupe, "tirages", TIRAGES_AU_PLUS_PAR_QUESTION).map((tirage) =>
      listeDe(tirage, "tirages", NOMBRE_MAXIMAL_D_ETIQUETTES).map((choix) => texteCourt(choix, "tirages"))
    )
  );
}

function lireLesReponses(corps: Record<string, unknown>): ReponseDonnee[][] {
  return listeDe(corps.reponses, "reponses", QUESTIONS_AU_PLUS).map((groupe) =>
    listeDe(groupe, "reponses", REPONSES_AU_PLUS_PAR_QUESTION).map(lireUneReponse)
  );
}

/** Lit le corps de la requête. Les leçons réussies n'y figurent jamais : le serveur les recalcule. */
export function lireLeTestDeDepartTermine(
  corps: Record<string, unknown>,
  maintenant: Date,
): TestDeDepartTermineAEnregistrer {
  const inconnu = Object.keys(corps).find((cle) => !CHAMPS.includes(cle));
  if (inconnu !== undefined) throw new EntreeInvalide(`Le champ « ${inconnu} » est inconnu.`);
  for (const champ of CHAMPS) {
    if (corps[champ] === undefined) throw new EntreeInvalide(`Le champ « ${champ} » est obligatoire.`);
  }
  return {
    test: uuidObligatoire(corps, "test"),
    enfant: uuidObligatoire(corps, "enfant"),
    questions: lireLePlan(corps),
    tirages: lireLesTirages(corps),
    reponses: lireLesReponses(corps),
    termineeLe: lireLaDateDeFin(corps.termineeLe, maintenant),
  };
}
