import { assertEquals } from "@std/assert";
import { type Lecon, lireLecon } from "../../catalogue/domain/index.ts";
import { pastillesDesRecords, type RecordDuProfil } from "./records-de-calcul-rapide.ts";

const tablesDe3Et4 = {
  type: "fluence",
  titre: "Calcul rapide : tables de 3 et 4",
  duree: 60,
  generateur: { op: "×", a: [3, 4], b: [1, 10] },
};

const lesDoubles = {
  type: "fluence",
  titre: "Calcul rapide : les doubles",
  duree: 45,
  generateur: { op: "×", a: [1, 10], b: [2, 2] },
};

function leconDeCalculAvec(...exercices: readonly unknown[]): Lecon {
  return lireLecon({
    id: "math-ce1-multiplications",
    matiere: "maths",
    niveau: "CE1",
    titre: "Les multiplications",
    ordre: 3,
    programme: {
      section: "c2-mathematiques-ce1-calculer-avec-des-nombres-entiers",
      citation: "Mémoriser des faits numériques.",
    },
    lecon: [],
    exercices,
  });
}

Deno.test("sans record, il n'y a aucune pastille", () => {
  const lecons = [leconDeCalculAvec(tablesDe3Et4)];

  assertEquals(pastillesDesRecords([], lecons), []);
});

Deno.test("un record sur un exercice de fluence donne une pastille au titre de l'exercice et au meilleur score", () => {
  const lecons = [leconDeCalculAvec(tablesDe3Et4)];
  const records: RecordDuProfil[] = [
    { lecon: "math-ce1-multiplications", exercice: "Calcul rapide : tables de 3 et 4", meilleurScore: 12 },
  ];

  assertEquals(pastillesDesRecords(records, lecons), [
    {
      lecon: "math-ce1-multiplications",
      exercice: "Calcul rapide : tables de 3 et 4",
      libelle: "Calcul rapide : tables de 3 et 4",
      meilleurScore: 12,
    },
  ]);
});

Deno.test("deux fluences titrées différemment dans une même leçon ont deux pastilles aux libellés différents", () => {
  const lecons = [leconDeCalculAvec(tablesDe3Et4, lesDoubles)];
  const records: RecordDuProfil[] = [
    { lecon: "math-ce1-multiplications", exercice: "Calcul rapide : tables de 3 et 4", meilleurScore: 12 },
    { lecon: "math-ce1-multiplications", exercice: "Calcul rapide : les doubles", meilleurScore: 9 },
  ];

  const libelles = pastillesDesRecords(records, lecons).map((pastille) => pastille.libelle);

  assertEquals(libelles.toSorted(), ["Calcul rapide : les doubles", "Calcul rapide : tables de 3 et 4"]);
});
