import { assertEquals, assertThrows } from "@std/assert";
import { seanceComplete, seanceDUnExercice } from "./choix-de-seance.ts";
import { PasDEtapeDeLeconEnCours } from "./erreurs.ts";
import { Seance } from "./seance.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { generateurIdFixe } from "../test_utils/generateur-id-fixe.ts";
import { hasardIndifferent } from "../test_utils/hasard-fixe.ts";
import { laLeconDesSons, uneLeconAvecExercices, unExerciceBrut } from "../test_utils/lecons-de-test.ts";

function commencer(lecon: Lecon, choix = seanceComplete()): Seance {
  return Seance.commencer({
    lecon,
    enfant: "enfant-lea",
    choix,
    generateurId: generateurIdFixe("seance-1"),
    hasard: hasardIndifferent(),
  });
}

Deno.test("une séance commencée est identifiée, sur une leçon et un profil enfant, avec son plan", () => {
  const lecon = laLeconDesSons();

  const seance = commencer(lecon);

  assertEquals(seance.id, "seance-1");
  assertEquals(seance.enfant, "enfant-lea");
  assertEquals(seance.lecon, "fr-cp-sons-ou-on-an");
  assertEquals(seance.plan.positionsDesExercices, [0, 1]);
});

Deno.test("dans une séance complète, l'étape de leçon en cours est la première", () => {
  const lecon = laLeconDesSons();

  const seance = commencer(lecon);

  assertEquals(seance.etapeDeLeconEnCours(), lecon.etapes[0]);
});

Deno.test("continuer passe à l'étape de leçon suivante", () => {
  const lecon = laLeconDesSons();
  const seance = commencer(lecon);

  seance.continuer();

  assertEquals(seance.etapeDeLeconEnCours(), lecon.etapes[1]);
});

Deno.test("après la dernière étape de leçon, l'exercice en cours est le premier exercice", () => {
  const seance = commencer(laLeconDesSons());

  seance.continuer();
  seance.continuer();
  seance.continuer();

  assertEquals(seance.etapeDeLeconEnCours(), undefined);
  assertEquals(seance.exerciceEnCours()?.position, 0);
});

Deno.test("pendant les étapes de leçon, aucun exercice n'est en cours", () => {
  const seance = commencer(laLeconDesSons());

  assertEquals(seance.exerciceEnCours(), undefined);
});

Deno.test("continuer sans étape de leçon en cours est refusé", () => {
  const seance = commencer(laLeconDesSons(), seanceDUnExercice(laLeconDesSons(), 1));

  assertThrows(() => seance.continuer(), PasDEtapeDeLeconEnCours);
});

Deno.test("une séance d'un exercice n'a aucune étape de leçon et joue l'exercice choisi", () => {
  const lecon = laLeconDesSons();

  const seance = commencer(lecon, seanceDUnExercice(lecon, 1));

  assertEquals(seance.etapeDeLeconEnCours(), undefined);
  assertEquals(seance.exerciceEnCours()?.position, 1);
});

Deno.test("une séance complète d'une leçon sans étape de leçon commence par le premier exercice", () => {
  const lecon = uneLeconAvecExercices(unExerciceBrut("fluence"), unExerciceBrut("fluence"));

  const seance = commencer(lecon);

  assertEquals(seance.etapeDeLeconEnCours(), undefined);
  assertEquals(seance.exerciceEnCours()?.position, 0);
});

Deno.test("l'avancement initial d'une séance n'est pas terminé", () => {
  const seance = commencer(laLeconDesSons());

  assertEquals(seance.avancement().questionsReussies, 0);
  assertEquals(seance.avancement().total, 15);
  assertEquals(seance.avancement().estComplet(), false);
});
