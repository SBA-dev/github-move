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

Deno.test("« Toutes les leçons » montre, après la classe de l'enfant, les leçons de la classe juste au-dessus dans une matière dont il a réussi toutes les leçons de sa classe, et dans cette matière seulement", () => {
  const entrees = {
    lecons: [
      lecon("fr-ce1-sons", "francais", "CE1", 1),
      lecon("ma-ce1-additions", "maths", "CE1", 1),
      lecon("ma-ce1-soustractions", "maths", "CE1", 2),
      lecon("ma-ce2-tables", "maths", "CE2", 2),
      lecon("ma-ce2-nombres", "maths", "CE2", 1),
      lecon("ma-cm1-fractions", "maths", "CM1", 1),
      lecon("fr-ce2-accords", "francais", "CE2", 1),
      lecon("emc-ce2-regles", "emc", "CE2", 1),
    ],
    niveau: Niveau.de("CE1"),
    meilleuresEtoiles: new Map([["ma-ce1-additions", Etoiles.de(1)]]),
    leconsReussiesAuTestDeDepart: new Set(["ma-ce1-soustractions"]),
  };

  const { lecons } = toutesLesLecons(entrees, {});

  assertEquals(
    lecons.map(({ lecon, niveau, etat }) => ({ lecon, niveau, etat })),
    [
      { lecon: "fr-ce1-sons", niveau: Niveau.de("CE1"), etat: { genre: "prochaine" } },
      { lecon: "ma-ce1-additions", niveau: Niveau.de("CE1"), etat: { genre: "reussie", etoiles: Etoiles.de(1) } },
      { lecon: "ma-ce1-soustractions", niveau: Niveau.de("CE1"), etat: { genre: "reussieAuTestDeDepart" } },
      { lecon: "ma-ce2-nombres", niveau: Niveau.de("CE2"), etat: { genre: "aDecouvrir" } },
      { lecon: "ma-ce2-tables", niveau: Niveau.de("CE2"), etat: { genre: "aDecouvrir" } },
    ],
  );
});
