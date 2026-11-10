import { assert, assertEquals, assertFalse, assertThrows } from "@std/assert";
import { LeconMalFormee } from "./erreurs.ts";
import { HeureDeLHorloge } from "./heure-de-l-horloge.ts";

Deno.test("une heure s'écrit « H:MM » sur 24 heures", () => {
  const heure = HeureDeLHorloge.lire("14:30");

  assertEquals(heure.heures, 14);
  assertEquals(heure.minutes, 30);
  assertEquals(heure.secondes, 0);
});

Deno.test("une heure s'écrit sans zéro devant les heures", () => {
  const heure = HeureDeLHorloge.lire("2:15");

  assertEquals(heure.heures, 2);
  assertEquals(heure.minutes, 15);
});

Deno.test("une heure peut porter des secondes « H:MM:SS »", () => {
  const heure = HeureDeLHorloge.lire("6:18:20");

  assertEquals(heure.heures, 6);
  assertEquals(heure.minutes, 18);
  assertEquals(heure.secondes, 20);
});

Deno.test("une écriture mal formée est refusée", () => {
  for (const brut of ["", "midi", "14h30", "14:3", "14:30:5", "1:2:3:4", ":30"]) {
    assertThrows(() => HeureDeLHorloge.lire(brut), LeconMalFormee);
  }
});

Deno.test("une heure au-delà de 23 est refusée", () => {
  assertThrows(() => HeureDeLHorloge.lire("24:00"), LeconMalFormee);
});

Deno.test("des minutes au-delà de 59 sont refusées", () => {
  assertThrows(() => HeureDeLHorloge.lire("3:60"), LeconMalFormee);
});

Deno.test("des secondes au-delà de 59 sont refusées", () => {
  assertThrows(() => HeureDeLHorloge.lire("3:15:60"), LeconMalFormee);
});

Deno.test("la position sur le cadran compte les minutes depuis 12 heures", () => {
  assertEquals(HeureDeLHorloge.lire("7:45").surLeCadran(), 465);
});

Deno.test("midi et minuit sont à la même position sur le cadran", () => {
  assertEquals(HeureDeLHorloge.lire("0:00").surLeCadran(), 0);
  assertEquals(HeureDeLHorloge.lire("12:00").surLeCadran(), 0);
});

Deno.test("3 h et 15 h sont égales sur le cadran", () => {
  const troisHeures = HeureDeLHorloge.lire("3:00");

  assert(troisHeures.egaleSurLeCadran(HeureDeLHorloge.lire("15:00")));
});

Deno.test("3 h et 3 h 30 ne sont pas égales sur le cadran", () => {
  const troisHeures = HeureDeLHorloge.lire("3:00");

  assertFalse(troisHeures.egaleSurLeCadran(HeureDeLHorloge.lire("3:30")));
});

Deno.test("une heure pile s'écrit « 3 h »", () => {
  assertEquals(HeureDeLHorloge.lire("3:00").ecriture(), "3 h");
});

Deno.test("une heure avec minutes s'écrit « 15 h 30 »", () => {
  assertEquals(HeureDeLHorloge.lire("15:30").ecriture(), "15 h 30");
  assertEquals(HeureDeLHorloge.lire("7:45").ecriture(), "7 h 45");
});

Deno.test("une heure avec secondes s'écrit « 6 h 18 min 20 s »", () => {
  assertEquals(
    HeureDeLHorloge.lire("6:18:20").ecriture(),
    "6 h 18 min 20 s",
  );
});

Deno.test("deux heures de mêmes heures, minutes et secondes sont égales", () => {
  assert(HeureDeLHorloge.lire("14:30").egale(HeureDeLHorloge.lire("14:30")));
});

Deno.test("3 h et 15 h ne sont pas égales par valeur", () => {
  assertFalse(HeureDeLHorloge.lire("3:00").egale(HeureDeLHorloge.lire("15:00")));
});

Deno.test("les secondes comptent sur le cadran", () => {
  const sixHeuresDixHuitVingt = HeureDeLHorloge.lire("6:18:20");

  assertFalse(sixHeuresDixHuitVingt.egaleSurLeCadran(HeureDeLHorloge.lire("6:18:30")));
  assert(sixHeuresDixHuitVingt.egaleSurLeCadran(HeureDeLHorloge.lire("18:18:20")));
});

Deno.test("minuit est 0:00, avec ou sans secondes, et nulle autre heure", () => {
  assert(HeureDeLHorloge.lire("0:00").estMinuit());
  assert(HeureDeLHorloge.lire("0:00:00").estMinuit());
  for (const ecriture of ["12:00", "0:30", "0:00:05"]) {
    assertFalse(HeureDeLHorloge.lire(ecriture).estMinuit());
  }
});

Deno.test("l'affichage digital écrit l'heure et les minutes sur deux chiffres, sans zéro devant l'heure", () => {
  assertEquals(HeureDeLHorloge.lire("2:15").affichageDigital(), "2 : 15");
  assertEquals(HeureDeLHorloge.lire("14:15").affichageDigital(), "14 : 15");
});

Deno.test("l'affichage digital ajoute les secondes quand il y en a", () => {
  assertEquals(HeureDeLHorloge.lire("6:18:20").affichageDigital(), "6 : 18 : 20");
});
