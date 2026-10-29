import { assertEquals, assertThrows } from "@std/assert";
import { porterUneTenue, retirerLaTenue, TenueInconnue, TenueNonRecue } from "./tenue-portee.ts";
import { tenuesDe } from "./tenues.ts";

Deno.test("l'enfant porte une tenue qu'il a reçue", () => {
  const etat = tenuesDe(5);

  const tenuePortee = porterUneTenue(etat, "echarpe-rayee");

  assertEquals(tenuePortee, "echarpe-rayee");
});

Deno.test("porter une autre tenue reçue remplace la tenue portée", () => {
  const etat = tenuesDe(12);

  const tenuePortee = porterUneTenue(etat, "noeud-papillon");

  assertEquals(tenuePortee, "noeud-papillon");
});

Deno.test("une tenue inconnue des paliers ne peut pas être portée", () => {
  const etat = tenuesDe(37);

  assertThrows(() => porterUneTenue(etat, "chapeau-imaginaire"), TenueInconnue);
});

Deno.test("une tenue pas encore reçue ne peut pas être portée", () => {
  const etat = tenuesDe(5);

  assertThrows(() => porterUneTenue(etat, "bottes-de-pluie"), TenueNonRecue);
});

Deno.test("l'enfant peut retirer la tenue : le personnage guide ne porte plus rien", () => {
  const tenuePortee = retirerLaTenue();

  assertEquals(tenuePortee, undefined);
});

Deno.test("une tenue retirée reste reçue et peut être portée à nouveau", () => {
  const etat = tenuesDe(5);
  const avant = tenuesDe(5);
  porterUneTenue(etat, "echarpe-rayee");

  retirerLaTenue();

  assertEquals(etat, avant);
  assertEquals(porterUneTenue(etat, "echarpe-rayee"), "echarpe-rayee");
});
