import { assertEquals, assertThrows } from "@std/assert";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardFixe, hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import {
  leconAvecDesChoixAccentues,
  leconCompterSansEtape,
  leconDeCalcul,
  leconDEcoute,
  leconDeDeuxExercicesCourts,
  leconDeLecture,
} from "../test_utils/lecons-de-test.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { PasDeQuestionEnCours, SeanceDejaFinie } from "./erreurs.ts";
import type { Hasard } from "./hasard.ts";
import { Reponse } from "./reponse.ts";
import { Seance } from "./seance.ts";

function commencer(lecon: Lecon, hasard: Hasard = hasardSansMelange()): Seance {
  return Seance.commencer(generateurIdFixe("seance-1"), hasard, "profil-lea", lecon, ChoixDeSeance.complete());
}

function questionEnCours(seance: Seance) {
  const question = seance.exerciceEnCours()?.questionEnCours();
  if (!question) throw new Error("Aucune question en cours");
  return question;
}

Deno.test("la question en cours expose son énoncé et ses choix dans l'ordre tiré", () => {
  const question = questionEnCours(commencer(leconDeCalcul()));

  assertEquals(question.enonce, "Combien font 3 + 4 ?");
  assertEquals(question.choix.textes(), ["6", "7", "8", "9"]);
  assertEquals(question.choix.possibles(), ["6", "7", "8", "9"]);
  assertEquals(question.choix.ecartes(), []);
});

Deno.test("deux séances avec des tirages différents proposent les choix dans des ordres différents", () => {
  const sansMelange = questionEnCours(commencer(leconDeCalcul(), hasardSansMelange()));
  const melange = questionEnCours(commencer(leconDeCalcul(), hasardFixe(0, 0, 0)));

  assertEquals([...melange.choix.textes()].sort(), ["6", "7", "8", "9"]);
  assertEquals(melange.choix.textes().join() === sansMelange.choix.textes().join(), false);
});

Deno.test("l'ordre des choix tiré au début de la séance ne change plus après une erreur", () => {
  const seance = commencer(leconDeCalcul(), hasardFixe(0, 0, 0));
  const avant = questionEnCours(seance).choix.textes();

  seance.repondre(Reponse.choix("8"));

  assertEquals(questionEnCours(seance).choix.textes(), avant);
});

Deno.test("le bon choix est juste et réussit la question : l'avancement avance", () => {
  const seance = commencer(leconDeCalcul());

  const resultat = seance.repondre(Reponse.choix("7"));

  assertEquals(resultat, "juste");
  assertEquals(seance.avancement().questionsReussies, 1);
});

Deno.test("le bon choix passe à la question suivante de l'exercice", () => {
  const seance = commencer(leconDeDeuxExercicesCourts());

  seance.repondre(Reponse.choix("ou"));

  assertEquals(questionEnCours(seance).enonce, "Combien font 2 + 2 ?");
});

Deno.test("le bon choix à la dernière question d'un exercice commence l'exercice suivant", () => {
  const seance = commencer(leconDeDeuxExercicesCourts());
  seance.repondre(Reponse.choix("ou"));
  seance.repondre(Reponse.choix("ou"));

  assertEquals(seance.exerciceEnCours()?.position, 1);
  assertEquals(seance.retirerFaits(), [{ type: "ExerciceSuivantCommence", titre: "Second défi" }]);
});

Deno.test("un mauvais choix est fausse, coûte une erreur, est écarté et la question reste ouverte", () => {
  const seance = commencer(leconDeCalcul());

  const resultat = seance.repondre(Reponse.choix("8"));

  const question = questionEnCours(seance);
  assertEquals(resultat, "fausse");
  assertEquals(question.erreurs, 1);
  assertEquals(question.choix.ecartes(), ["8"]);
  assertEquals(seance.avancement().questionsReussies, 0);
});

