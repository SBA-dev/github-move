import { assertEquals, assertThrows } from "@std/assert";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import {
  leconDeDeuxExercicesCourts,
  leconDeDeuxExercicesDontLeSecondSansTitre,
  leconSonsOuOnAn,
} from "../test_utils/lecons-de-test.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { PasDeQuestionEnCours, SeanceDejaFinie } from "./erreurs.ts";
import { Seance } from "./seance.ts";

function commencer(lecon: Lecon, choix: ChoixDeSeance): Seance {
  return Seance.commencer(generateurIdFixe("seance-1"), "profil-lea", lecon, choix);
}

function seanceCompleteAuxExercices(lecon: Lecon): Seance {
  const seance = commencer(lecon, ChoixDeSeance.complete());
  while (seance.etapeDeLeconEnCours()) seance.continuer();
  seance.retirerFaits();
  return seance;
}

function reussirQuestions(seance: Seance, nombre: number): void {
  for (let i = 0; i < nombre; i++) seance.reussirLaQuestionEnCours();
}

Deno.test("l'avancement d'une séance complète de « Les sons ou, on, an » compte 15 questions, aucune réussie", () => {
  const avancement = commencer(leconSonsOuOnAn(), ChoixDeSeance.complete()).avancement();

  assertEquals([avancement.questionsReussies, avancement.total, avancement.estComplet()], [0, 15, false]);
});

Deno.test("l'avancement d'une séance d'un exercice ne compte que les questions de cet exercice", () => {
  const premier = commencer(leconSonsOuOnAn(), ChoixDeSeance.unExercice(0)).avancement();
  const second = commencer(leconSonsOuOnAn(), ChoixDeSeance.unExercice(1)).avancement();

  assertEquals([premier.total, second.total], [6, 9]);
});

Deno.test("les étapes de leçon ne font pas avancer la séance", () => {
  const seance = commencer(leconSonsOuOnAn(), ChoixDeSeance.complete());

  seance.continuer();
  seance.continuer();
  seance.continuer();

  assertEquals(seance.avancement().questionsReussies, 0);
});

Deno.test("chaque question réussie fait avancer la séance d'un pas", () => {
  const seance = seanceCompleteAuxExercices(leconSonsOuOnAn());

  reussirQuestions(seance, 2);

  assertEquals(seance.avancement().questionsReussies, 2);
  assertEquals(seance.avancement().total, 15);
});

Deno.test("tant que toutes les questions de l'exercice ne sont pas réussies, l'exercice suivant ne commence pas", () => {
  const seance = seanceCompleteAuxExercices(leconDeDeuxExercicesCourts());

  reussirQuestions(seance, 1);

  assertEquals(seance.exerciceEnCours()?.position, 0);
  assertEquals(seance.retirerFaits(), []);
});

Deno.test("la dernière question d'un exercice réussie, l'exercice suivant de la leçon devient l'exercice en cours", () => {
  const seance = seanceCompleteAuxExercices(leconDeDeuxExercicesCourts());

  reussirQuestions(seance, 2);

  assertEquals(seance.exerciceEnCours()?.position, 1);
  assertEquals(seance.estFinie(), false);
});

Deno.test("passer à l'exercice suivant est un fait observable avec son titre, une seule fois", () => {
  const seance = seanceCompleteAuxExercices(leconDeDeuxExercicesCourts());

  reussirQuestions(seance, 2);

  assertEquals(seance.retirerFaits(), [{ type: "ExerciceSuivantCommence", titre: "Second défi" }]);
  assertEquals(seance.retirerFaits(), []);
});

Deno.test("un exercice suivant sans titre commence sans fait d'annonce", () => {
  const seance = seanceCompleteAuxExercices(leconDeDeuxExercicesDontLeSecondSansTitre());

  reussirQuestions(seance, 2);

  assertEquals(seance.exerciceEnCours()?.position, 1);
  assertEquals(seance.retirerFaits(), []);
});

Deno.test("la fin des étapes de leçon et l'annonce du titre sont deux faits distincts, dans l'ordre", () => {
  const seance = commencer(leconDeDeuxExercicesCourts(), ChoixDeSeance.complete());
  seance.continuer();
  reussirQuestions(seance, 2);

  assertEquals(seance.retirerFaits(), [
    { type: "EtapesDeLeconFinies" },
    { type: "ExerciceSuivantCommence", titre: "Second défi" },
  ]);
});

Deno.test("après la dernière question réussie, la séance est finie, son avancement complet et sans exercice en cours", () => {
  const seance = seanceCompleteAuxExercices(leconDeDeuxExercicesCourts());

  reussirQuestions(seance, 3);

  assertEquals(seance.estFinie(), true);
  assertEquals(seance.avancement().questionsReussies, 3);
  assertEquals(seance.avancement().estComplet(), true);
  assertEquals(seance.exerciceEnCours(), undefined);
  assertEquals(seance.retirerFaits().length, 1);
});

Deno.test("une séance d'un exercice se termine avec cet exercice, sans annonce", () => {
  const seance = commencer(leconDeDeuxExercicesCourts(), ChoixDeSeance.unExercice(0));

  reussirQuestions(seance, 2);

  assertEquals(seance.estFinie(), true);
  assertEquals(seance.avancement().estComplet(), true);
  assertEquals(seance.retirerFaits(), []);
});

Deno.test("réussir une question dans une séance déjà finie est refusé", () => {
  const seance = commencer(leconDeDeuxExercicesCourts(), ChoixDeSeance.unExercice(1));
  seance.reussirLaQuestionEnCours();

  assertThrows(() => seance.reussirLaQuestionEnCours(), SeanceDejaFinie);
});

Deno.test("réussir une question pendant une étape de leçon est refusé", () => {
  const seance = commencer(leconDeDeuxExercicesCourts(), ChoixDeSeance.complete());

  assertThrows(() => seance.reussirLaQuestionEnCours(), PasDeQuestionEnCours);
});

Deno.test("une séance qui vient de commencer n'est pas finie", () => {
  assertEquals(commencer(leconSonsOuOnAn(), ChoixDeSeance.complete()).estFinie(), false);
});
