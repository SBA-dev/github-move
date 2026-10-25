import { assertEquals } from "@std/assert";
import { lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { Etoiles } from "./etoiles.ts";
import { toutesLesLecons } from "./toutes-les-lecons.ts";

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

Deno.test("« Toutes les leçons » montre les leçons de la classe de l'enfant, de toutes les matières, rangées par matière du Catalogue puis par ordre, avec leur état du parcours", () => {
  const entrees = {
    lecons: [
      lecon("ma-ce1-additions", "maths", "CE1", 1),
      lecon("fr-ce1-syllabes", "francais", "CE1", 20),
      lecon("fr-ce1-sons", "francais", "CE1", 10),
      lecon("fr-ce1-lettres", "francais", "CE1", 10),
      lecon("fr-cp-voyelles", "francais", "CP", 5),
      lecon("fr-ce2-accords", "francais", "CE2", 5),
    ],
    niveau: Niveau.de("CE1"),
    meilleuresEtoiles: new Map([["fr-ce1-sons", Etoiles.de(2)]]),
  };

  const { lecons } = toutesLesLecons(entrees, {});

  assertEquals(
    lecons.map(({ lecon, matiere, niveau, titre, etat }) => ({ lecon, matiere: matiere.code, niveau, titre, etat })),
    [
      {
        lecon: "fr-ce1-lettres",
        matiere: "francais",
        niveau: Niveau.de("CE1"),
        titre: "Titre de fr-ce1-lettres",
        etat: { genre: "prochaine" },
      },
      {
        lecon: "fr-ce1-sons",
        matiere: "francais",
        niveau: Niveau.de("CE1"),
        titre: "Titre de fr-ce1-sons",
        etat: { genre: "reussie", etoiles: Etoiles.de(2) },
      },
      {
        lecon: "fr-ce1-syllabes",
        matiere: "francais",
        niveau: Niveau.de("CE1"),
        titre: "Titre de fr-ce1-syllabes",
        etat: { genre: "aDecouvrir" },
      },
      {
        lecon: "ma-ce1-additions",
        matiere: "maths",
        niveau: Niveau.de("CE1"),
        titre: "Titre de ma-ce1-additions",
        etat: { genre: "prochaine" },
      },
    ],
  );
});
