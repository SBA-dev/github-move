import { assertEquals, assertThrows } from "@std/assert";
import { CleDeQuestion } from "./cle-de-question.ts";
import { AucuneQuestionDue, FileDeRevisionIncoherente } from "./erreurs.ts";
import { FileDeRevision, type QuestionRetenue } from "./file-de-revision.ts";
import { IntervalleDeRevision } from "./intervalle-de-revision.ts";
import { Jour } from "./jour.ts";
import type { OrigineDeLaQuestion } from "./origine-de-la-question.ts";

const profilDeLea = "profil-lea";
const jourDeLaSeance = Jour.de("2026-10-25");
const termineeLe = new Date("2026-10-25T16:30:00Z");

const origine: OrigineDeLaQuestion = { leconDOrigine: "lecon-fractions", position: 2, type: "calcul" };

function questionRatee(texte: string, origineDeLaQuestion: OrigineDeLaQuestion = origine) {
  return { identite: CleDeQuestion.de("calcul", texte), origine: origineDeLaQuestion };
}

Deno.test("la file de révision d'un profil est vide à sa création", () => {
  const file = FileDeRevision.vide(profilDeLea);

  assertEquals(file.enfant, profilDeLea);
  assertEquals(file.questions, []);
});

Deno.test("une question ratée entre dans la file avec l'intervalle de 1 jour et sa date de révision au lendemain", () => {
  const file = FileDeRevision.vide(profilDeLea);

  file.retenir([questionRatee("3 + 4")], jourDeLaSeance, termineeLe);

  assertEquals(file.questions, [{
    identite: CleDeQuestion.de("calcul", "3 + 4"),
    origine,
    intervalle: IntervalleDeRevision.premier(),
    dateDeRevision: Jour.de("2026-10-26"),
    derniereErreurLe: termineeLe,
    nombreDeFoisRatee: 1,
  }]);
});

Deno.test("plusieurs questions ratées dans la même séance entrent toutes dans la file", () => {
  const file = FileDeRevision.vide(profilDeLea);

  file.retenir([questionRatee("3 + 4"), questionRatee("5 + 6")], jourDeLaSeance, termineeLe);

  assertEquals(
    file.questions.map((question) => question.identite),
    [CleDeQuestion.de("calcul", "3 + 4"), CleDeQuestion.de("calcul", "5 + 6")],
  );
});

const jourDuLendemain = Jour.de("2026-10-26");
const termineeLeLendemain = new Date("2026-10-26T17:00:00Z");

function filePrete(intervalle: number) {
  return FileDeRevision.reconstituer({
    enfant: profilDeLea,
    erreursCorrigeesPourDeBon: 4,
    questions: [{
      identite: CleDeQuestion.de("calcul", "3 + 4"),
      origine,
      intervalle: IntervalleDeRevision.de(intervalle),
      dateDeRevision: Jour.de("2026-11-02"),
      derniereErreurLe: termineeLe,
      nombreDeFoisRatee: 2,
    }],
  });
}

Deno.test("une file se reconstitue depuis ses données avec son compteur d'erreurs corrigées pour de bon", () => {
  const file = filePrete(3);

  assertEquals(file.enfant, profilDeLea);
  assertEquals(file.erreursCorrigeesPourDeBon, 4);
  assertEquals(file.questions[0].intervalle, IntervalleDeRevision.de(3));
});

Deno.test("une question déjà retenue, ratée de nouveau, repart à l'intervalle de 1 jour et compte une fois de plus", () => {
  const file = filePrete(7);

  file.retenir([questionRatee("3 + 4")], jourDuLendemain, termineeLeLendemain);

  assertEquals(file.questions, [{
    identite: CleDeQuestion.de("calcul", "3 + 4"),
    origine,
    intervalle: IntervalleDeRevision.premier(),
    dateDeRevision: Jour.de("2026-10-27"),
    derniereErreurLe: termineeLeLendemain,
    nombreDeFoisRatee: 3,
  }]);
});

