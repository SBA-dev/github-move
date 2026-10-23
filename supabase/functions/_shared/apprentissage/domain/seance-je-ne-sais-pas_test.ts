import { assertEquals, assertThrows } from "@std/assert";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { leconDeCalcul, leconDeDeuxExercicesCourts } from "../test_utils/lecons-de-test.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { PasDeQuestionEnCours } from "./erreurs.ts";
import { Reponse } from "./reponse.ts";
import { Seance } from "./seance.ts";

function commencerSansLesEtapesDeLecon(lecon: Lecon): Seance {
  const seance = commencer(lecon);
  while (seance.etapeDeLeconEnCours()) seance.continuer();
  return seance;
}

function commencer(lecon: Lecon): Seance {
  return Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-lea",
    lecon,
    ChoixDeSeance.complete(),
  );
}

function questionEnCours(seance: Seance) {
  const question = seance.exerciceEnCours()?.questionEnCours();
  if (!question) throw new Error("Aucune question en cours");
  return question;
}

Deno.test("« Je ne sais pas » en séance montre la bonne réponse de la question en cours", () => {
  const seance = commencerSansLesEtapesDeLecon(leconDeCalcul());

  seance.direJeNeSaisPas();

  assertEquals(questionEnCours(seance).choix.possibles(), ["7"]);
});

Deno.test("« Je ne sais pas » en séance coûte une erreur à la question en cours", () => {
  const seance = commencerSansLesEtapesDeLecon(leconDeCalcul());

  seance.direJeNeSaisPas();

  assertEquals(questionEnCours(seance).erreurs, 1);
});

Deno.test("« Je ne sais pas » en séance ne fait pas avancer la séance", () => {
  const seance = commencerSansLesEtapesDeLecon(leconDeDeuxExercicesCourts());

  seance.direJeNeSaisPas();

  assertEquals(questionEnCours(seance).enonce, "Combien font 1 + 1 ?");
  assertEquals(seance.avancement().questionsReussies, 0);
});

Deno.test("« Je ne sais pas » en séance rend l'aide donnée", () => {
  const seance = commencerSansLesEtapesDeLecon(leconDeCalcul());

  assertEquals(seance.direJeNeSaisPas(), { aide: undefined, bonneReponse: "7", maniere: "briller" });
});

Deno.test("« Je ne sais pas » avant la fin des étapes de leçon n'a pas de question en cours", () => {
  const seance = commencer(leconDeDeuxExercicesCourts());

  assertThrows(() => seance.direJeNeSaisPas(), PasDeQuestionEnCours);
});

Deno.test("une question qui a coûté « Je ne sais pas » est gardée comme question ratée, une seule fois", () => {
  const seance = commencerSansLesEtapesDeLecon(leconDeCalcul());
  seance.direJeNeSaisPas();
  seance.repondre(Reponse.choix("7"));

  assertEquals(seance.clesDesQuestionsRatees().map((cle) => cle.valeur), ["b:combien font 3 + 4 ?7"]);
});

Deno.test("une question qui a coûté une erreur puis « Je ne sais pas » est gardée comme ratée avec une seule erreur", () => {
  const seance = commencerSansLesEtapesDeLecon(leconDeCalcul());
  seance.repondre(Reponse.choix("8"));

  seance.direJeNeSaisPas();

  assertEquals(questionEnCours(seance).erreurs, 1);
  assertEquals(seance.clesDesQuestionsRatees().length, 1);
});
