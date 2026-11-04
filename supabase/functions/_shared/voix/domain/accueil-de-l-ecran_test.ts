import { assertEquals } from "@std/assert";
import { AccueilDeLEcran } from "./accueil-de-l-ecran.ts";

Deno.test("l'accueil d'un écran peut être dit tant que l'enfant n'a demandé aucune lecture", () => {
  const accueil = new AccueilDeLEcran();

  assertEquals(accueil.peutEtreDit(), true);
});

Deno.test("l'accueil d'un écran n'est pas dit quand l'enfant a déjà demandé une lecture", () => {
  const accueil = new AccueilDeLEcran();
  accueil.noterUneLectureDemandeeParLEnfant();

  assertEquals(accueil.peutEtreDit(), false);
});
