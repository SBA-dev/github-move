import { assertEquals, assertThrows } from "@std/assert";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { leconDeCalcul, leconDeCalculAvecAide, leconDEcoute, leconDeLecture } from "../test_utils/lecons-de-test.ts";
import { ChoixInconnu, QuestionDejaReussie } from "./erreurs.ts";
import { type QuestionJouee, questionsJoueesDe } from "./question-jouee.ts";
import { Reponse } from "./reponse.ts";

function premiereQuestion(lecon: Lecon): QuestionJouee {
  return questionsJoueesDe(lecon.exercices[0], hasardSansMelange())[0];
}

Deno.test("une question d'écoute porte le mot à écouter et sa langue", () => {
  const question = premiereQuestion(leconDEcoute());

  assertEquals([question.motAEcouter, question.langue], ["cat", "en-GB"]);
});

Deno.test("une question qui n'est pas d'écoute n'a ni mot à écouter ni langue", () => {
  const question = premiereQuestion(leconDeCalcul());

  assertEquals([question.motAEcouter, question.langue], [undefined, undefined]);
});

Deno.test("une question qui a une aide la porte", () => {
  assertEquals(premiereQuestion(leconDeCalculAvecAide()).aide, "Compte sur tes doigts à partir de 4.");
});

Deno.test("une question sans aide n'en porte pas", () => {
  assertEquals(premiereQuestion(leconDeCalcul()).aide, undefined);
});

Deno.test("l'explication d'une question d'écoute dit le mot écouté et sa réponse", () => {
  assertEquals(premiereQuestion(leconDEcoute()).explication()?.texte, "« cat », c'est « chat ».");
});

Deno.test("l'explication d'une question d'écoute se lit en morceaux : le mot écouté dans sa langue, puis la réponse", () => {
  assertEquals(
    premiereQuestion(leconDEcoute()).explication()?.morceaux,
    [{ texte: "cat", langue: "en-GB" }, { texte: "c'est chat." }],
  );
});

Deno.test("une question qui n'est pas d'écoute n'a aucune explication", () => {
  assertEquals(premiereQuestion(leconDeLecture()).explication(), undefined);
});

Deno.test("l'aide après une erreur d'une question avec aide est son aide", () => {
  assertEquals(
    premiereQuestion(leconDeCalculAvecAide()).aideApresErreur(),
    "Compte sur tes doigts à partir de 4.",
  );
});

Deno.test("l'aide après une erreur d'une question sans aide invite à essayer une autre bulle", () => {
  assertEquals(premiereQuestion(leconDeCalcul()).aideApresErreur(), "Essaie une autre bulle.");
});

Deno.test("l'aide après une erreur d'une question d'écoute invite à écouter encore", () => {
  assertEquals(premiereQuestion(leconDEcoute()).aideApresErreur(), "Écoute encore.");
});

Deno.test("répondre à une question déjà réussie est refusé", () => {
  const question = premiereQuestion(leconDeCalcul());
  question.repondre(Reponse.choix("7"));

  assertThrows(() => question.repondre(Reponse.choix("6")), QuestionDejaReussie);
});

Deno.test("une réponse qui n'est pas parmi les choix proposés est refusée", () => {
  const question = premiereQuestion(leconDeCalcul());

  assertThrows(() => question.repondre(Reponse.choix("42")), ChoixInconnu);
});

Deno.test("une réponse hors des choix proposés ne compte aucune erreur", () => {
  const question = premiereQuestion(leconDeCalcul());

  assertThrows(() => question.repondre(Reponse.choix("42")), ChoixInconnu);
  assertEquals(question.erreurs, 0);
});
