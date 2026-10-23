import { assertEquals, assertThrows } from "@std/assert";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import {
  leconDeCalcul,
  leconDeCalculAvecAide,
  leconDeCalculAvecAideVide,
  leconDEcoute,
  leconDEcouteAvecAide,
} from "../test_utils/lecons-de-test.ts";
import { JeNeSaisPasDejaDit, QuestionDejaReussie } from "./erreurs.ts";
import { type QuestionJouee, questionsJoueesDe } from "./question-jouee.ts";
import { Reponse } from "./reponse.ts";

function premiereQuestion(lecon: Lecon): QuestionJouee {
  return questionsJoueesDe(lecon.exercices[0], hasardSansMelange())[0];
}

Deno.test("« Je ne sais pas » est permis avec les choix", () => {
  assertEquals(premiereQuestion(leconDeCalcul()).jeNeSaisPasPermis(), true);
});

Deno.test("après « Je ne sais pas », la bonne réponse est montrée et il ne reste qu'elle parmi les choix", () => {
  const question = premiereQuestion(leconDeCalcul());

  question.direJeNeSaisPas();

  assertEquals(question.bonneReponseMontree, true);
  assertEquals(question.choix.possibles(), ["7"]);
});

Deno.test("une question dont on n'a pas montré la bonne réponse ne l'a pas montrée", () => {
  assertEquals(premiereQuestion(leconDeCalcul()).bonneReponseMontree, false);
});

Deno.test("« Je ne sais pas » coûte une erreur à une question qui n'en a pas encore coûté", () => {
  const question = premiereQuestion(leconDeCalcul());

  question.direJeNeSaisPas();

  assertEquals(question.erreurs, 1);
});

Deno.test("« Je ne sais pas » n'ajoute aucune erreur à une question qui en a déjà coûté une", () => {
  const question = premiereQuestion(leconDeCalcul());
  question.repondre(Reponse.choix("8"));

  question.direJeNeSaisPas();

  assertEquals(question.erreurs, 1);
});

Deno.test("« Je ne sais pas » n'ajoute aucune erreur à une question qui en a déjà coûté deux", () => {
  const question = premiereQuestion(leconDeCalcul());
  question.repondre(Reponse.choix("8"));
  question.repondre(Reponse.choix("9"));

  question.direJeNeSaisPas();

  assertEquals(question.erreurs, 2);
});

Deno.test("« Je ne sais pas » ne se dit qu'une fois par question", () => {
  const question = premiereQuestion(leconDeCalcul());
  question.direJeNeSaisPas();

  assertThrows(() => question.direJeNeSaisPas(), JeNeSaisPasDejaDit);
});

Deno.test("« Je ne sais pas » est refusé sur une question réussie", () => {
  const question = premiereQuestion(leconDeCalcul());
  question.repondre(Reponse.choix("7"));

  assertThrows(() => question.direJeNeSaisPas(), QuestionDejaReussie);
});

Deno.test("après « Je ne sais pas », la question reste ouverte", () => {
  const question = premiereQuestion(leconDeCalcul());

  question.direJeNeSaisPas();

  assertEquals(question.reussie, false);
});

Deno.test("après « Je ne sais pas », la bonne réponse donnée par l'enfant réussit la question sans erreur de plus", () => {
  const question = premiereQuestion(leconDeCalcul());
  question.direJeNeSaisPas();

  const resultat = question.repondre(Reponse.choix("7"));

  assertEquals(resultat, "juste");
  assertEquals(question.reussie, true);
  assertEquals(question.erreurs, 1);
});

Deno.test("après « Je ne sais pas », toucher un choix écarté ne compte aucune erreur", () => {
  const question = premiereQuestion(leconDeCalcul());
  question.direJeNeSaisPas();

  const resultat = question.repondre(Reponse.choix("8"));

  assertEquals(resultat, "dejaEcartee");
  assertEquals(question.erreurs, 1);
});

Deno.test("« Je ne sais pas » donne l'aide de la question, avec la bonne réponse qui brille", () => {
  const question = premiereQuestion(leconDeCalculAvecAide());

  const aideDonnee = question.direJeNeSaisPas();

  assertEquals(aideDonnee, {
    aide: "Compte sur tes doigts à partir de 4.",
    bonneReponse: "7",
    maniere: "briller",
  });
});

Deno.test("« Je ne sais pas » sans aide de la question ne donne aucune aide", () => {
  const question = premiereQuestion(leconDeCalcul());

  assertEquals(question.direJeNeSaisPas().aide, undefined);
});

Deno.test("l'aide après une erreur d'une aide vide n'est pas lue : l'aide par défaut du type la remplace", () => {
  assertEquals(premiereQuestion(leconDeCalculAvecAideVide()).aideApresErreur(), "Essaie une autre bulle.");
});

Deno.test("« Je ne sais pas » d'une aide vide ne donne aucune aide", () => {
  assertEquals(premiereQuestion(leconDeCalculAvecAideVide()).direJeNeSaisPas().aide, undefined);
});

Deno.test("« Je ne sais pas » d'une question d'écoute donne l'aide de l'item", () => {
  const question = premiereQuestion(leconDEcouteAvecAide());

  assertEquals(question.direJeNeSaisPas().aide, "Pense à l'animal qui miaule.");
});

Deno.test("après une erreur, l'aide de la question d'écoute passe avant l'aide par défaut", () => {
  assertEquals(premiereQuestion(leconDEcouteAvecAide()).aideApresErreur(), "Pense à l'animal qui miaule.");
});

Deno.test("sans aide, une question d'écoute garde « Écoute encore. » après une erreur", () => {
  assertEquals(premiereQuestion(leconDEcoute()).aideApresErreur(), "Écoute encore.");
});

Deno.test("« Je ne sais pas » est permis avec une question d'écoute, et il ne reste que la bonne réponse", () => {
  const question = premiereQuestion(leconDEcoute());

  question.direJeNeSaisPas();

  assertEquals(question.choix.possibles(), ["chat"]);
});
