import type { Lecon, Niveau } from "../../catalogue/domain/index.ts";
import {
  ChoixInconnu,
  JeNeSaisPasDejaDit,
  QuestionHorsDuTestDeDepart,
  ReponseIncompatible,
  TestDeDepartIncoherent,
  TirageEnTrop,
  TirageHorsDuGenerateur,
  TirageInvalide,
  TirageManquant,
} from "./erreurs.ts";
import { QuestionsFaussesDeSuite } from "./questions-fausses-de-suite.ts";
import type { QuestionPrevue } from "./plan-du-test-de-depart.ts";
import { reserveDuTestDeDepart } from "./reserve-du-test-de-depart.ts";
import type { ReponseDonnee } from "./reponse.ts";
import { TestDeDepart, type TestDeDepartTermine } from "./test-de-depart.ts";
import type { TestDeDepartTermineAEnregistrer } from "./test-de-depart-termine-a-enregistrer.ts";
import { tireurSelonLesTirages } from "./tireur.ts";

const NOMBRE_MAXIMAL_DE_QUESTIONS = 12;

const ERREURS_DE_REJEU = [
  ChoixInconnu,
  JeNeSaisPasDejaDit,
  QuestionHorsDuTestDeDepart,
  ReponseIncompatible,
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
  if (envoi.tirages.length > envoi.questions.length) throw incoherent("des tirages pour des questions non prévues");
  if (envoi.reponses.length > envoi.questions.length) throw incoherent("des réponses pour des questions non prévues");
  const questions = envoi.questions.map((question, rang) => ({
    question,
    tirages: envoi.tirages[rang] ?? [],
    reponses: envoi.reponses[rang] ?? [],
  }));
  const retenues = questions.filter(({ question }) => leconExiste(question, lecons));
  if (retenues.length === 0) throw incoherent("aucune question du test de départ n'existe plus dans la bibliothèque");
  verifierLaReserve(retenues.map(({ question }) => question), lecons, niveau);
  let serie = QuestionsFaussesDeSuite.aucune();
  const jouees: TestDeDepartTermine["questions"][number][] = [];
  for (const { question, tirages, reponses } of questions) {
    const retiree = !leconExiste(question, lecons);
    if (serie.arreteLeTest()) {
      if (reponses.length > 0) throw incoherent("des réponses après l'arrêt du test");
      if (!retiree) reconstruire(envoi, lecons, niveau, question, tirages);
      continue;
    }
    const juste = retiree
      ? etaitJuste(reponses)
      : rejouerLaQuestion(envoi, lecons, niveau, question, tirages, reponses);
    serie = serie.apres(juste);
    if (!retiree) jouees.push({ lecon: question.leconId, juste });
  }
  return {
    type: "TestDeDepartTermine",
    test: envoi.test,
    enfant: envoi.enfant,
    termineeLe: envoi.termineeLe,
    questions: jouees,
    arrete: serie.arreteLeTest(),
  };
}

function etaitJuste(reponses: readonly ReponseDonnee[]): boolean {
  return reponses.length === 1 && reponses.every(({ genre }) => genre !== "jeNeSaisPas");
}

function reconstruire(
  envoi: TestDeDepartTermineAEnregistrer,
  lecons: readonly Lecon[],
  niveau: Niveau,
  question: QuestionPrevue,
  groupe: readonly (readonly string[])[],
): TestDeDepart {
  const tirages = groupe.values();
  const test = TestDeDepart.commencer({
    generateurId: { nouveau: () => envoi.test },
    enfant: envoi.enfant,
    niveau,
    lecons,
    plan: [question],
    tireur: tireurSelonLesTirages(tirages),
  });
  if (!tirages.next().done) throw new TirageEnTrop();
  return test;
}

function rejouerLaQuestion(
  envoi: TestDeDepartTermineAEnregistrer,
  lecons: readonly Lecon[],
  niveau: Niveau,
  question: QuestionPrevue,
  tirages: readonly (readonly string[])[],
  reponses: readonly ReponseDonnee[],
): boolean {
  const test = reconstruire(envoi, lecons, niveau, question, tirages);
  reponses.forEach((reponse) => {
    if (test.estFini()) throw incoherent("des réponses après la bonne réponse");
    rejouerLaReponse(test, reponse);
  });
  if (!test.estFini()) throw incoherent("une question posée ne finit pas par la bonne réponse");
  return test.terminer(envoi.termineeLe).questions.every(({ juste }) => juste);
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

function rejouerLaReponse(test: TestDeDepart, reponse: ReponseDonnee): void {
  if (reponse.genre === "jeNeSaisPas") test.direJeNeSaisPas();
  else if (reponse.genre === "choix" || reponse.genre === "nombre") test.repondre(reponse);
  else throw new ReponseIncompatible(reponse.genre);
}

function incoherent(raison: string): TestDeDepartIncoherent {
  return new TestDeDepartIncoherent(new Error(raison));
}
