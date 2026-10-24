import { assertEquals } from "@std/assert";
import { lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { parcoursDeLaMatiere } from "./parcours.ts";

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

const syllabes = lecon("fr-ce1-syllabes", "francais", "CE1", 20);
const sons = lecon("fr-ce1-sons", "francais", "CE1", 10);
const lettres = lecon("fr-ce1-lettres", "francais", "CE1", 10);
const francaisDuCP = lecon("fr-cp-sons", "francais", "CP", 5);
const francaisDuCE2 = lecon("fr-ce2-accords", "francais", "CE2", 5);
const mathsDuCE1 = lecon("ma-ce1-additions", "maths", "CE1", 1);

Deno.test("le parcours de français d'un enfant de CE1 ne contient que les leçons de français du CE1, dans l'ordre, chacune avec sa place", () => {
  const entrees = {
    lecons: [syllabes, mathsDuCE1, francaisDuCE2, sons, francaisDuCP, lettres],
    niveau: Niveau.de("CE1"),
    meilleuresEtoiles: new Map(),
  };

  const parcours = parcoursDeLaMatiere(entrees, syllabes.matiere);

  assertEquals(
    parcours.lecons.map(({ lecon, place }) => [lecon, place]),
    [["fr-ce1-lettres", 1], ["fr-ce1-sons", 2], ["fr-ce1-syllabes", 3]],
  );
});
