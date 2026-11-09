import { assertEquals } from "@std/assert";
import { Niveau } from "../../catalogue/domain/index.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { exerciceDHorloge } from "../test_utils/lecons-d-horloge.ts";
import { ExerciceJoue } from "./exercice-joue.ts";
import { tireurAuHasard } from "./tireur.ts";

const tireur = tireurAuHasard(hasardSansMelange());

Deno.test("un exercice horloge en mode lire donne une question par heure", () => {
  const exercice = exerciceDHorloge("CE1", { mode: "lire", items: [{ heure: "2:15" }, { heure: "9:45" }] });

  const joue = ExerciceJoue.depuis(0, exercice, tireur, Niveau.de("CE1"));

  assertEquals(joue.questionsJouees().map(({ type }) => type), ["horloge", "horloge"]);
});

Deno.test("un exercice horloge en mode placer ne donne aucune question tant que le mode placer n'est pas livré", () => {
  const exercice = exerciceDHorloge("CE1", { mode: "placer", items: [{ heure: "2:15" }] });

  const joue = ExerciceJoue.depuis(0, exercice, tireur, Niveau.de("CE1"));

  assertEquals([joue.questions, joue.questionsJouees()], [0, []]);
});
