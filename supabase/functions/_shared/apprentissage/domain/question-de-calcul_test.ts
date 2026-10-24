import { assertEquals } from "@std/assert";
import { aideApresUneErreurDeCalcul } from "./astuce-de-l-operation.ts";
import { QuestionDeCalcul } from "./question-de-calcul.ts";
import { Reponse } from "./reponse.ts";
import { tireurSelonLesTirages } from "./tireur.ts";

const operation = { q: "12 − 5", r: 7 };

Deno.test("au clavier de cristaux, un nombre égal au résultat réussit la question", () => {
  const question = QuestionDeCalcul.auClavier(operation);

  const resultat = question.repondre(Reponse.nombre(7));

  assertEquals(resultat, "juste");
  assertEquals(question.reussie, true);
  assertEquals(question.erreurs, 0);
});

Deno.test("au clavier de cristaux, chaque nombre faux coûte une erreur et la question reste posée sans limite", () => {
  const question = QuestionDeCalcul.auClavier(operation);

  const resultats = [3, 4, 5, 6, 8].map((n) => question.repondre(Reponse.nombre(n)));

  assertEquals(resultats, ["fausse", "fausse", "fausse", "fausse", "fausse"]);
  assertEquals(question.erreurs, 5);
  assertEquals(question.reussie, false);
  assertEquals(question.repondre(Reponse.nombre(7)), "juste");
});

Deno.test("au clavier de cristaux, l'aide après une erreur est l'astuce de l'opération", () => {
  const question = QuestionDeCalcul.auClavier(operation);

  assertEquals(question.aideApresErreur(), aideApresUneErreurDeCalcul(operation));
});

Deno.test("au clavier de cristaux, « Je ne sais pas » coûte une erreur, donne l'aide et la bonne réponse", () => {
  const question = QuestionDeCalcul.auClavier(operation);

  const aide = question.direJeNeSaisPas();

  assertEquals(aide.aide, aideApresUneErreurDeCalcul(operation));
  assertEquals(aide.bonneReponse, "7");
  assertEquals(question.erreurs, 1);
  assertEquals(question.bonneReponseMontree, true);
});

Deno.test("au clavier de cristaux, « Je ne sais pas » ne coûte pas de seconde erreur après une faute", () => {
  const question = QuestionDeCalcul.auClavier(operation);
  question.repondre(Reponse.nombre(3));

  question.direJeNeSaisPas();

  assertEquals(question.erreurs, 1);
});

Deno.test("après « Je ne sais pas » au clavier de cristaux, une faute de frappe ne coûte pas d'erreur", () => {
  const question = QuestionDeCalcul.auClavier(operation);
  question.direJeNeSaisPas();

  const resultat = question.repondre(Reponse.nombre(70));

  assertEquals(resultat, "fausse");
  assertEquals(question.erreurs, 1);
  assertEquals(question.reussie, false);
});

Deno.test("au clavier de cristaux, les réponses données sont gardées pour la revalidation", () => {
  const question = QuestionDeCalcul.auClavier(operation);

  question.repondre(Reponse.nombre(3));
  question.direJeNeSaisPas();
  question.repondre(Reponse.nombre(7));

  assertEquals(question.reponses(), [
    { genre: "nombre", valeur: 3 },
    { genre: "jeNeSaisPas" },
    { genre: "nombre", valeur: 7 },
  ]);
});

Deno.test("une question de calcul se suit comme une question de type calcul, clé n: et énoncé", () => {
  const question = QuestionDeCalcul.auClavier({ q: "12 − 5", r: 7 });

  assertEquals(question.type, "calcul");
  assertEquals(question.cle.valeur, "n:12 − 5");
});

Deno.test("avec les choix au CP, les choix sont ceux autour du résultat, en texte, et l'aide est l'astuce de l'opération", () => {
  const tireur = tireurSelonLesTirages([["8", "6", "7", "9"]][Symbol.iterator]());
  const question = QuestionDeCalcul.avecLesChoix(operation, tireur);

  const resultat = question.repondre(Reponse.choix("8"));

  assertEquals([...question.tirage()].sort(), ["6", "7", "8", "9"]);
  assertEquals(resultat, "fausse");
  assertEquals(question.aideApresErreur(), aideApresUneErreurDeCalcul(operation));
});
