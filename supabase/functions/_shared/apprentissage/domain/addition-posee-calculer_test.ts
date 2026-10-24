import { assertEquals } from "@std/assert";
import { Niveau } from "../../catalogue/domain/index.ts";
import { AdditionPosee } from "./addition-posee.ts";
import { ModeDeReponse } from "./mode-de-reponse.ts";
import { Reponse } from "./reponse.ts";
import { tireurSelonLesTirages } from "./tireur.ts";

const auClavier = ModeDeReponse.pour(Niveau.de("CE1"));
const sansTirage = tireurSelonLesTirages([][Symbol.iterator]());

Deno.test("au CP, la colonne des unités de 45 + 37 propose 12, 13, 11 et 2 à choisir", () => {
  const tireur = tireurSelonLesTirages([["12", "13", "11", "2"]][Symbol.iterator]());
  const calcul = AdditionPosee.depuis([45, 37]).etapeCalculer(ModeDeReponse.pour(Niveau.de("CP")), tireur);

  assertEquals(calcul.colonneEnCours.rang, "unites");
  assertEquals(calcul.questionEnCours.tirage(), ["12", "13", "11", "2"]);
  assertEquals(calcul.repondre(Reponse.choix("12")), "juste");
});

Deno.test("12 dans la colonne des unités : on écrit 2 sous la colonne, 1 monte en retenue et la colonne des dizaines s'ouvre", () => {
  const calcul = AdditionPosee.depuis([45, 37]).etapeCalculer(auClavier, sansTirage);

  const resultat = calcul.repondre(Reponse.nombre(12));

  assertEquals(resultat, "juste");
  assertEquals(calcul.resultatEcrit, "2");
  assertEquals(calcul.retenues, { dizaines: 1 });
  assertEquals(calcul.colonneEnCours.rang, "dizaines");
  assertEquals(
    calcul.paroleApresLaDerniereReponse,
    "12, c'est 1 dizaine et 2 unités ! J'écris 2, et 1 monte en retenue.",
  );
});

Deno.test("11 dans la colonne des dizaines : la phrase parle de centaine et de dizaine, au singulier", () => {
  const calcul = AdditionPosee.depuis([45, 65]).etapeCalculer(auClavier, sansTirage);
  calcul.repondre(Reponse.nombre(10));

  calcul.repondre(Reponse.nombre(11));

  assertEquals(
    calcul.paroleApresLaDerniereReponse,
    "11, c'est 1 centaine et 1 dizaine ! J'écris 1, et 1 monte en retenue.",
  );
  assertEquals(calcul.retenues, { dizaines: 1, centaines: 1 });
});

Deno.test("la dernière colonne écrit toute sa somme : 45 + 37 donne 82 et se termine par « 45 + 37 = 82. »", () => {
  const calcul = AdditionPosee.depuis([45, 37]).etapeCalculer(auClavier, sansTirage);
  calcul.repondre(Reponse.nombre(12));

  const resultat = calcul.repondre(Reponse.nombre(8));

  assertEquals(resultat, "juste");
  assertEquals(calcul.resultatEcrit, "82");
  assertEquals(calcul.terminee, true);
  assertEquals(calcul.paroleApresLaDerniereReponse, "45 + 37 = 82.");
  assertEquals(calcul.erreurs, 0);
});

Deno.test("oublier la retenue coûte une erreur et l'aide rappelle la retenue en haut de la maison", () => {
  const calcul = AdditionPosee.depuis([45, 37]).etapeCalculer(auClavier, sansTirage);
  calcul.repondre(Reponse.nombre(12));

  const resultat = calcul.repondre(Reponse.nombre(7));

  assertEquals(resultat, "fausse");
  assertEquals(calcul.erreurs, 1);
  assertEquals(calcul.aideApresLaDerniereErreur(), "Tu as oublié la retenue, tout en haut de la maison !");
  assertEquals(calcul.colonneEnCours.rang, "dizaines");
});

Deno.test("une autre réponse fausse coûte une erreur et l'aide redonne l'expression de la colonne, retenue comprise", () => {
  const calcul = AdditionPosee.depuis([45, 37]).etapeCalculer(auClavier, sansTirage);
  calcul.repondre(Reponse.nombre(12));

  calcul.repondre(Reponse.nombre(5));

  assertEquals(calcul.erreurs, 1);
  assertEquals(calcul.aideApresLaDerniereErreur(), "Compte doucement : 1 + 4 + 3.");
});
