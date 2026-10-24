import { assertEquals } from "@std/assert";
import type { Lecon } from "../../../catalogue/domain/index.ts";
import { hasardSansMelange } from "../../test_utils/hasard-fixe.ts";
import { seanceCommencee } from "../../test_utils/lecons-de-classer-et-ordre.ts";
import {
  leconDeConjugaisonAvecBeaucoupDeCandidats,
  leconDeConjugaisonAvecUneFormeRepetee,
  leconDeConjugaisonDuVerbeAvoirAvecUneApostropheDroite,
  leconDeConjugaisonDuVerbeAvoirAvecUneApostropheTypographique,
  leconDeConjugaisonDuVerbeEtre,
} from "../../test_utils/lecons-de-conjugaison.ts";
import { CleDeQuestion } from "../cle-de-question.ts";
import type { Hasard } from "../hasard.ts";
import { type QuestionJouee, questionsJoueesDe } from "../question-jouee.ts";
import { Reponse } from "../reponse.ts";

function questionsDe(lecon: Lecon, hasard: Hasard = hasardSansMelange()): QuestionJouee[] {
  return questionsJoueesDe(lecon.exercices[0], hasard);
}

Deno.test("une conjugaison pose une question par personne, dans l'ordre du tableau", () => {
  const questions = questionsDe(leconDeConjugaisonDuVerbeEtre());

  assertEquals(questions.map((question) => question.enonce), [
    "je … ?",
    "tu … ?",
    "il … ?",
    "nous … ?",
    "vous … ?",
    "ils … ?",
  ]);
});

Deno.test("la clé d'une question de conjugaison dit le verbe, le temps et le pronom", () => {
  const [premiere] = questionsDe(leconDeConjugaisonDuVerbeEtre());

  assertEquals(premiere.cle, CleDeQuestion.de("conjugaison", "être · présent · je"));
  assertEquals(premiere.cle.valeur, "c:etre · present · je");
});

Deno.test("une personne propose sa forme et deux autres formes toutes différentes", () => {
  const [premiere] = questionsDe(leconDeConjugaisonAvecBeaucoupDeCandidats());
  const choix = premiere.choix.textes();

  assertEquals(choix.length, 3);
  assertEquals(new Set(choix).size, 3);
  assertEquals(choix.includes("suis"), true);
});

Deno.test("les autres formes viennent des autres personnes et des distracteurs", () => {
  const permises = ["suis", "es", "est", "sommes", "étais", "serai", "sois"];

  for (const question of questionsDe(leconDeConjugaisonAvecBeaucoupDeCandidats())) {
    assertEquals(question.choix.textes().every((texte) => permises.includes(texte)), true);
  }
});

Deno.test("la forme d'une autre personne identique à la forme attendue n'est pas proposée deux fois", () => {
  const [premiere] = questionsDe(leconDeConjugaisonAvecUneFormeRepetee());

  assertEquals([...premiere.choix.textes()].sort(), ["chante", "chantes"]);
});

Deno.test("avec une seule autre forme possible, elle est proposée avec la forme attendue", () => {
  const questions = questionsDe(leconDeConjugaisonAvecUneFormeRepetee());

  assertEquals(questions.map((question) => question.choix.textes().length), [2, 2, 2]);
});

Deno.test("les choix d'une personne sont mélangés une seule fois, au début de la séance", () => {
  const sansMelange = questionsDe(leconDeConjugaisonAvecBeaucoupDeCandidats(), hasardSansMelange())[0];
  const melange = questionsDe(leconDeConjugaisonAvecBeaucoupDeCandidats(), { entre0et1: () => 0 })[0];

  assertEquals(melange.choix.textes().join() === sansMelange.choix.textes().join(), false);
  assertEquals(melange.tirage(), melange.choix.textes());
});