Deno.test("une question déjà retenue garde sa leçon d'origine même si elle est ratée dans une autre leçon", () => {
  const file = filePrete(3);
  const autreOrigine: OrigineDeLaQuestion = { leconDOrigine: "lecon-tables", position: 0, type: "calcul" };

  file.retenir([questionRatee("3 + 4", autreOrigine)], jourDuLendemain, termineeLeLendemain);

  assertEquals(file.questions.map((question) => question.origine), [origine]);
});

Deno.test("la même question ratée deux fois dans une séance n'est retenue qu'une fois", () => {
  const file = FileDeRevision.vide(profilDeLea);

  file.retenir([questionRatee("3 + 4"), questionRatee("3 + 4")], jourDeLaSeance, termineeLe);

  assertEquals(file.questions.length, 1);
  assertEquals(file.questions[0].nombreDeFoisRatee, 1);
});

const LIMITE = 250;
const premiereErreur = new Date("2026-09-01T10:00:00Z").getTime();

function identiteNumero(numero: number) {
  return CleDeQuestion.de("calcul", `question ${numero}`);
}

// La question numéro n a été ratée n minutes après la première : la 0 est la plus ancienne.
function fileAvec(nombreDeQuestions: number) {
  return FileDeRevision.reconstituer({
    enfant: profilDeLea,
    erreursCorrigeesPourDeBon: 4,
    questions: Array.from({ length: nombreDeQuestions }, (_, numero) => ({
      identite: identiteNumero(numero),
      origine,
      intervalle: IntervalleDeRevision.premier(),
      dateDeRevision: Jour.de("2026-09-02"),
      derniereErreurLe: new Date(premiereErreur + numero * 60_000),
      nombreDeFoisRatee: 1,
    })),
  });
}

function nouvelleQuestion(numero: number) {
  return { identite: identiteNumero(numero), origine };
}

function identitesDe(file: FileDeRevision) {
  return file.questions.map((question) => question.identite.valeur);
}

Deno.test("la file garde toutes ses questions quand elle atteint exactement 250", () => {
  const file = fileAvec(LIMITE - 1);

  file.retenir([nouvelleQuestion(LIMITE)], jourDeLaSeance, termineeLe);

  assertEquals(file.questions.length, LIMITE);
  assertEquals(identitesDe(file).includes(identiteNumero(0).valeur), true);
});

Deno.test("au-delà de 250, la question à la dernière erreur la plus ancienne est oubliée", () => {
  const file = fileAvec(LIMITE);

  file.retenir([nouvelleQuestion(LIMITE)], jourDeLaSeance, termineeLe);

  assertEquals(file.questions.length, LIMITE);
  assertEquals(identitesDe(file).includes(identiteNumero(0).valeur), false);
  assertEquals(identitesDe(file).includes(identiteNumero(LIMITE).valeur), true);
});

Deno.test("plusieurs questions qui entrent d'un coup font oublier les plus anciennes", () => {
  const file = fileAvec(LIMITE);

  file.retenir(
    [nouvelleQuestion(LIMITE), nouvelleQuestion(LIMITE + 1), nouvelleQuestion(LIMITE + 2)],
    jourDeLaSeance,
    termineeLe,
  );

  assertEquals(file.questions.length, LIMITE);
  for (const numero of [0, 1, 2]) {
    assertEquals(identitesDe(file).includes(identiteNumero(numero).valeur), false);
  }
  assertEquals(identitesDe(file).includes(identiteNumero(3).valeur), true);
});

Deno.test("une question ancienne ratée de nouveau n'est pas oubliée : c'est la suivante qui l'est", () => {
  const file = fileAvec(LIMITE);

  file.retenir([nouvelleQuestion(0), nouvelleQuestion(LIMITE)], jourDeLaSeance, termineeLe);

  assertEquals(file.questions.length, LIMITE);
  assertEquals(identitesDe(file).includes(identiteNumero(0).valeur), true);
  assertEquals(identitesDe(file).includes(identiteNumero(1).valeur), false);
});

Deno.test("une question oubliée ne compte pas comme erreur corrigée pour de bon", () => {
  const file = fileAvec(LIMITE);

  file.retenir([nouvelleQuestion(LIMITE)], jourDeLaSeance, termineeLe);

  assertEquals(file.erreursCorrigeesPourDeBon, 4);
});

