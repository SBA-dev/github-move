import { assertEquals, assertThrows } from "@std/assert";
import { TenueInconnue, TenueNonRecue, porterUneTenue } from "./tenue-portee.ts";
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
