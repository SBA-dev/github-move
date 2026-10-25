import { assertEquals } from "@std/assert";
import { leconsNouvellementReussies } from "./lecons-nouvellement-reussies.ts";

Deno.test("une leçon déjà réussie en séance n'est pas comptée parmi les leçons nouvellement réussies", () => {
  const reussiesAuTest = new Set(["fr-ce1-a", "fr-ce1-b", "fr-ce1-c"]);
  const dejaReussies = new Set(["fr-ce1-b"]);

  const nouvelles = leconsNouvellementReussies(reussiesAuTest, dejaReussies);

  assertEquals([...nouvelles].sort(), ["fr-ce1-a", "fr-ce1-c"]);
});

Deno.test("une leçon déjà réussie à un test de départ précédent n'est pas comptée parmi les leçons nouvellement réussies", () => {
  const reussiesAuTest = new Set(["fr-ce1-a", "fr-ce1-b"]);
  const dejaReussiesAuTestPrecedent = new Set(["fr-ce1-a"]);

  const nouvelles = leconsNouvellementReussies(reussiesAuTest, dejaReussiesAuTestPrecedent);

  assertEquals([...nouvelles], ["fr-ce1-b"]);
});