function retenue(texte: string, dateDeRevision: string, derniereErreur: string): QuestionRetenue {
  return {
    identite: CleDeQuestion.de("calcul", texte),
    origine,
    intervalle: IntervalleDeRevision.premier(),
    dateDeRevision: Jour.de(dateDeRevision),
    derniereErreurLe: new Date(derniereErreur),
    nombreDeFoisRatee: 1,
  };
}

function fileDes(...questions: QuestionRetenue[]) {
  return FileDeRevision.reconstituer({ enfant: profilDeLea, erreursCorrigeesPourDeBon: 0, questions });
}

function textesDuPlan(file: FileDeRevision, jour: Jour) {
  return file.planDeLaSeanceDeRevision(jour).questions.map((question) => question.identite.valeur);
}

const aujourdHui = Jour.de("2026-10-25");

Deno.test("une question est due le jour de sa date de révision et après, pas avant", () => {
  const file = fileDes(
    retenue("hier", "2026-10-24", "2026-10-23T10:00:00Z"),
    retenue("aujourdhui", "2026-10-25", "2026-10-24T10:00:00Z"),
    retenue("demain", "2026-10-26", "2026-10-25T10:00:00Z"),
  );

  assertEquals(
    file.questionsDues(aujourdHui).map((question) => question.identite.valeur),
    [CleDeQuestion.de("calcul", "hier").valeur, CleDeQuestion.de("calcul", "aujourdhui").valeur],
  );
});

Deno.test("le plan de la séance de révision pose d'abord la question dont la date de révision est la plus ancienne", () => {
  const file = fileDes(
    retenue("recente", "2026-10-25", "2026-10-24T10:00:00Z"),
    retenue("ancienne", "2026-10-22", "2026-10-21T10:00:00Z"),
  );

  assertEquals(textesDuPlan(file, aujourdHui), ["n:ancienne", "n:recente"]);
});

Deno.test("à date de révision égale, le plan pose d'abord la dernière erreur la plus ancienne", () => {
  const file = fileDes(
    retenue("a", "2026-10-25", "2026-10-24T12:00:00Z"),
    retenue("b", "2026-10-25", "2026-10-24T08:00:00Z"),
  );

  assertEquals(textesDuPlan(file, aujourdHui), ["n:b", "n:a"]);
});

Deno.test("à date de révision et dernière erreur égales, le plan range par clé", () => {
  const file = fileDes(
    retenue("c", "2026-10-25", "2026-10-24T08:00:00Z"),
    retenue("a", "2026-10-25", "2026-10-24T08:00:00Z"),
    retenue("b", "2026-10-25", "2026-10-24T08:00:00Z"),
  );

  assertEquals(textesDuPlan(file, aujourdHui), ["n:a", "n:b", "n:c"]);
});

Deno.test("le plan de la séance de révision compte 10 questions au plus", () => {
  const questions = Array.from(
    { length: 12 },
    (_, numero) => retenue(`q${String(numero).padStart(2, "0")}`, "2026-10-25", "2026-10-24T08:00:00Z"),
  );

  const plan = fileDes(...questions).planDeLaSeanceDeRevision(aujourdHui);

  assertEquals(plan.questions.length, 10);
  assertEquals(plan.questions[9].identite.valeur, "n:q09");
});

Deno.test("sans question due, il n'y a pas de séance de révision à planifier", () => {
  const file = fileDes(retenue("demain", "2026-10-26", "2026-10-25T10:00:00Z"));

  assertThrows(() => file.planDeLaSeanceDeRevision(aujourdHui), AucuneQuestionDue);
  assertThrows(() => FileDeRevision.vide(profilDeLea).planDeLaSeanceDeRevision(aujourdHui), AucuneQuestionDue);
});

const finDeRevision = new Date("2026-10-25T18:00:00Z");

function resultat(texte: string, juste: boolean) {
  return { identite: CleDeQuestion.de("calcul", texte), juste };
}

