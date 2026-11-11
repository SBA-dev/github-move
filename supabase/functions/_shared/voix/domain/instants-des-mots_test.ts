import { assertEquals } from "@std/assert";
import { instantsDesMots } from "./instants-des-mots.ts";

Deno.test("un mot seul est surligné dès le début de la phrase", () => {
  assertEquals(instantsDesMots("bonjour", 1000), [{ position: 0, debutMs: 0 }]);
});

Deno.test("la position d'un mot est son index de caractère dans la phrase, espaces multiples compris", () => {
  const instants = instantsDesMots("le  chat   dort", 3000);

  assertEquals(instants.map((i) => i.position), [0, 4, 11]);
});

Deno.test("les débuts en millisecondes croissent, le premier à 0, tous avant la fin de la lecture", () => {
  const instants = instantsDesMots("le petit chat boit du lait", 2400);
  const debuts = instants.map((i) => i.debutMs);

  assertEquals(debuts[0], 0);
  assertEquals(debuts.every((d, i) => i === 0 || d > debuts[i - 1]), true);
  assertEquals(debuts.every((d) => d < 2400), true);
});

Deno.test("la durée est répartie au prorata des caractères : « chat » commence à 2/6 de 1 000 ms, arrondi à l'entier inférieur", () => {
  assertEquals(instantsDesMots("le chat", 1000), [
    { position: 0, debutMs: 0 },
    { position: 3, debutMs: 333 },
  ]);
});

Deno.test("une phrase vide n'a aucun instant de mot", () => {
  assertEquals(instantsDesMots("   ", 1000), []);
});

Deno.test("une durée nulle n'a aucun instant de mot", () => {
  assertEquals(instantsDesMots("le chat", 0), []);
});
