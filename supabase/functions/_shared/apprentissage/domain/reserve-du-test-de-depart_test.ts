import { assertEquals } from "@std/assert";
import { lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { reserveDuTestDeDepart } from "./reserve-du-test-de-depart.ts";

function lecon(id: string, matiere: string, niveau: string, ordre: number): Lecon {
  return lireLecon({
    id,
    matiere,
    niveau,
    titre: `Titre de ${id}`,
    ordre,
    programme: { section: "section", citation: "citation" },
    exercices: [],
  });
}

const identifiants = (lecons: readonly Lecon[]) => lecons.map(({ id }) => id);

Deno.test("la réserve du test de départ ne contient que des leçons de français et de maths de la classe de l'enfant ou d'avant", () => {
  const lecons = [
    lecon("fr-ce2-futur", "francais", "CE2", 10),
    lecon("sc-cp-sens", "sciences", "CP", 10),
    lecon("ma-ce1-doubles", "maths", "CE1", 15),
    lecon("fr-cp-voyelles", "francais", "CP", 10),
    lecon("an-ce1-couleurs", "anglais", "CE1", 10),
  ];

  const reserve = reserveDuTestDeDepart(lecons, Niveau.de("CE1"));

  assertEquals(identifiants(reserve), ["fr-cp-voyelles", "ma-ce1-doubles"]);
});

Deno.test("la réserve du test de départ est triée par niveau, puis ordre, puis matière (français avant maths), puis identifiant", () => {
  const lecons = [
    lecon("ma-ce1-a", "maths", "CE1", 10),
    lecon("fr-ce1-b", "francais", "CE1", 10),
    lecon("fr-ce1-a", "francais", "CE1", 10),
    lecon("fr-ce1-tot", "francais", "CE1", 5),
    lecon("ma-cp-tard", "maths", "CP", 50),
  ];

  const reserve = reserveDuTestDeDepart(lecons, Niveau.de("CE1"));

  assertEquals(
    identifiants(reserve),
    ["ma-cp-tard", "fr-ce1-tot", "fr-ce1-a", "fr-ce1-b", "ma-ce1-a"],
  );
});
