import { assertEquals } from "@std/assert";
import { aUneVoixFrancaise, estUneLangueFrancaise } from "./langue-francaise.ts";
import type { VoixDisponible } from "./voix-disponible.ts";

const DENISE: VoixDisponible = { nom: "Denise (Natural)", langue: "fr-FR" };
const DANIEL: VoixDisponible = { nom: "Daniel", langue: "en-GB" };

Deno.test("une langue qui commence par fr est française, sans tenir compte de la casse", () => {
  const francaises = ["fr-FR", "fr-CA", "FR", "fr"];

  assertEquals(francaises.map(estUneLangueFrancaise), [true, true, true, true]);
});

Deno.test("une langue qui ne commence pas par fr n'est pas française", () => {
  assertEquals(estUneLangueFrancaise("en-GB"), false);
  assertEquals(estUneLangueFrancaise(""), false);
});

Deno.test("l'appareil a une voix française quand au moins une voix disponible est française", () => {
  assertEquals(aUneVoixFrancaise([DANIEL, DENISE]), true);
});

Deno.test("l'appareil n'a pas de voix française quand aucune voix disponible ne l'est", () => {
  assertEquals(aUneVoixFrancaise([DANIEL]), false);
  assertEquals(aUneVoixFrancaise([]), false);
});
