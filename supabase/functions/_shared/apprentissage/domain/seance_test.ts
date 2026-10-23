import { assertEquals, assertThrows } from "@std/assert";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardSansMelange } from "../test_utils/hasard-fixe.ts";
import { leconCompterSansEtape, leconSansExercice, leconSonsOuOnAn } from "../test_utils/lecons-de-test.ts";
import { ChoixDeSeance } from "./choix-de-seance.ts";
import { ExerciceIntrouvable, LeconSansExercice, PasDEtapeDeLeconEnCours } from "./erreurs.ts";
import { Seance } from "./seance.ts";

const profilDeLea = "profil-lea";

function commencer(lecon: Lecon, choix: ChoixDeSeance): Seance {
  return Seance.commencer(generateurIdFixe("seance-1"), hasardSansMelange(), profilDeLea, lecon, choix);
}

Deno.test("une séance commencée porte l'identifiant fourni, le profil enfant et la leçon", () => {
  const seance = commencer(leconSonsOuOnAn(), ChoixDeSeance.complete());

  assertEquals([seance.id.valeur, seance.enfant, seance.lecon], ["seance-1", profilDeLea, "fr-cp-sons-ou-on-an"]);
});

Deno.test("une séance complète commence par la première étape de leçon, sans exercice en cours", () => {
  const lecon = leconSonsOuOnAn();
  const seance = commencer(lecon, ChoixDeSeance.complete());

  assertEquals(seance.etapeDeLeconEnCours(), lecon.etapes[0]);
  assertEquals(seance.exerciceEnCours(), undefined);
});

Deno.test("continuer passe à l'étape de leçon suivante, dans l'ordre", () => {
  const lecon = leconSonsOuOnAn();
  const seance = commencer(lecon, ChoixDeSeance.complete());

  seance.continuer();

  assertEquals(seance.etapeDeLeconEnCours(), lecon.etapes[1]);
});

Deno.test("après la dernière étape de leçon, l'exercice en cours est le premier exercice de la leçon", () => {
  const seance = commencer(leconSonsOuOnAn(), ChoixDeSeance.complete());

  seance.continuer();
  seance.continuer();
  seance.continuer();

  assertEquals(seance.etapeDeLeconEnCours(), undefined);
  assertEquals(seance.exerciceEnCours()?.position, 0);
});

Deno.test("la fin des étapes de leçon est un fait observable, une seule fois", () => {
  const seance = commencer(leconSonsOuOnAn(), ChoixDeSeance.complete());
  seance.continuer();
  seance.continuer();
  assertEquals(seance.retirerFaits(), []);

  seance.continuer();

  assertEquals(seance.retirerFaits(), [{ type: "EtapesDeLeconFinies" }]);
  assertEquals(seance.retirerFaits(), []);
});

Deno.test("une leçon sans étape de leçon commence directement par son premier exercice, sans fait", () => {
  const seance = commencer(leconCompterSansEtape(), ChoixDeSeance.complete());

  assertEquals(seance.etapeDeLeconEnCours(), undefined);
  assertEquals(seance.exerciceEnCours()?.position, 0);
  assertEquals(seance.retirerFaits(), []);
});

Deno.test("le plan d'une séance complète compte les étapes de leçon puis tous les exercices dans l'ordre", () => {
  const seance = commencer(leconSonsOuOnAn(), ChoixDeSeance.complete());

  assertEquals(seance.plan.etapes.length, 3);
  assertEquals(seance.plan.positionsDesExercices, [0, 1]);
});

Deno.test("une séance d'un exercice n'a aucune étape de leçon et joue l'exercice choisi", () => {
  const seance = commencer(leconSonsOuOnAn(), ChoixDeSeance.unExercice(1));

  assertEquals(seance.etapeDeLeconEnCours(), undefined);
  assertEquals(seance.exerciceEnCours()?.position, 1);
  assertEquals(seance.retirerFaits(), []);
});

Deno.test("le plan d'une séance d'un exercice ne contient que cet exercice", () => {
  const seance = commencer(leconSonsOuOnAn(), ChoixDeSeance.unExercice(1));

  assertEquals(seance.plan.etapes, []);
  assertEquals(seance.plan.positionsDesExercices, [1]);
});

Deno.test("choisir un exercice qui n'existe pas dans la leçon est refusé", () => {
  assertThrows(() => commencer(leconSonsOuOnAn(), ChoixDeSeance.unExercice(2)), ExerciceIntrouvable);
});

Deno.test("une leçon sans exercice ne peut pas être jouée", () => {
  assertThrows(() => commencer(leconSansExercice(), ChoixDeSeance.complete()), LeconSansExercice);
});

Deno.test("continuer sans étape de leçon en cours est refusé", () => {
  const seance = commencer(leconSonsOuOnAn(), ChoixDeSeance.unExercice(0));

  assertThrows(() => seance.continuer(), PasDEtapeDeLeconEnCours);
});
