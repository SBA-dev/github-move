import { assertEquals } from "@std/assert";
import { AdditionPosee } from "./addition-posee.ts";
import { Reponse } from "./reponse.ts";

Deno.test("un chiffre posé dans la colonne de son rang y reste", () => {
  const poser = AdditionPosee.depuis([45, 37]).etapePoser();

  const resultat = poser.placer(Reponse.placement("4", "dizaines"));

  assertEquals(resultat, "juste");
  assertEquals(poser.chiffresAPoser(), ["5"]);
  assertEquals(poser.erreurs, 0);
});

Deno.test("un chiffre posé dans la mauvaise colonne revient parmi les chiffres à poser, avec une erreur et une aide", () => {
  const poser = AdditionPosee.depuis([45, 37]).etapePoser();

  const resultat = poser.placer(Reponse.placement("4", "unites"));

  assertEquals(resultat, "fausse");
  assertEquals(poser.chiffresAPoser(), ["4", "5"]);
  assertEquals(poser.erreurs, 1);
  assertEquals(
    poser.aideApresLaDerniereErreur(),
    "Dans 45, le 4 est le chiffre des dizaines : il va dans la maison rose.",
  );
});

Deno.test("l'aide d'un nombre d'un seul chiffre dit qu'il est tout seul", () => {
  const poser = AdditionPosee.depuis([8, 5]).etapePoser();

  poser.placer(Reponse.placement("8", "dizaines"));

  assertEquals(
    poser.aideApresLaDerniereErreur(),
    "Le 8 est tout seul : c'est un chiffre des unités. Il va dans la maison bleue, tout à droite.",
  );
});

Deno.test("avec un chiffre en double, l'aide vise la colonne encore libre", () => {
  const poser = AdditionPosee.depuis([55, 3]).etapePoser();
  poser.placer(Reponse.placement("5", "unites"));

  const resultat = poser.placer(Reponse.placement("5", "unites"));

  assertEquals(resultat, "fausse");
  assertEquals(
    poser.aideApresLaDerniereErreur(),
    "Dans 55, le 5 est le chiffre des dizaines : il va dans la maison rose.",
  );
});

Deno.test("« Je ne sais pas » fait briller la bonne colonne du chiffre choisi, compte une erreur et laisse le chiffre à poser", () => {
  const poser = AdditionPosee.depuis([45, 37]).etapePoser();

  const aide = poser.direJeNeSaisPas("4");

  assertEquals(aide.bonneReponse, "dizaines");
  assertEquals(aide.maniere, "briller");
  assertEquals(poser.erreurs, 1);
  assertEquals(poser.chiffresAPoser(), ["4", "5"]);
});

Deno.test("on passe au nombre suivant quand tous les chiffres du nombre sont posés", () => {
  const poser = AdditionPosee.depuis([45, 37]).etapePoser();
  assertEquals(poser.nombreCourant, 45);

  poser.placer(Reponse.placement("4", "dizaines"));
  poser.placer(Reponse.placement("5", "unites"));

  assertEquals(poser.nombreCourant, 37);
  assertEquals(poser.chiffresAPoser(), ["3", "7"]);
});
