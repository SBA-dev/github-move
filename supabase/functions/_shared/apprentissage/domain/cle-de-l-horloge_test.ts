import { assert, assertEquals, assertNotEquals } from "@std/assert";
import { Niveau } from "../../catalogue/domain/index.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { exerciceDHorloge } from "../test_utils/lecons-d-horloge.ts";
import { CleDeQuestion } from "./cle-de-question.ts";
import { cleDeLHorloge } from "./cles-des-questions.ts";
import { QuestionDHorloge } from "./question-d-horloge.ts";
import { tireurAuHasard } from "./tireur.ts";

const exercice = exerciceDHorloge("CE1", { mode: "lire", items: [{ heure: "2:15" }, { heure: "9:45" }] });
const [deuxHeuresQuinze, neufHeuresQuarante5] = exercice.items;

Deno.test("la clé d'une question d'horloge a son propre préfixe, différent de celui de tous les autres types", () => {
  const autres = [
    CleDeQuestion.de("bulles", "x"),
    CleDeQuestion.de("lecture", "x"),
    CleDeQuestion.de("ecoute", "x"),
    CleDeQuestion.de("trous", "x"),
    CleDeQuestion.de("conjugaison", "x"),
    CleDeQuestion.de("classer", "x"),
    CleDeQuestion.de("ordre", "x"),
    CleDeQuestion.de("chiffre", "x"),
    CleDeQuestion.de("calcul", "x"),
    CleDeQuestion.de("barres", "x"),
    CleDeQuestion.de("colonne", "x"),
    CleDeQuestion.de("fluence", "x"),
    CleDeQuestion.de("dictee", "x"),
  ].map((cle) => cle.valeur.replace(/x$/, ""));

  const prefixe = CleDeQuestion.de("horloge", "x").valeur.replace(/x$/, "");

  assert(prefixe.length > 0);
  assertEquals(autres.includes(prefixe), false);
});

Deno.test("la clé d'une question d'horloge contient le mode", () => {
  assert(cleDeLHorloge("lire", deuxHeuresQuinze!).valeur.includes("lire"));
});

Deno.test("lire 2 h 15 et placer 2 h 15 sont deux questions de révision différentes", () => {
  assertNotEquals(cleDeLHorloge("lire", deuxHeuresQuinze!), cleDeLHorloge("placer", deuxHeuresQuinze!));
});

Deno.test("deux heures différentes ont deux clés différentes dans le même mode", () => {
  assertNotEquals(cleDeLHorloge("lire", deuxHeuresQuinze!), cleDeLHorloge("lire", neufHeuresQuarante5!));
});

Deno.test("la clé d'une question d'horloge sérialisée redevient la clé d'origine", () => {
  const cle = cleDeLHorloge("lire", deuxHeuresQuinze!);

  assertEquals(CleDeQuestion.depuisLaValeur(cle.valeur), cle);
});

Deno.test("la question d'horloge posée porte la clé de son mode et de son heure", () => {
  const tireur = tireurAuHasard(hasardSansMelange());

  const question = QuestionDHorloge.pour(exercice, deuxHeuresQuinze!, tireur, Niveau.de("CE1"));

  assertEquals(question.cle, cleDeLHorloge("lire", deuxHeuresQuinze!));
});
