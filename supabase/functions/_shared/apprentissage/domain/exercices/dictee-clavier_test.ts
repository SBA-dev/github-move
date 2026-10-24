import { assert, assertEquals } from "@std/assert";
import {
  leconDeDicteeDArcEnCiel,
  leconDeDicteeDuChat,
  profilDeDictee,
  seanceDeDictee,
} from "../../test_utils/lecons-de-dictee.ts";

const CLAVIER_COMPLET_CP = profilDeDictee("clavierComplet", "CP");

function questionEnCours(seance: ReturnType<typeof seanceDeDictee>) {
  const question = seance.questionDeDicteeEnCours();
  assert(question);
  return question;
}

function trier(touches: readonly string[]): string[] {
  return [...touches].sort();
}

Deno.test("la question expose le clavier complet proposé : son genre et ses cinq rangées", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), CLAVIER_COMPLET_CP);

  const clavier = questionEnCours(seance).clavier();

  assertEquals(clavier.genre, "clavierComplet");
  assertEquals(clavier.rangees.map((rangee) => rangee.join("")), [
    "azertyuiop",
    "qsdfghjklm",
    "wxcvbnéèêà",
    "çùëïôâîû",
    "œ",
  ]);
});

Deno.test("la question expose les lettres du mot proposées : une seule rangée de sept touches pour « chat »", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());

  const clavier = questionEnCours(seance).clavier();

  assertEquals(clavier.genre, "lettresDuMot");
  assertEquals(clavier.rangees.map((rangee) => rangee.length), [7]);
});

Deno.test("avec les lettres du mot, toutes les touches sont disponibles avant la première lettre", () => {
  const question = questionEnCours(seanceDeDictee(leconDeDicteeDuChat()));

  assertEquals(trier(question.touchesDisponibles()), trier(question.clavier().rangees.flat()));
});

Deno.test("avec les lettres du mot, la touche d'une lettre tapée n'est plus disponible", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());
  const avant = questionEnCours(seance).touchesDisponibles();

  seance.taper("c");

  const apres = questionEnCours(seance).touchesDisponibles();
  assertEquals(trier(apres), trier(avant.filter((touche, rang) => touche !== "c" || rang !== avant.indexOf("c"))));
});

Deno.test("avec les lettres du mot, une lettre répétée garde sa seconde touche après une première frappe", () => {
  const seance = seanceDeDictee(leconDeDicteeDArcEnCiel());

  seance.taper("c");

  const disponibles = questionEnCours(seance).touchesDisponibles();
  assertEquals(disponibles.filter((touche) => touche === "c").length, 1);
});

Deno.test("avec les lettres du mot, « Effacer » rend la touche disponible", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat());
  const avant = questionEnCours(seance).touchesDisponibles();
  seance.taper("c");

  seance.effacer();

  assertEquals(trier(questionEnCours(seance).touchesDisponibles()), trier(avant));
});

Deno.test("avec le clavier complet, toutes les touches restent disponibles après une frappe", () => {
  const seance = seanceDeDictee(leconDeDicteeDuChat(), CLAVIER_COMPLET_CP);
  const avant = questionEnCours(seance).touchesDisponibles();

  seance.taper("c");

  assertEquals(trier(questionEnCours(seance).touchesDisponibles()), trier(avant));
  assert(avant.includes("c"));
});
