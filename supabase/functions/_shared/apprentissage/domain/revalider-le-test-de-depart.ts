import type { Lecon, Niveau } from "../../catalogue/domain/index.ts";
import {
  BonneReponseAbsenteDesChoix,
  ChoixInconnu,
  GroupeInconnu,
  JeNeSaisPasDejaDit,
  MotIncomplet,
  QuestionHorsDuTestDeDepart,
  ReponseIncompatible,
  TestDeDepartDejaFini,
  TestDeDepartIncoherent,
  TestDeDepartNonFini,
  TirageEnTrop,
  TirageHorsDuGenerateur,
  TirageInvalide,
  TirageManquant,
} from "./erreurs.ts";
import type { QuestionPrevue } from "./plan-du-test-de-depart.ts";
import { reserveDuTestDeDepart } from "./reserve-du-test-de-depart.ts";
import type { ReponseDonnee } from "./reponse.ts";
import { TestDeDepart, type TestDeDepartTermine } from "./test-de-depart.ts";
import type { TestDeDepartTermineAEnregistrer } from "./test-de-depart-termine-a-enregistrer.ts";
import { tireurSelonLesTirages } from "./tireur.ts";

const NOMBRE_MAXIMAL_DE_QUESTIONS = 12;

const ERREURS_DE_REJEU = [
  BonneReponseAbsenteDesChoix,
  ChoixInconnu,
  GroupeInconnu,
  JeNeSaisPasDejaDit,
  MotIncomplet,
  QuestionHorsDuTestDeDepart,
  ReponseIncompatible,
  TestDeDepartDejaFini,
  TestDeDepartNonFini,
  TirageEnTrop,
  TirageHorsDuGenerateur,
  TirageInvalide,
  TirageManquant,
];

export function revaliderLeTestDeDepart(
  envoi: TestDeDepartTermineAEnregistrer,
  lecons: readonly Lecon[],
  niveau: Niveau,
): TestDeDepartTermine {
  try {
    return rejouer(envoi, lecons, niveau);
  } catch (erreur) {
    if (ERREURS_DE_REJEU.some((classe) => erreur instanceof classe)) {
      throw new TestDeDepartIncoherent(erreur as Error);
    }
    throw erreur;
  }
}

function rejouer(
  envoi: TestDeDepartTermineAEnregistrer,
  lecons: readonly Lecon[],
  niveau: Niveau,
): TestDeDepartTermine {
  if (envoi.questions.length > NOMBRE_MAXIMAL_DE_QUESTIONS) throw incoherent("trop de questions");
  const retenues = envoi.questions
    .map((question, rang) => ({
      question,
      tirages: envoi.tirages[rang] ?? [],
      reponses: envoi.reponses[rang] ?? [],
    }))
    .filter(({ question }) => leconExiste(question, lecons));
  const plan = retenues.map(({ question }) => question);
  verifierLaReserve(plan, lecons, niveau);
  const test = TestDeDepart.commencer({
    generateurId: { nouveau: () => envoi.test },
    enfant: envoi.enfant,
    niveau,
    lecons,
    plan,
    tireur: tireurSelonLesTirages(retenues.flatMap(({ tirages }) => tirages).values()),
  });
  const reponsesApresLePlan = envoi.reponses.slice(envoi.questions.length);
  [...retenues.map(({ reponses }) => reponses), ...reponsesApresLePlan].forEach((reponses) =>
    rejouerLesReponses(test, reponses)
  );
  if (!test.estFini()) throw incoherent("le test s'arrête avant la fin sans trois questions fausses de suite");
  return test.terminer(envoi.termineeLe);
}

function leconExiste(question: QuestionPrevue, lecons: readonly Lecon[]): boolean {
  return lecons.some(({ id }) => id === question.leconId);
}

function verifierLaReserve(questions: readonly QuestionPrevue[], lecons: readonly Lecon[], niveau: Niveau): void {
  const reserve = reserveDuTestDeDepart(lecons, niveau).map(({ id }) => id);
  const rangs = questions.map(({ leconId }) => reserve.indexOf(leconId));
  if (rangs.includes(-1)) throw incoherent("une leçon est hors de la réserve du test de départ");
  if (rangs.some((rang, i) => rang <= (rangs[i - 1] ?? -1))) {
    throw incoherent("les questions ne suivent pas l'ordre de la réserve, ou une leçon est posée deux fois");
  }
}

function rejouerLesReponses(test: TestDeDepart, reponses: readonly ReponseDonnee[]): void {
  const question = test.questionEnCours();
  reponses.forEach((reponse) => rejouerLaReponse(test, reponse));
  if (question !== undefined && test.questionEnCours() === question) {
    throw incoherent("une question posée ne finit pas par la bonne réponse");
  }
}

function rejouerLaReponse(test: TestDeDepart, reponse: ReponseDonnee): void {
  if (reponse.genre === "jeNeSaisPas") test.direJeNeSaisPas();
  else if (reponse.genre === "choix" || reponse.genre === "nombre") test.repondre(reponse);
  else throw new ReponseIncompatible(reponse.genre);
}

function incoherent(raison: string): TestDeDepartIncoherent {
  return new TestDeDepartIncoherent(new Error(raison));
}
