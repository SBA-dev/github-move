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
