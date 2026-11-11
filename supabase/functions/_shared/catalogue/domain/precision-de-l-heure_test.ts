import { assert, assertEquals, assertFalse, assertThrows } from "@std/assert";
import { LeconMalFormee } from "./erreurs.ts";
import { HeureDeLHorloge } from "./heure-de-l-horloge.ts";
import { Niveau } from "./niveau.ts";
import { PrecisionDeLHeure } from "./precision-de-l-heure.ts";

const ECRITURES = ["heure", "demi-heure", "quart-d-heure", "cinq-minutes", "minute", "seconde"];

Deno.test("une précision se lit depuis les écritures du format de leçon", () => {
  for (const ecriture of ECRITURES) {
    assertEquals(PrecisionDeLHeure.lire(ecriture).ecriture(), ecriture);
  }
});

Deno.test("une autre écriture de précision est refusée", () => {
  assertThrows(() => PrecisionDeLHeure.lire("dixieme"), LeconMalFormee);
});

Deno.test("3 h 30 ne respecte pas la précision « heure »", () => {
  assertFalse(PrecisionDeLHeure.lire("heure").respectee(HeureDeLHorloge.lire("3:30")));
});

Deno.test("3 h 30 respecte la précision « demi-heure »", () => {
  assert(PrecisionDeLHeure.lire("demi-heure").respectee(HeureDeLHorloge.lire("3:30")));
});

Deno.test("7 h 45 respecte « quart-d-heure » mais pas « demi-heure »", () => {
  const heure = HeureDeLHorloge.lire("7:45");

  assert(PrecisionDeLHeure.lire("quart-d-heure").respectee(heure));
  assertFalse(PrecisionDeLHeure.lire("demi-heure").respectee(heure));
});

Deno.test("6 h 18 respecte « minute » mais pas « cinq-minutes »", () => {
  const heure = HeureDeLHorloge.lire("6:18");

  assert(PrecisionDeLHeure.lire("minute").respectee(heure));
  assertFalse(PrecisionDeLHeure.lire("cinq-minutes").respectee(heure));
});

Deno.test("6 h 18 min 20 s ne respecte que la précision « seconde »", () => {
  const heure = HeureDeLHorloge.lire("6:18:20");

  for (const ecriture of ECRITURES) {
    assertEquals(PrecisionDeLHeure.lire(ecriture).respectee(heure), ecriture === "seconde");
  }
});

Deno.test("la précision par défaut dépend du niveau", () => {
  const attendues = { CP: "heure", CE1: "quart-d-heure", CE2: "minute", CM1: "minute", CM2: "seconde" };

  for (const [niveau, ecriture] of Object.entries(attendues)) {
    assertEquals(PrecisionDeLHeure.parDefaut(Niveau.de(niveau)).ecriture(), ecriture);
  }
});

Deno.test("une précision plus fine que celle du niveau est refusée", () => {
  assertFalse(PrecisionDeLHeure.lire("minute").permiseAu(Niveau.de("CE1")));
});

Deno.test("une précision plus grossière que celle du niveau est permise", () => {
  assert(PrecisionDeLHeure.lire("heure").permiseAu(Niveau.de("CM1")));
});

Deno.test("« cinq-minutes » est permise au CE2", () => {
  assert(PrecisionDeLHeure.lire("cinq-minutes").permiseAu(Niveau.de("CE2")));
});