Deno.test("les deux autres formes sont tirées par le hasard parmi les candidats", () => {
  const avecUnHasard = questionsDe(leconDeConjugaisonAvecBeaucoupDeCandidats(), hasardSansMelange())[0];
  const avecUnAutreHasard = questionsDe(leconDeConjugaisonAvecBeaucoupDeCandidats(), { entre0et1: () => 0 })[0];

  assertEquals(
    [...avecUnHasard.choix.textes()].sort().join() === [...avecUnAutreHasard.choix.textes()].sort().join(),
    false,
  );
});

Deno.test("une mauvaise forme est écartée, et l'aide rappelle le pronom", () => {
  const [premiere] = questionsDe(leconDeConjugaisonDuVerbeEtre());
  const mauvaiseForme = premiere.choix.textes().find((texte) => texte !== "suis") ?? "";

  const resultat = premiere.repondre(Reponse.choix(mauvaiseForme));

  assertEquals([resultat, premiere.choix.ecartes(), premiere.aideApresErreur()], [
    "fausse",
    [mauvaiseForme],
    "Avec « je », quelle forme va ?",
  ]);
});

Deno.test("après deux erreurs, il ne reste que la forme attendue", () => {
  const [premiere] = questionsDe(leconDeConjugaisonDuVerbeEtre());
  const mauvaisesFormes = premiere.choix.textes().filter((texte) => texte !== "suis");

  for (const forme of mauvaisesFormes) premiere.repondre(Reponse.choix(forme));

  assertEquals(premiere.choix.possibles(), ["suis"]);
});

Deno.test("« Je ne sais pas » fait briller la bonne forme et coûte une erreur", () => {
  const [premiere] = questionsDe(leconDeConjugaisonDuVerbeEtre());

  const aide = premiere.direJeNeSaisPas();

  assertEquals([aide.bonneReponse, aide.maniere, premiere.choix.possibles(), premiere.erreurs], [
    "suis",
    "briller",
    ["suis"],
    1,
  ]);
});

Deno.test("le tableau montre les pronoms, les formes déjà trouvées et la personne en cours", () => {
  const seance = seanceCommencee(leconDeConjugaisonDuVerbeEtre());
  const exercice = seance.exerciceEnCours();

  seance.repondre(Reponse.choix("suis"));

  assertEquals(exercice?.tableauDeConjugaison(), [
    { pronom: "je", forme: "suis", texte: "je suis" },
    { pronom: "tu", forme: undefined, texte: "tu …" },
    { pronom: "il", forme: undefined, texte: "il …" },
    { pronom: "nous", forme: undefined, texte: "nous …" },
    { pronom: "vous", forme: undefined, texte: "vous …" },
    { pronom: "ils", forme: undefined, texte: "ils …" },
  ]);
  assertEquals(exercice?.rangDeLaQuestionEnCours, 1);
});

function textesDuTableau(lecon: Lecon): (string | undefined)[] {
  const exercice = seanceCommencee(lecon).exerciceEnCours();
  return exercice?.tableauDeConjugaison().map((ligne) => ligne.texte) ?? [];
}

Deno.test("le tableau écrit un pronom élidé collé à sa forme, avec l'apostrophe droite", () => {
  const seance = seanceCommencee(leconDeConjugaisonDuVerbeAvoirAvecUneApostropheDroite());
  const exercice = seance.exerciceEnCours();

  seance.repondre(Reponse.choix("ai"));

  assertEquals(exercice?.tableauDeConjugaison().map((ligne) => ligne.texte), ["j'ai", "tu …"]);
});

Deno.test("le tableau écrit un pronom élidé collé à sa forme, avec l'apostrophe typographique", () => {
  const seance = seanceCommencee(leconDeConjugaisonDuVerbeAvoirAvecUneApostropheTypographique());
  const exercice = seance.exerciceEnCours();

  seance.repondre(Reponse.choix("ai"));

  assertEquals(exercice?.tableauDeConjugaison().map((ligne) => ligne.texte), ["j’ai", "tu …"]);
});

Deno.test("le tableau écrit un pronom élidé collé aux points de suspension tant que la forme n'est pas trouvée", () => {
  assertEquals(textesDuTableau(leconDeConjugaisonDuVerbeAvoirAvecUneApostropheDroite()), ["j'…", "tu …"]);
});
