import { assert, assertEquals } from "@std/assert";
import {
  leconDeDicteeDArcEnCiel,
  leconDeDicteeDuChat,
  profilDeDictee,
  seanceDeDictee,
} from "../../test_utils/lecons-de-dictee.ts";

function questionEnCours(seance: ReturnType<typeof seanceDeDictee>) {
  const question = seance.questionDeDicteeEnCours();
  assert(question);
  return question;
}

function lettresIndisponibles(seance: ReturnType<typeof seanceDeDictee>): string[] {
  return questionEnCours(seance).rangeesDuClavier().flat()
    .filter((touche) => !touche.disponible)
    .map((touche) => touche.lettre);
}

Deno.test("les rangées du clavier gardent les touches proposées, toutes disponibles avant la première lettre", () => {
  const question = questionEnCours(seanceDeDictee(leconDeDicteeDuChat()));

  const rangees = question.rangeesDuClavier();

  assertEquals(rangees.map((rangee) => rangee.map((touche) => touche.lettre)), question.clavier().rangees);
  assert(rangees.flat().every((touche) => touche.disponible));
});

Deno.test("avec les lettres du mot, la touche d'une lettre tapée devient indisponible", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());

  seance.taper("c");

  assertEquals(lettresIndisponibles(seance), ["c"]);
});

Deno.test("avec les lettres du mot, une lettre répétée n'indisponibilise qu'une touche par frappe", () => {
  const seance = seanceDeDictee(leconDeDicteeDArcEnCiel());

  seance.taper("c");

  assertEquals(lettresIndisponibles(seance), ["c"]);
});

Deno.test("avec les lettres du mot, « Effacer » rend la touche de nouveau disponible", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());
  seance.taper("c");

  seance.effacer();

  assertEquals(lettresIndisponibles(seance), []);
});

Deno.test("avec le clavier complet, toutes les touches restent disponibles après une frappe", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), profilDeDictee("clavierComplet", "CP"));

  seance.taper("c");

  assertEquals(lettresIndisponibles(seance), []);
});