Deno.test("une erreur ne fait pas avancer la séance", () => {
  const seance = commencer(leconDeDeuxExercicesCourts());

  seance.repondre(Reponse.choix("on"));

  assertEquals(questionEnCours(seance).enonce, "Combien font 1 + 1 ?");
});

Deno.test("toucher de nouveau un choix écarté est dejaEcartee et ne coûte aucune erreur", () => {
  const seance = commencer(leconDeCalcul());
  seance.repondre(Reponse.choix("8"));

  const resultat = seance.repondre(Reponse.choix("8"));

  assertEquals(resultat, "dejaEcartee");
  assertEquals(questionEnCours(seance).erreurs, 1);
  assertEquals(questionEnCours(seance).choix.possibles(), ["6", "7", "9"]);
});

Deno.test("à la 2e erreur sur la même question, il reste deux choix possibles dont le bon", () => {
  const seance = commencer(leconDeCalcul());
  seance.repondre(Reponse.choix("8"));

  seance.repondre(Reponse.choix("9"));

  const question = questionEnCours(seance);
  assertEquals(question.erreurs, 2);
  assertEquals(question.choix.possibles(), ["6", "7"]);
  assertEquals(question.choix.ecartes(), ["8", "9"]);
});

Deno.test("après une erreur, le bon choix réussit encore la question", () => {
  const seance = commencer(leconDeDeuxExercicesCourts());
  seance.repondre(Reponse.choix("on"));

  const resultat = seance.repondre(Reponse.choix("ou"));

  assertEquals(resultat, "juste");
  assertEquals(seance.avancement().questionsReussies, 1);
});

Deno.test("la correction compare le texte exact : « a » et « à » sont deux choix différents", () => {
  const seance = commencer(leconAvecDesChoixAccentues());

  assertEquals(seance.repondre(Reponse.choix("à")), "fausse");
  assertEquals(seance.repondre(Reponse.choix("a")), "juste");
});

Deno.test("répondre à une séance dont les étapes de leçon ne sont pas finies n'a pas de question en cours", () => {
  const seance = Seance.commencer(
    generateurIdFixe("seance-1"),
    hasardSansMelange(),
    "profil-lea",
    leconDeDeuxExercicesCourts(),
    ChoixDeSeance.complete(),
  );

  assertThrows(() => seance.repondre(Reponse.choix("ou")), PasDeQuestionEnCours);
});

Deno.test("répondre après la dernière question réussie est refusé : la séance est finie", () => {
  const seance = commencer(leconCompterSansEtape());
  seance.repondre(Reponse.choix("ou"));

  assertThrows(() => seance.repondre(Reponse.choix("ou")), SeanceDejaFinie);
});

Deno.test("une question qui a eu une erreur est gardée par sa clé, une seule fois", () => {
  const seance = commencer(leconDeCalcul());
  seance.repondre(Reponse.choix("8"));
  seance.repondre(Reponse.choix("9"));
  seance.repondre(Reponse.choix("7"));

  assertEquals(seance.clesDesQuestionsRatees().map((cle) => cle.valeur), ["b:combien font 3 + 4 ?7"]);
});

Deno.test("une question réussie du premier coup n'est pas gardée", () => {
  const seance = commencer(leconDeCalcul());
  seance.repondre(Reponse.choix("7"));

  assertEquals(seance.clesDesQuestionsRatees(), []);
});

Deno.test("la clé d'une question de lecture ratée est préfixée « l: »", () => {
  const seance = commencer(leconDeLecture());
  seance.repondre(Reponse.choix("dans le jardin"));

  assertEquals(seance.clesDesQuestionsRatees().map((cle) => cle.valeur), ["l:ou dort plume ?sur le lit de lea"]);
});

Deno.test("la clé d'une question d'écoute ratée est préfixée « e: » et porte le mot à écouter", () => {
  const seance = commencer(leconDEcoute());
  seance.repondre(Reponse.choix("chien"));

  assertEquals(seance.clesDesQuestionsRatees().map((cle) => cle.valeur), ["e:cat"]);
});
