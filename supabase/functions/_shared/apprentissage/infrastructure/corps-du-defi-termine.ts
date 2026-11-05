import { estUneMatiere, matiereDeCode, Niveau, NiveauInconnu } from "../../catalogue/domain/index.ts";
import type { DefiTermineAEnregistrer } from "../domain/defi-termine-a-enregistrer.ts";
import { nombreDeQuestionsDuDefi } from "../domain/plan-du-defi.ts";
import { uuidObligatoire } from "../../famille/infrastructure/http-famille.ts";
import { lireLaDateDeFin, lireLeJour, listeDe, objet } from "./corps-de-la-seance-terminee.ts";
import { lireLesReponses, lireLesTirages, lireUneCle } from "./corps-de-la-seance-de-revision-terminee.ts";
import { EntreeInvalide } from "./http-apprentissage.ts";

const CHAMPS = ["id", "enfant", "defi", "questions", "tirages", "reponses", "termineeLe", "jour"];
const CHAMPS_DU_DEFI = ["matiere", "niveau", "numero"];
const CHAMPS_DU_GRAND_DEFI = ["matiere", "niveau", "grandDefi"];

function lireLeNiveau(brut: unknown): Niveau {
  try {
    return Niveau.de(String(brut));
  } catch (cause) {
    if (cause instanceof NiveauInconnu) throw new EntreeInvalide("Le champ « niveau » du défi est inconnu.");
    throw cause;
  }
}

function aExactement(defi: Record<string, unknown>, champs: string[]): boolean {
  const cles = Object.keys(defi);
  return cles.length === champs.length && champs.every((cle) => cles.includes(cle));
}

function lireLeNumero(numero: unknown): number {
  if (typeof numero !== "number" || !Number.isInteger(numero) || numero < 1) {
    throw new EntreeInvalide("Le champ « numero » du défi doit être un entier d'au moins 1.");
  }
  return numero;
}

function lireLeDefi(brut: unknown): DefiTermineAEnregistrer["defi"] {
  const defi = objet(brut, "defi");
  const grandDefi = aExactement(defi, CHAMPS_DU_GRAND_DEFI) && defi.grandDefi === true;
  if (!grandDefi && !aExactement(defi, CHAMPS_DU_DEFI)) {
    throw new EntreeInvalide("Le champ « defi » contient exactement matiere, niveau et numero, ou grandDefi.");
  }
  if (!estUneMatiere(defi.matiere)) throw new EntreeInvalide("Le champ « matiere » du défi est inconnu.");
  const matiere = matiereDeCode(defi.matiere);
  if (grandDefi) return { matiere, niveau: lireLeNiveau(defi.niveau), grandDefi: true };
  return { matiere, niveau: lireLeNiveau(defi.niveau), numero: lireLeNumero(defi.numero) };
}

/** Lit le corps de la requête. Les étoiles, les erreurs et la file n'y figurent jamais : le serveur les recalcule. */
export function lireLeDefiTermine(corps: Record<string, unknown>, maintenant: Date): DefiTermineAEnregistrer {
  const inconnu = Object.keys(corps).find((cle) => !CHAMPS.includes(cle));
  if (inconnu !== undefined) throw new EntreeInvalide(`Le champ « ${inconnu} » est inconnu.`);
  for (const champ of CHAMPS) {
    if (corps[champ] === undefined) throw new EntreeInvalide(`Le champ « ${champ} » est obligatoire.`);
  }
  const defi = lireLeDefi(corps.defi);
  const limite = nombreDeQuestionsDuDefi(defi);
  return {
    id: uuidObligatoire(corps, "id"),
    enfant: uuidObligatoire(corps, "enfant"),
    defi,
    questions: listeDe(corps.questions, "questions", limite).map(lireUneCle),
    tirages: lireLesTirages(corps, limite),
    reponses: lireLesReponses(corps, limite),
    termineeLe: lireLaDateDeFin(corps.termineeLe, maintenant),
    jour: lireLeJour(corps.jour),
  };
}
