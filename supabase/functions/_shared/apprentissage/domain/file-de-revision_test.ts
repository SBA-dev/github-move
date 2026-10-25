import { assertEquals } from "@std/assert";
import { CleDeQuestion } from "./cle-de-question.ts";
import { FileDeRevision } from "./file-de-revision.ts";
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

  file.retenir([nouvelleQuestion(LIMITE), nouvelleQuestion(LIMITE + 1), nouvelleQuestion(LIMITE + 2)], jourDeLaSeance, termineeLe);

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