function retenueA(texte: string, jours: number) {
  return { ...retenue(texte, "2026-10-25", "2026-10-24T08:00:00Z"), intervalle: IntervalleDeRevision.de(jours) };
}

Deno.test("une question retenue juste en révision à 1 jour passe à 3 jours, avec sa date de révision recalculée", () => {
  const file = fileDes(retenueA("a", 1));

  file.enregistrerLaRevision([resultat("a", true)], aujourdHui, finDeRevision);

  assertEquals(file.questions[0].intervalle, IntervalleDeRevision.de(3));
  assertEquals(file.questions[0].dateDeRevision, Jour.de("2026-10-28"));
});

Deno.test("une question retenue juste en révision à 3 jours passe à 7 jours", () => {
  const file = fileDes(retenueA("a", 3));

  file.enregistrerLaRevision([resultat("a", true)], aujourdHui, finDeRevision);

  assertEquals(file.questions[0].intervalle, IntervalleDeRevision.de(7));
  assertEquals(file.questions[0].dateDeRevision, Jour.de("2026-11-01"));
});

Deno.test("une question juste en révision ne change ni son nombre de fois ratée ni sa dernière erreur", () => {
  const file = fileDes(retenueA("a", 1));

  file.enregistrerLaRevision([resultat("a", true)], aujourdHui, finDeRevision);

  assertEquals(file.questions[0].nombreDeFoisRatee, 1);
  assertEquals(file.questions[0].derniereErreurLe, new Date("2026-10-24T08:00:00Z"));
});

Deno.test("une question juste en révision à 7 jours est corrigée pour de bon : elle sort de la file et le compteur monte", () => {
  const file = fileDes(retenueA("a", 7), retenueA("b", 3));

  file.enregistrerLaRevision([resultat("a", true)], aujourdHui, finDeRevision);

  assertEquals(file.questions.map((question) => question.identite.valeur), ["n:b"]);
  assertEquals(file.erreursCorrigeesPourDeBon, 1);
});

Deno.test("une question fausse en révision repart à 1 jour, compte une erreur de plus et garde son origine", () => {
  const file = fileDes(retenueA("a", 7));

  file.enregistrerLaRevision([resultat("a", false)], aujourdHui, finDeRevision);

  assertEquals(file.questions, [{
    identite: CleDeQuestion.de("calcul", "a"),
    origine,
    intervalle: IntervalleDeRevision.premier(),
    dateDeRevision: Jour.de("2026-10-26"),
    derniereErreurLe: finDeRevision,
    nombreDeFoisRatee: 2,
  }]);
  assertEquals(file.erreursCorrigeesPourDeBon, 0);
});

Deno.test("le résultat d'une question absente de la file est ignoré", () => {
  const file = fileDes(retenueA("a", 1));

  file.enregistrerLaRevision([resultat("inconnue", false), resultat("inconnue", true)], aujourdHui, finDeRevision);

  assertEquals(file.questions.map((question) => question.identite.valeur), ["n:a"]);
  assertEquals(file.questions[0].intervalle, IntervalleDeRevision.premier());
});

Deno.test("le résultat d'une révision terminée avant la dernière erreur de la question est ignoré", () => {
  const file = fileDes(retenueA("a", 1));
  const avantLaDerniereErreur = new Date("2026-10-24T07:00:00Z");

  file.enregistrerLaRevision([resultat("a", true)], aujourdHui, avantLaDerniereErreur);

  assertEquals(file.questions[0].intervalle, IntervalleDeRevision.premier());
});

Deno.test("plusieurs résultats d'une même révision s'appliquent chacun à leur question", () => {
  const file = fileDes(retenueA("a", 1), retenueA("b", 3), retenueA("c", 7));

  file.enregistrerLaRevision(
    [resultat("a", true), resultat("b", false), resultat("c", true)],
    aujourdHui,
    finDeRevision,
  );

  assertEquals(file.questions.map((question) => [question.identite.valeur, question.intervalle.jours]), [
    ["n:a", 3],
    ["n:b", 1],
  ]);
  assertEquals(file.erreursCorrigeesPourDeBon, 1);
});

