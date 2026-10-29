import { assertEquals } from "@std/assert";
import { tenueAMontrer } from "./tenue-portee.ts";
import { tenuesDe } from "./tenues.ts";

Deno.test("sans tenue portée, le personnage guide ne porte aucune tenue", () => {
  const tenue = tenueAMontrer(undefined, tenuesDe(37));

  assertEquals(tenue, undefined);
});

Deno.test("une tenue portée inconnue des paliers est ignorée, sans erreur", () => {
  const tenue = tenueAMontrer("chapeau-imaginaire", tenuesDe(37));

  assertEquals(tenue, undefined);
});

Deno.test("étoiles lues : la tenue portée et reçue est montrée avec son nom", () => {
  const tenue = tenueAMontrer("echarpe-rayee", tenuesDe(12));

  assertEquals(tenue, { cle: "echarpe-rayee", nom: "une écharpe rayée" });
});

Deno.test("étoiles lues : une tenue portée mais pas reçue n'est pas montrée", () => {
  const tenue = tenueAMontrer("bottes-de-pluie", tenuesDe(5));

  assertEquals(tenue, undefined);
});

Deno.test("étoiles non lues : la tenue portée connue est montrée telle quelle", () => {
  const tenue = tenueAMontrer("noeud-papillon", undefined);

  assertEquals(tenue, { cle: "noeud-papillon", nom: "un nœud papillon" });
});

Deno.test("étoiles non lues : une tenue portée inconnue des paliers n'est pas montrée", () => {
  const tenue = tenueAMontrer("chapeau-imaginaire", undefined);

  assertEquals(tenue, undefined);
});
