import { assertEquals } from "@std/assert";
import { leconAcquiseParLaSeance, leconsAcquises } from "./lecons-acquises.ts";

Deno.test("une leçon à 1 étoile n'est pas acquise", () => {
  const meilleures = new Map([["lecon-a", 1]]);

  assertEquals(leconsAcquises(meilleures).has("lecon-a"), false);
});

Deno.test("une leçon à 2 ou 3 étoiles est acquise", () => {
  const meilleures = new Map([["lecon-a", 2], ["lecon-b", 3]]);

  assertEquals(leconsAcquises(meilleures), new Set(["lecon-a", "lecon-b"]));
});

Deno.test("sans aucune meilleure étoile, aucune leçon n'est acquise", () => {
  assertEquals(leconsAcquises(new Map()), new Set());
});

Deno.test("une séance à 2 étoiles sur une leçon jamais jouée la fait acquérir", () => {
  assertEquals(leconAcquiseParLaSeance(new Map(), "lecon-a", 2), "lecon-a");
});

Deno.test("une séance à 3 étoiles sur une leçon à 1 étoile la fait acquérir", () => {
  const avant = new Map([["lecon-a", 1]]);

  assertEquals(leconAcquiseParLaSeance(avant, "lecon-a", 3), "lecon-a");
});

Deno.test("une leçon déjà acquise à 2 étoiles n'est pas acquise de nouveau par une séance à 3 étoiles", () => {
  const avant = new Map([["lecon-a", 2]]);

  assertEquals(leconAcquiseParLaSeance(avant, "lecon-a", 3), undefined);
});

Deno.test("une leçon déjà acquise à 3 étoiles n'est pas acquise de nouveau par une séance à 2 étoiles", () => {
  const avant = new Map([["lecon-a", 3]]);

  assertEquals(leconAcquiseParLaSeance(avant, "lecon-a", 2), undefined);
});

Deno.test("une séance à 1 étoile sur une leçon jamais jouée ne la fait pas acquérir", () => {
  assertEquals(leconAcquiseParLaSeance(new Map(), "lecon-a", 1), undefined);
});

Deno.test("une séance de fluence seule, sans étoiles, ne fait acquérir aucune leçon", () => {
  assertEquals(leconAcquiseParLaSeance(new Map(), "lecon-a", undefined), undefined);
});

Deno.test("une autre leçon déjà acquise ne change pas l'acquisition de la leçon jouée", () => {
  const avant = new Map([["lecon-b", 3]]);

  assertEquals(leconAcquiseParLaSeance(avant, "lecon-a", 2), "lecon-a");
});
