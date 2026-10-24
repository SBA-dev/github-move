import { assertEquals, assertThrows } from "@std/assert";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { TestDeDepartDejaFini } from "./erreurs.ts";
import { type QuestionJouee, questionsJoueesDe } from "./question-jouee.ts";
import { Reponse } from "./reponse.ts";
import { TestDeDepart } from "./test-de-depart.ts";

function desQuestions(nombre: number): QuestionJouee[] {
  return questionsJoueesDe({
    type: "bulles",
    questions: Array.from({ length: nombre }, (_, i) => ({
      question: `Question ${i + 1} ?`,
      choix: ["bonne", "mauvaise"],
      reponse: "bonne",
    })),
  }, hasardSansMelange());
}

function testDeDepartDe(nombre: number): { test: TestDeDepart; questions: QuestionJouee[] } {
  const questions = desQuestions(nombre);
  const test = TestDeDepart.commencer({ generateurId: generateurIdFixe("test-1"), enfant: "lea", questions });
  return { test, questions };
}

const bonne = Reponse.choix("bonne");
const mauvaise = Reponse.choix("mauvaise");

Deno.test("un test de départ commencé porte l'identifiant fourni, l'enfant et pose la première question", () => {
  const { test, questions } = testDeDepartDe(3);

  assertEquals([test.id.valeur, test.enfant, test.questionEnCours()], ["test-1", "lea", questions[0]]);
});

Deno.test("une bonne réponse du premier coup rend la question juste et passe à la suivante", () => {
  const { test, questions } = testDeDepartDe(3);

  test.repondre(bonne);

  assertEquals([questions[0].erreurs, test.questionEnCours()], [0, questions[1]]);
});

Deno.test("une mauvaise réponse garde la même question posée pour une nouvelle chance", () => {
  const { test, questions } = testDeDepartDe(3);

  test.repondre(mauvaise);

  assertEquals([questions[0].erreurs, test.questionEnCours()], [1, questions[0]]);
});

Deno.test("la question n'est passée qu'avec la bonne réponse après une erreur", () => {
  const { test, questions } = testDeDepartDe(3);
  test.repondre(mauvaise);

  test.repondre(bonne);

  assertEquals(test.questionEnCours(), questions[1]);
});

Deno.test("« Je ne sais pas » garde la même question posée et reste permis à la question suivante", () => {
  const { test, questions } = testDeDepartDe(3);
  test.direJeNeSaisPas();
  test.repondre(bonne);

  assertEquals([questions[0].erreurs, test.questionEnCours()?.jeNeSaisPasPermis()], [1, true]);
});

Deno.test("plusieurs erreurs à une même question ne comptent que pour une question fausse", () => {
  const { test } = testDeDepartDe(4);
  test.repondre(mauvaise);
  test.repondre(mauvaise);
  test.repondre(mauvaise);
  test.repondre(bonne);

  assertEquals([test.estArrete(), test.estFini()], [false, false]);
});

Deno.test("trois questions fausses de suite arrêtent le test de départ", () => {
  const { test } = testDeDepartDe(5);
  test.repondre(mauvaise);
  test.repondre(bonne);
  test.direJeNeSaisPas();
  test.repondre(bonne);
  test.repondre(mauvaise);
  test.repondre(bonne);

  assertEquals([test.estArrete(), test.estFini(), test.questionEnCours()], [true, true, undefined]);
});

Deno.test("une question juste remet à zéro le compte des questions fausses de suite", () => {
  const { test } = testDeDepartDe(6);
  for (const reponse of [mauvaise, mauvaise]) {
    test.repondre(reponse);
    test.repondre(bonne);
  }
  test.repondre(bonne);
  test.repondre(mauvaise);
  test.repondre(bonne);

  assertEquals([test.estArrete(), test.estFini()], [false, false]);
});

Deno.test("un test de départ dont toutes les questions sont passées est fini sans être arrêté", () => {
  const { test } = testDeDepartDe(2);
  test.repondre(bonne);
  test.repondre(bonne);

  assertEquals([test.estFini(), test.estArrete(), test.questionEnCours()], [true, false, undefined]);
});

Deno.test("répondre à un test de départ fini lève TestDeDepartDejaFini", () => {
  const { test } = testDeDepartDe(1);
  test.repondre(bonne);

  assertThrows(() => test.repondre(bonne), TestDeDepartDejaFini);
});
