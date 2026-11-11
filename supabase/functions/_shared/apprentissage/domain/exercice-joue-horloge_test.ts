import { assertEquals, assertNotEquals } from "@std/assert";
import { Niveau } from "../../catalogue/domain/index.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { exerciceDHorloge } from "../test_utils/lecons-d-horloge.ts";
import { leconLesDoublesAuCP } from "../test_utils/lecons-de-calcul.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { ExerciceJoue } from "./exercice-joue.ts";
import { Reponse } from "./reponse.ts";
import { Seance } from "./seance.ts";
import { leconDHorloge } from "../test_utils/lecons-d-horloge.ts";
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

const AIDE_PAR_DEFAUT = "La petite aiguille montre les heures, la grande les minutes.";

const exerciceHorlogeJoue = (item: Record<string, unknown>) =>
  ExerciceJoue.depuis(0, exerciceDHorloge("CE1", { mode: "lire", items: [item] }), tireur, Niveau.de("CE1"));

Deno.test("la question d'horloge en cours est celle de l'heure à lire", () => {
  const joue = exerciceHorlogeJoue({ heure: "2:15" });

  assertNotEquals(joue.questionDHorlogeEnCours(), undefined);
});

Deno.test("un exercice qui n'est pas une horloge n'a pas de question d'horloge en cours", () => {
  const exercice = leconLesDoublesAuCP().exercices[0]!;

  const joue = ExerciceJoue.depuis(0, exercice, tireur, Niveau.de("CP"));

  assertEquals(joue.questionDHorlogeEnCours(), undefined);
});

Deno.test("la séance donne la question d'horloge de l'exercice en cours", () => {
  const lecon = leconDHorloge("CE1", { mode: "lire", items: [{ heure: "2:15" }] });

  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-tom",
    lecon,
    ChoixDeSeance.complete(),
  );

  assertNotEquals(seance.questionDHorlogeEnCours(), undefined);
});

Deno.test("la séance n'a pas de question d'horloge en cours sur un autre exercice", () => {
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-tom",
    leconLesDoublesAuCP(),
    ChoixDeSeance.complete(),
  );

  assertEquals(seance.questionDHorlogeEnCours(), undefined);
});

Deno.test("après une erreur d'horloge, l'aide de l'heure est donnée", () => {
  const joue = exerciceHorlogeJoue({ heure: "2:15", aide: "Regarde la grande aiguille sur le 3." });

  joue.repondre(Reponse.heureEcrite(2, 30));

  assertEquals(joue.aideApresLaDerniereErreur(), "Regarde la grande aiguille sur le 3.");
});

Deno.test("après une erreur d'horloge sans aide propre à l'heure, l'aide par défaut est donnée", () => {
  const joue = exerciceHorlogeJoue({ heure: "2:15" });

  joue.repondre(Reponse.heureEcrite(2, 30));

  assertEquals(joue.aideApresLaDerniereErreur(), AIDE_PAR_DEFAUT);
});
