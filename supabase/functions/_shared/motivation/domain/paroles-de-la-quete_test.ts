import { assertEquals } from "@std/assert";
import type { QueteDuJour } from "./quete-du-jour.ts";
import { propositionDeLaQueteDuJour } from "./paroles-de-la-quete.ts";

Deno.test("le personnage guide propose la quête du jour avec les paroles validées", () => {
  const revision = (n: number): QueteDuJour => ({ genre: "revision", nombreDeQuestionsDues: n });
  const lecon: QueteDuJour = { genre: "lecon", lecon: "le-son-in", titre: "Le son in" };

  assertEquals(
    propositionDeLaQueteDuJour(revision(1)),
    "Ta quête du jour : réviser 1 petite erreur des jours passés. On y va ?",
  );
  assertEquals(
    propositionDeLaQueteDuJour(revision(3)),
    "Ta quête du jour : réviser 3 petites erreurs des jours passés. On y va ?",
  );
  assertEquals(
    propositionDeLaQueteDuJour(lecon),
    "Ta quête du jour : la leçon « Le son in ». On y va ?",
  );
  assertEquals(
    propositionDeLaQueteDuJour({ genre: "accomplie", quete: "revision" }),
    "Ta quête du jour est accomplie.",
  );
  assertEquals(
    propositionDeLaQueteDuJour({ genre: "accomplie", quete: "lecon" }),
    "Ta quête du jour est accomplie.",
  );
  assertEquals(propositionDeLaQueteDuJour({ genre: "aucune" }), undefined);
  assertEquals(propositionDeLaQueteDuJour({ genre: "sansQuete" }), undefined);
});
