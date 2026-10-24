import { NOMBRE_MAXIMAL_D_ETIQUETTES } from "../../catalogue/domain/index.ts";
import { ChoixDeSeance } from "../domain/choix-de-seance.ts";
import { Reponse, type ReponseDonnee } from "../domain/reponse.ts";
import type { SeanceTermineeAEnregistrer } from "../domain/seance-terminee-a-enregistrer.ts";
import { texteObligatoire, uuidObligatoire } from "../../famille/infrastructure/http-famille.ts";
import { EntreeInvalide } from "./http-apprentissage.ts";

const CHAMPS = ["seance", "enfant", "lecon", "choix", "tirages", "reponses", "termineeLe"];
const QUESTIONS_AU_PLUS = 200;
const TIRAGE_AU_PLUS = NOMBRE_MAXIMAL_D_ETIQUETTES;
const REPONSES_AU_PLUS = 50;
const CARACTERES_AU_PLUS = 200;
const TOLERANCE_D_HORLOGE_EN_MS = 5 * 60 * 1000;

type Objet = Record<string, unknown>;

function objet(valeur: unknown, champ: string): Objet {
  if (typeof valeur !== "object" || valeur === null || Array.isArray(valeur)) {
    throw new EntreeInvalide(`Le champ « ${champ} » est mal formé.`);
  }
  return valeur as Objet;
}

function listeDe(valeur: unknown, champ: string, auPlus: number): unknown[] {
  if (!Array.isArray(valeur) || valeur.length > auPlus) {
    throw new EntreeInvalide(`Le champ « ${champ} » doit être une liste d'au plus ${auPlus} éléments.`);
  }
  return valeur;
}

function texteCourt(valeur: unknown, champ: string): string {
  if (typeof valeur !== "string" || valeur.length > CARACTERES_AU_PLUS) {
    throw new EntreeInvalide(`Le champ « ${champ} » contient un texte invalide.`);
  }
  return valeur;
}

function lireLeChoix(corps: Objet): ChoixDeSeance {
  const choix = objet(corps.choix, "choix");
  if (choix.genre === "complete") return ChoixDeSeance.complete();
  const { position } = choix;
  if (choix.genre === "unExercice" && Number.isInteger(position) && (position as number) >= 0) {
    return ChoixDeSeance.unExercice(position as number);
  }
  throw new EntreeInvalide("Le champ « choix » doit être une séance complète ou un exercice à une position valide.");
}

function lireLesTirages(corps: Objet): string[][] {
  return listeDe(corps.tirages, "tirages", QUESTIONS_AU_PLUS).map((tirage) =>
    listeDe(tirage, "tirages", TIRAGE_AU_PLUS).map((choix) => texteCourt(choix, "tirages"))
  );
}

function lireUneReponse(brute: unknown): ReponseDonnee {
  const reponse = objet(brute, "reponses");
  const cles = Object.keys(reponse);
  if (cles.length === 1 && cles[0] === "choix") return Reponse.choix(texteCourt(reponse.choix, "reponses"));
  if (cles.length === 1 && cles[0] === "placement") return lireUnPlacement(reponse.placement);
  if (cles.length === 1 && cles[0] === "motEcrit") return Reponse.motEcrit(lireLesLettres(reponse.motEcrit));
  if (cles.length === 1 && cles[0] === "jeNeSaisPas" && reponse.jeNeSaisPas === true) return { genre: "jeNeSaisPas" };
  throw new EntreeInvalide(
    "Le champ « reponses » ne contient que des choix, des placements, des mots écrits ou « Je ne sais pas ».",
  );
}

function lireLesLettres(brutes: unknown): string[] {
  const lettres = listeDe(brutes, "reponses", REPONSES_AU_PLUS);
  if (lettres.length === 0) throw new EntreeInvalide("Le champ « reponses » ne contient aucune lettre.");
  return lettres.map((lettre) => {
    if (typeof lettre !== "string" || [...lettre].length !== 1) {
      throw new EntreeInvalide("Le champ « reponses » ne contient que des lettres d'un caractère.");
    }
    return lettre;
  });
}

function lireUnPlacement(brut: unknown): ReponseDonnee {
  const placement = objet(brut, "reponses");
  const etiquette = texteCourt(placement.etiquette, "reponses");
  const groupe = placement.groupe === undefined ? undefined : texteCourt(placement.groupe, "reponses");
  return Reponse.placement(etiquette, groupe);
}

function lireLesReponses(corps: Objet): ReponseDonnee[][] {
  return listeDe(corps.reponses, "reponses", QUESTIONS_AU_PLUS).map((question) =>
    listeDe(question, "reponses", REPONSES_AU_PLUS).map(lireUneReponse)
  );
}

function lireLaDateDeFin(valeur: unknown, maintenant: Date): Date {
  const date = typeof valeur === "string" && valeur !== "" ? new Date(valeur) : new Date(NaN);
  if (Number.isNaN(date.getTime())) throw new EntreeInvalide("Le champ « termineeLe » doit être une date ISO valide.");
  if (date.getTime() > maintenant.getTime() + TOLERANCE_D_HORLOGE_EN_MS) {
    throw new EntreeInvalide("Le champ « termineeLe » ne peut pas être dans le futur.");
  }
  return date;
}

/** Lit le corps de la requête. Les étoiles et les erreurs n'y figurent jamais : le serveur les recalcule. */
export function lireLaSeanceTerminee(corps: Objet, maintenant: Date): SeanceTermineeAEnregistrer {
  const inconnu = Object.keys(corps).find((cle) => !CHAMPS.includes(cle));
  if (inconnu !== undefined) throw new EntreeInvalide(`Le champ « ${inconnu} » est inconnu.`);
  for (const champ of CHAMPS) {
    if (corps[champ] === undefined) throw new EntreeInvalide(`Le champ « ${champ} » est obligatoire.`);
  }
  return {
    seance: uuidObligatoire(corps, "seance"),
    enfant: uuidObligatoire(corps, "enfant"),
    lecon: texteObligatoire(corps, "lecon"),
    choix: lireLeChoix(corps),
    tirages: lireLesTirages(corps),
    reponses: lireLesReponses(corps),
    termineeLe: lireLaDateDeFin(corps.termineeLe, maintenant),
  };
}
