import { assertEquals } from "@std/assert";
import { Niveau } from "../../catalogue/domain/index.ts";
import type { ExerciceMemoriser } from "../../catalogue/domain/exercices/memoriser.ts";
import { leconDeClasserLesSons, leconDOrdreDuMot, seanceCommencee } from "../test_utils/lecons-de-classer-et-ordre.ts";
import { leconDeConjugaisonDuVerbeEtre } from "../test_utils/lecons-de-conjugaison.ts";
import { leconDeDeuxTrous } from "../test_utils/lecons-de-trous.ts";
import { leconDeBullesEtDEcoute } from "../test_utils/lecons-de-test.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { ExerciceJoue } from "./exercice-joue.ts";
import { Reponse } from "./reponse.ts";
import { tireurAuHasard } from "./tireur.ts";

const versDuClair = ["Au clair de la lune,", "Mon ami Pierrot,", "Ma chandelle est morte,"];
const auClairDeLaLune: ExerciceMemoriser = { type: "memoriser", titre: "Au clair de la lune", vers: versDuClair };

function poesieAvecTousLesVersPlaces(): ExerciceJoue {
  const exerciceJoue = ExerciceJoue.depuis(
    0,
    auClairDeLaLune,
    tireurAuHasard(hasardSansMelange()),
    Niveau.de("CE1"),
  );
  versDuClair.forEach((unVers) => exerciceJoue.repondre(Reponse.placement(unVers)));
  return exerciceJoue;
}

Deno.test("le bon mot du dernier trou complète l'exercice", () => {
  const seance = seanceCommencee(leconDeDeuxTrous());
  seance.repondre(Reponse.choix("suis"));

  seance.repondre(Reponse.choix("es"));

  assertEquals(seance.exerciceCompleteParLaDerniereReponse(), true);
});

Deno.test("la dernière étiquette bien placée complète un exercice d'ordre", () => {
  const seance = seanceCommencee(leconDOrdreDuMot());
  seance.repondre(Reponse.placement("do"));
  seance.repondre(Reponse.placement("mi"));

  seance.repondre(Reponse.placement("no"));

  assertEquals(seance.exerciceCompleteParLaDerniereReponse(), true);
});

Deno.test("la dernière étiquette bien rangée complète un exercice de classement", () => {
  const seance = seanceCommencee(leconDeClasserLesSons());
  seance.repondre(Reponse.placement("loup", "g-ou"));
  seance.repondre(Reponse.placement("pont", "g-on"));

  seance.repondre(Reponse.placement("savon", "g-on"));

  assertEquals(seance.exerciceCompleteParLaDerniereReponse(), true);
});

Deno.test("la bonne forme de la dernière personne complète l'exercice de conjugaison", () => {
  const seance = seanceCommencee(leconDeConjugaisonDuVerbeEtre());
  ["suis", "es", "est", "sommes", "êtes", "sont"].forEach((forme) => seance.repondre(Reponse.choix(forme)));

  assertEquals(seance.exerciceCompleteParLaDerniereReponse(), true);
});

Deno.test("le bon mot caché du dernier vers complète l'exercice de mémorisation", () => {
  const exerciceJoue = poesieAvecTousLesVersPlaces();
  ["clair", "Pierrot"].forEach((mot) => exerciceJoue.repondre(Reponse.choix(mot)));

  exerciceJoue.repondre(Reponse.choix("chandelle"));

  assertEquals(exerciceJoue.exerciceCompleteParLaDerniereReponse(), true);
});

Deno.test("une bonne réponse qui n'est pas la dernière ne complète pas l'exercice", () => {
  const seance = seanceCommencee(leconDOrdreDuMot());

  seance.repondre(Reponse.placement("do"));

  assertEquals(seance.exerciceCompleteParLaDerniereReponse(), false);
});

Deno.test("une réponse fausse ne complète pas l'exercice", () => {
  const seance = seanceCommencee(leconDeDeuxTrous());
  seance.repondre(Reponse.choix("suis"));

  seance.repondre(Reponse.choix("suis"));

  assertEquals(seance.exerciceCompleteParLaDerniereReponse(), false);
});

Deno.test("la réponse d'un exercice à une seule réponse ne complète pas l'exercice", () => {
  const seance = seanceCommencee(leconDeBullesEtDEcoute());

  seance.repondre(Reponse.choix("ou"));

  assertEquals(seance.exerciceCompleteParLaDerniereReponse(), false);
});
