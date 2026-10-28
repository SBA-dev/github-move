import { assertEquals } from "@std/assert";
import { lireLecon, Niveau } from "../../catalogue/domain/index.ts";
import type { Lecon } from "../../catalogue/domain/index.ts";
import { avanceeDansLeParcours } from "./avancee-dans-le-parcours.ts";
import { Etoiles } from "./etoiles.ts";
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

const [a, b, c, d] = [lecon("fr-ce1-a", 1), lecon("fr-ce1-b", 2), lecon("fr-ce1-c", 3), lecon("fr-ce1-d", 4)];

Deno.test("sans prochaine leçon connue, il n'y a pas d'avancée dans le parcours, même s'il reste une leçon à découvrir", () => {
  const parcours = parcoursDeLaMatiere(
    { lecons: [a, b], niveau: Niveau.de("CE1"), meilleuresEtoiles: new Map() },
    a.matiere,
  );

  assertEquals(avanceeDansLeParcours(undefined, parcours), undefined);
});

Deno.test("quand la prochaine leçon connue est devenue réussie, l'avancée va de cette leçon jusqu'à la nouvelle prochaine leçon du parcours", () => {
  const parcours = parcoursDeLaMatiere(
    { lecons: [a, b, c], niveau: Niveau.de("CE1"), meilleuresEtoiles: new Map([[a.id, Etoiles.de(1)]]) },
    a.matiere,
  );

  assertEquals(avanceeDansLeParcours(a.id, parcours), { depuis: a.id, jusqua: { genre: "lecon", lecon: b.id } });
});

Deno.test("quand plusieurs leçons sont devenues réussies d'un coup, l'avancée saute de la prochaine leçon connue jusqu'à la nouvelle prochaine leçon", () => {
  const parcours = parcoursDeLaMatiere(
    {
      lecons: [a, b, c, d],
      niveau: Niveau.de("CE1"),
      meilleuresEtoiles: new Map([[a.id, Etoiles.de(1)], [b.id, Etoiles.de(2)], [c.id, Etoiles.de(1)]]),
    },
    a.matiere,
  );

  assertEquals(avanceeDansLeParcours(a.id, parcours), { depuis: a.id, jusqua: { genre: "lecon", lecon: d.id } });
});

Deno.test("quand la dernière leçon de la matière est réussie, l'avancée va jusqu'à la fin du parcours", () => {
  const parcours = parcoursDeLaMatiere(
    {
      lecons: [a, b, c],
      niveau: Niveau.de("CE1"),
      meilleuresEtoiles: new Map([[a.id, Etoiles.de(1)], [b.id, Etoiles.de(1)], [c.id, Etoiles.de(1)]]),
    },
    a.matiere,
  );

  assertEquals(avanceeDansLeParcours(c.id, parcours), { depuis: c.id, jusqua: { genre: "finDuParcours" } });
});
