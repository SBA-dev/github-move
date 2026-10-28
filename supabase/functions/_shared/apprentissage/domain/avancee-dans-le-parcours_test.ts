import { assertEquals } from "@std/assert";
import { lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { avanceeDansLeParcours } from "./avancee-dans-le-parcours.ts";
import { parcoursDeLaMatiere } from "./parcours.ts";

// API attendue : AvanceeDansLeParcours = { depuis: LeconId; jusqua: { genre: "lecon"; lecon: LeconId } | { genre: "finDuParcours" } }

function lecon(id: string, ordre: number): Lecon {
  return lireLecon({
    id,
    matiere: "francais",
    niveau: "CE1",
    titre: `Titre de ${id}`,
    ordre,
    programme: { section: "section", citation: "citation" },
    exercices: [],
  });
}

const [a, b] = [lecon("fr-ce1-a", 1), lecon("fr-ce1-b", 2)];

Deno.test("sans prochaine leçon connue, il n'y a pas d'avancée dans le parcours, même s'il reste une leçon à découvrir", () => {
  const parcours = parcoursDeLaMatiere(
    { lecons: [a, b], niveau: Niveau.de("CE1"), meilleuresEtoiles: new Map() },
    a.matiere,
  );

  assertEquals(avanceeDansLeParcours(undefined, parcours), undefined);
});
