import { assertEquals, assertThrows } from "@std/assert";
import { ClavierDesDictees } from "./clavier-des-dictees.ts";
import { ClavierDesDicteesInconnu } from "./erreurs.ts";

Deno.test("le clavier des dictées se choisit parmi automatique, lettres du mot et clavier complet", () => {
  const valeurs = ["automatique", "lettresDuMot", "clavierComplet"].map((brut) => ClavierDesDictees.de(brut).valeur);

  assertEquals(valeurs, ["automatique", "lettresDuMot", "clavierComplet"]);
});

Deno.test("un clavier des dictées inconnu est refusé", () => {
  assertThrows(() => ClavierDesDictees.de("azerty"), ClavierDesDicteesInconnu);
});
