import { estUneMatiere, matiereDeCode, Niveau, NiveauInconnu } from "../../catalogue/domain/index.ts";
import type { DefiTermineAEnregistrer } from "../domain/defi-termine-a-enregistrer.ts";
import { NOMBRE_DE_QUESTIONS_DU_DEFI } from "../domain/plan-du-defi.ts";
import { uuidObligatoire } from "../../famille/infrastructure/http-famille.ts";
import { lireLaDateDeFin, lireLeJour, listeDe, objet } from "./corps-de-la-seance-terminee.ts";
import { lireLesReponses, lireLesTirages, lireUneCle } from "./corps-de-la-seance-de-revision-terminee.ts";
import { EntreeInvalide } from "./http-apprentissage.ts";

const CHAMPS = ["id", "enfant", "defi", "questions", "tirages", "reponses", "termineeLe", "jour"];
const CHAMPS_DU_DEFI = ["matiere", "niveau", "numero"];

function lireLeNiveau(brut: unknown): Niveau {
  try {
    return Niveau.de(String(brut));
  } catch (cause) {
    if (cause instanceof NiveauInconnu) throw new EntreeInvalide("Le champ « niveau » du défi est inconnu.");
    throw cause;
  }
}

function lireLeDefi(brut: unknown): DefiTermineAEnregistrer["defi"] {
  const defi = objet(brut, "defi");
  const cles = Object.keys(defi);
  if (cles.length !== CHAMPS_DU_DEFI.length || !CHAMPS_DU_DEFI.every((cle) => cles.includes(cle))) {
    throw new EntreeInvalide("Le champ « defi » contient exactement matiere, niveau et numero.");
  }
  if (!estUneMatiere(defi.matiere)) throw new EntreeInvalide("Le champ « matiere » du défi est inconnu.");
  const { numero } = defi;
  if (typeof numero !== "number" || !Number.isInteger(numero) || numero < 1) {
    throw new EntreeInvalide("Le champ « numero » du défi doit être un entier d'au moins 1.");
  }
  return { matiere: matiereDeCode(defi.matiere), niveau: lireLeNiveau(defi.niveau), numero };
}

/** Lit le corps de la requête. Les étoiles, les erreurs et la file n'y figurent jamais : le serveur les recalcule. */
export function lireLeDefiTermine(corps: Record<string, unknown>, maintenant: Date): DefiTermineAEnregistrer {
  const inconnu = Object.keys(corps).find((cle) => !CHAMPS.includes(cle));
  if (inconnu !== undefined) throw new EntreeInvalide(`Le champ « ${inconnu} » est inconnu.`);
  for (const champ of CHAMPS) {
    if (corps[champ] === undefined) throw new EntreeInvalide(`Le champ « ${champ} » est obligatoire.`);
  }
  return {
    id: uuidObligatoire(corps, "id"),
    enfant: uuidObligatoire(corps, "enfant"),
    defi: lireLeDefi(corps.defi),
    questions: listeDe(corps.questions, "questions", NOMBRE_DE_QUESTIONS_DU_DEFI).map(lireUneCle),
    tirages: lireLesTirages(corps, NOMBRE_DE_QUESTIONS_DU_DEFI),
    reponses: lireLesReponses(corps, NOMBRE_DE_QUESTIONS_DU_DEFI),
    termineeLe: lireLaDateDeFin(corps.termineeLe, maintenant),
    jour: lireLeJour(corps.jour),
  };
}