Deno.test("oublier une question la retire de la file sans faire monter le compteur d'erreurs corrigées pour de bon", () => {
  const file = fileDes(retenueA("a", 3), retenueA("b", 1));

  file.oublier(CleDeQuestion.de("calcul", "a"));

  assertEquals(file.questions.map((question) => question.identite.valeur), ["n:b"]);
  assertEquals(file.erreursCorrigeesPourDeBon, 0);
});

Deno.test("oublier une question absente de la file est sans effet", () => {
  const file = fileDes(retenueA("a", 3));

  file.oublier(CleDeQuestion.de("calcul", "inconnue"));

  assertEquals(file.questions.map((question) => question.identite.valeur), ["n:a"]);
});

Deno.test("modifier la date passée à retenir ensuite ne change pas la dernière erreur de la file", () => {
  const file = FileDeRevision.vide(profilDeLea);
  const fin = new Date("2026-10-25T16:30:00Z");

  file.retenir([questionRatee("3 + 4")], jourDeLaSeance, fin);
  fin.setUTCFullYear(2000);

  assertEquals(file.questions[0]?.derniereErreurLe, new Date("2026-10-25T16:30:00Z"));
});

Deno.test("modifier la date passée à enregistrerLaRevision ensuite ne change pas la dernière erreur de la file", () => {
  const file = fileDes(retenueA("a", 3));
  const fin = new Date("2026-10-25T18:00:00Z");

  file.enregistrerLaRevision([resultat("a", false)], aujourdHui, fin);
  fin.setUTCFullYear(2000);

  assertEquals(file.questions[0]?.derniereErreurLe, new Date("2026-10-25T18:00:00Z"));
});

Deno.test("modifier la date d'une question reconstituée ensuite ne change pas la file", () => {
  const derniereErreurLe = new Date("2026-10-24T08:00:00Z");
  const file = fileDes({ ...retenueA("a", 3), derniereErreurLe });

  derniereErreurLe.setUTCFullYear(2000);

  assertEquals(file.questions[0]?.derniereErreurLe, new Date("2026-10-24T08:00:00Z"));
});

Deno.test("ratée dans une séance plus ancienne que sa dernière erreur, une question garde la dernière erreur la plus récente", () => {
  const file = fileDes(retenueA("a", 7));
  const seanceAnterieure = new Date("2026-10-23T09:00:00Z");

  file.retenir([questionRatee("a")], Jour.de("2026-10-23"), seanceAnterieure);

  assertEquals(file.questions, [{
    identite: CleDeQuestion.de("calcul", "a"),
    origine,
    intervalle: IntervalleDeRevision.premier(),
    dateDeRevision: Jour.de("2026-10-24"),
    derniereErreurLe: new Date("2026-10-24T08:00:00Z"),
    nombreDeFoisRatee: 2,
  }]);
});

Deno.test("une file de plus de 250 questions ne peut pas être reconstituée", () => {
  const questions = Array.from(
    { length: 251 },
    (_, numero) => retenue(`q${numero}`, "2026-10-25", "2026-10-24T08:00:00Z"),
  );

  assertThrows(() => fileDes(...questions), FileDeRevisionIncoherente);
});

Deno.test("une file qui contient deux fois la même question ne peut pas être reconstituée", () => {
  assertThrows(() => fileDes(retenueA("a", 1), retenueA("a", 3)), FileDeRevisionIncoherente);
});

Deno.test("une file au compteur d'erreurs corrigées pour de bon négatif ne peut pas être reconstituée", () => {
  assertThrows(
    () => FileDeRevision.reconstituer({ enfant: profilDeLea, erreursCorrigeesPourDeBon: -1, questions: [] }),
    FileDeRevisionIncoherente,
  );
});

Deno.test("une file de 250 questions peut être reconstituée", () => {
  const questions = Array.from(
    { length: 250 },
    (_, numero) => retenue(`q${numero}`, "2026-10-25", "2026-10-24T08:00:00Z"),
  );

  assertEquals(fileDes(...questions).questions.length, 250);
});
