import { assertEquals } from "@std/assert";
import { lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { Etoiles } from "./etoiles.ts";
import { leconSuivanteDansLeParcours } from "./lecon-suivante-dans-le-parcours.ts";

function lecon(id: string, matiere: string, ordre: number): Lecon {
  return lireLecon({
    id,
    matiere,
    niveau: "CE1",
    titre: `Titre de ${id}`,
    ordre,
    programme: { section: "section", citation: "citation" },
    exercices: [],
  });
}

const [a, b, c, d] = ["fr-ce1-a", "fr-ce1-b", "fr-ce1-c", "fr-ce1-d"].map((id, index) =>
  lecon(id, "francais", index + 1)
);
const mathsDuCE1 = lecon("ma-ce1-additions", "maths", 1);

function entrees(reussies: string[]) {
  return {
    lecons: [a, b, c, d, mathsDuCE1],
    niveau: Niveau.de("CE1"),
    meilleuresEtoiles: new Map(reussies.map((id) => [id, Etoiles.de(1)] as [string, Etoiles])),
  };
}

Deno.test("la leçon suivante est la leçon placée juste après la leçon jouée quand elle n'est pas réussie", () => {
  assertEquals(leconSuivanteDansLeParcours(entrees([]), b.id), c.id);
});

Deno.test("la leçon suivante saute les leçons d'après déjà réussies", () => {
  assertEquals(leconSuivanteDansLeParcours(entrees([c.id]), b.id), d.id);
});

Deno.test("une leçon placée avant la leçon jouée et non réussie n'est jamais proposée comme suivante", () => {
  assertEquals(leconSuivanteDansLeParcours(entrees([]), c.id), d.id);
});

Deno.test("après la dernière leçon du parcours, il n'y a pas de leçon suivante, même si une autre matière a des leçons", () => {
  assertEquals(leconSuivanteDansLeParcours(entrees([]), d.id), undefined);
});
