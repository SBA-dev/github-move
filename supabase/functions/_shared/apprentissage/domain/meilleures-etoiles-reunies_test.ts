import { assertEquals } from "@std/assert";
import { Etoiles } from "./etoiles.ts";
import { meilleuresEtoilesReunies } from "./meilleures-etoiles-reunies.ts";

Deno.test("pour une leçon présente dans les deux sources, les meilleures étoiles l'emportent", () => {
  const duServeur = new Map([["lecon-a", Etoiles.de(1)], ["lecon-b", Etoiles.de(3)]]);
  const duNavigateur = new Map([["lecon-a", Etoiles.de(2)], ["lecon-b", Etoiles.de(1)]]);

  const reunies = meilleuresEtoilesReunies(duServeur, duNavigateur);

  assertEquals(reunies.get("lecon-a")?.nombre, 2);
  assertEquals(reunies.get("lecon-b")?.nombre, 3);
});

Deno.test("une leçon présente d'un seul côté garde ses étoiles", () => {
  const duServeur = new Map([["lecon-a", Etoiles.de(2)]]);
  const duNavigateur = new Map([["lecon-b", Etoiles.de(1)]]);

  const reunies = meilleuresEtoilesReunies(duServeur, duNavigateur);

  assertEquals(reunies.get("lecon-a")?.nombre, 2);
  assertEquals(reunies.get("lecon-b")?.nombre, 1);
});

Deno.test("réunir les meilleures étoiles ne modifie aucune des deux sources", () => {
  const duServeur = new Map([["lecon-a", Etoiles.de(1)]]);
  const duNavigateur = new Map([["lecon-a", Etoiles.de(3)], ["lecon-b", Etoiles.de(2)]]);

  meilleuresEtoilesReunies(duServeur, duNavigateur);

  assertEquals([...duServeur].map(([id, e]) => [id, e.nombre]), [["lecon-a", 1]]);
  assertEquals([...duNavigateur].map(([id, e]) => [id, e.nombre]), [["lecon-a", 3], ["lecon-b", 2]]);
});
