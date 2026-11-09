import { assert, assertEquals, assertFalse, assertThrows } from "@std/assert";
import { HeureDeLHorloge, Niveau } from "../../catalogue/domain/index.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { exerciceDHorloge } from "../test_utils/lecons-d-horloge.ts";
import { heureDite } from "./heure-dite.ts";
import { HeureEcriteImpossible } from "./erreurs.ts";
import { QuestionDHorloge } from "./question-d-horloge.ts";
import { questionsDHorloge } from "./questions-de-l-exercice.ts";
import { Reponse } from "./reponse.ts";
import { tireurAuHasard } from "./tireur.ts";

const tireur = tireurAuHasard(hasardSansMelange());
const AIDE_PAR_DEFAUT = "La petite aiguille montre les heures, la grande les minutes.";

const exerciceAuCP = () => exerciceDHorloge("CP", { mode: "lire", items: [{ heure: "3:00" }, { heure: "7:00" }] });
const exerciceAuCE1 = (items: Record<string, unknown>[] = [{ heure: "2:15" }]) =>
  exerciceDHorloge("CE1", { mode: "lire", items });

function questionAuCP(): QuestionDHorloge {
  const exercice = exerciceAuCP();
  return QuestionDHorloge.pour(exercice, exercice.items[0]!, tireur, Niveau.de("CP"));
}

function questionAuCE1(items?: Record<string, unknown>[]): QuestionDHorloge {
  const exercice = exerciceAuCE1(items);
  return QuestionDHorloge.pour(exercice, exercice.items[0]!, tireur, Niveau.de("CE1"));
}

Deno.test("un exercice horloge en mode lire donne une question par item", () => {
  const questions = questionsDHorloge(exerciceAuCP(), tireur, Niveau.de("CP"));

  assertEquals(questions.length, 2);
});

Deno.test("au CP, la réponse se donne par choix parmi trois heures", () => {
  const { mode } = questionAuCP().enCours();

  assertEquals(mode.genre, "choix");
  assertEquals(mode.genre === "choix" && mode.choix.length, 3);
});

Deno.test("au CP, les choix écrivent les heures et contiennent la bonne", () => {
  const { mode } = questionAuCP().enCours();

  assert(mode.genre === "choix" && mode.choix.includes("3 h"));
});

Deno.test("à partir du CE1, la réponse se donne au clavier de cristaux, en heures et minutes", () => {
  const { mode } = questionAuCE1().enCours();

  assertEquals(mode, { genre: "clavierDeCristaux", champs: ["heures", "minutes"] });
});

Deno.test("au CM2, à la précision seconde, le clavier de cristaux demande aussi les secondes", () => {
  const exercice = exerciceDHorloge("CM2", { mode: "lire", precision: "seconde", items: [{ heure: "6:18:20" }] });

  const { mode } = QuestionDHorloge.pour(exercice, exercice.items[0]!, tireur, Niveau.de("CM2")).enCours();

  assertEquals(mode, { genre: "clavierDeCristaux", champs: ["heures", "minutes", "secondes"] });
});

Deno.test("sans consigne dans l'exercice, la consigne affichée est « Quelle heure est-il ? »", () => {
  assertEquals(questionAuCP().texteAffiche(), "Quelle heure est-il ?");
});

Deno.test("la consigne de l'exercice remplace la consigne par défaut", () => {
  const exercice = exerciceDHorloge("CE1", {
    mode: "lire",
    consigne: "Lis l'heure sur l'horloge.",
    items: [{ heure: "2:15" }],
  });

  const question = QuestionDHorloge.pour(exercice, exercice.items[0]!, tireur, Niveau.de("CE1"));

  assertEquals(question.texteAffiche(), "Lis l'heure sur l'horloge.");
});

Deno.test("le texte lu à voix haute ne dit jamais l'heure montrée", () => {
  const dit = questionAuCE1([{ heure: "2:15" }]).texteDit();

  assertFalse(dit.includes(heureDite(HeureDeLHorloge.lire("2:15"), Niveau.de("CE1"))));
  assertFalse(dit.includes("2 h"));
  assertFalse(dit.includes("14 h"));
});

Deno.test("au CP, le choix de la bonne heure réussit la question", () => {
  const question = questionAuCP();

  const resultat = question.repondre(Reponse.choix("3 h"));

  assertEquals([resultat, question.reussie, question.erreurs], ["juste", true, 0]);
});

Deno.test("au CP, le choix d'une autre heure coûte une erreur et la question reste posée", () => {
  const question = questionAuCP();
  const autre = question.enCours().mode;
  const fausse = autre.genre === "choix" ? autre.choix.find((texte) => texte !== "3 h") : undefined;

  const resultat = question.repondre(Reponse.choix(fausse as string));

  assertEquals([resultat, question.reussie, question.erreurs], ["fausse", false, 1]);
});

Deno.test("une heure écrite égale sur le cadran est juste : « 14 h 15 » pour 2 h 15 sans moment", () => {
  const question = questionAuCE1([{ heure: "2:15" }]);

  const resultat = question.repondre(Reponse.heureEcrite(14, 15));

  assertEquals([resultat, question.reussie], ["juste", true]);
});

Deno.test("une heure écrite différente sur le cadran est fausse et coûte une erreur", () => {
  const question = questionAuCE1([{ heure: "2:15" }]);

  const resultat = question.repondre(Reponse.heureEcrite(2, 30));

  assertEquals([resultat, question.reussie, question.erreurs], ["fausse", false, 1]);
});

Deno.test("avec le moment « apres-midi », l'heure écrite du matin est fausse", () => {
  const question = questionAuCE1([{ heure: "14:15", moment: "apres-midi" }]);

  const resultat = question.repondre(Reponse.heureEcrite(2, 15));

  assertEquals([resultat, question.erreurs], ["fausse", 1]);
});

Deno.test("avec le moment « apres-midi », l'heure écrite de l'après-midi est juste", () => {
  const question = questionAuCE1([{ heure: "14:15", moment: "apres-midi" }]);

  assertEquals(question.repondre(Reponse.heureEcrite(14, 15)), "juste");
});

Deno.test("une heure écrite impossible n'est pas une réponse et ne coûte aucune erreur", () => {
  const question = questionAuCE1();

  assertThrows(() => question.repondre(Reponse.heureEcrite(2, 75)), HeureEcriteImpossible);
  assertEquals(question.erreurs, 0);
});

Deno.test("après une erreur, l'aide est celle de l'item", () => {
  const question = questionAuCE1([{ heure: "2:15", aide: "La grande aiguille est sur le 3 : c'est le quart." }]);

  assertEquals(question.aideApresErreur(), "La grande aiguille est sur le 3 : c'est le quart.");
});

Deno.test("après une erreur, sans aide dans l'item, l'aide par défaut est lue", () => {
  assertEquals(questionAuCE1().aideApresErreur(), AIDE_PAR_DEFAUT);
});

Deno.test("au clavier de cristaux, les heures écrites sont gardées pour la revalidation", () => {
  const question = questionAuCE1([{ heure: "2:15" }]);

  question.repondre(Reponse.heureEcrite(2, 30));
  question.repondre(Reponse.heureEcrite(2, 15));

  assertEquals(question.reponses(), [Reponse.heureEcrite(2, 30), Reponse.heureEcrite(2, 15)]);
});
