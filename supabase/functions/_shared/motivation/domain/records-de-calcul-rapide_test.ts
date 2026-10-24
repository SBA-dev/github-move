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

Deno.test("une fluence sans titre a pour libellé le titre de la leçon", () => {
  const multiplicationSansTitre = {
    type: "fluence",
    duree: 60,
    generateur: { op: "×", a: [1, 10], b: [1, 10] },
  };
  const lecons = [leconDeCalculAvec(multiplicationSansTitre)];
  const records: RecordDuProfil[] = [{ lecon: "math-ce1-multiplications", exercice: "×", meilleurScore: 7 }];

  const libelles = pastillesDesRecords(records, lecons).map((pastille) => pastille.libelle);

  assertEquals(libelles, ["Les multiplications"]);
});

Deno.test("un record dont la leçon a disparu de la bibliothèque garde sa pastille, libellée par sa clé", () => {
  const records: RecordDuProfil[] = [
    { lecon: "math-ce1-disparue", exercice: "Calcul rapide : les anciens doubles", meilleurScore: 5 },
  ];

  assertEquals(pastillesDesRecords(records, [leconDeCalculAvec(tablesDe3Et4)]), [
    {
      lecon: "math-ce1-disparue",
      exercice: "Calcul rapide : les anciens doubles",
      libelle: "Calcul rapide : les anciens doubles",
      meilleurScore: 5,
    },
  ]);
});

Deno.test("un record dont l'exercice a été renommé garde sa pastille, libellée par sa clé", () => {
  const records: RecordDuProfil[] = [
    { lecon: "math-ce1-multiplications", exercice: "Calcul rapide : les anciens doubles", meilleurScore: 5 },
  ];

  const libelles = pastillesDesRecords(records, [leconDeCalculAvec(lesDoubles)]).map((pastille) => pastille.libelle);

  assertEquals(libelles, ["Calcul rapide : les anciens doubles"]);
});

function leconDe(id: string, niveau: string, ordre: number, ...exercices: readonly unknown[]): Lecon {
  return lireLecon({
    id,
    matiere: "maths",
    niveau,
    titre: id,
    ordre,
    programme: {
      section: "c2-mathematiques-ce1-calculer-avec-des-nombres-entiers",
      citation: "Mémoriser des faits numériques.",
    },
    lecon: [],
    exercices,
  });
}

function fluenceTitree(titre: string) {
  return { type: "fluence", titre, duree: 60, generateur: { op: "×", a: [1, 10], b: [1, 10] } };
}

function recordSur(lecon: string, exercice: string): RecordDuProfil {
  return { lecon, exercice, meilleurScore: 10 };
}

function clesDesPastilles(records: readonly RecordDuProfil[], lecons: readonly Lecon[]): string[] {
  return pastillesDesRecords(records, lecons).map((pastille) => `${pastille.lecon}/${pastille.exercice}`);
}

Deno.test("les pastilles de tous les niveaux suivent l'ordre du parcours : d'abord le niveau, quel que soit l'ordre des records", () => {
  const lecons = [
    leconDe("math-cm2-fractions", "CM2", 1, fluenceTitree("Calcul rapide : fractions")),
    leconDe("math-ce2-tables", "CE2", 1, fluenceTitree("Calcul rapide : tables de 3 et 4")),
    leconDe("math-ce1-tables", "CE1", 1, fluenceTitree("Calcul rapide : tables de 2 à 5")),
  ];
  const records = [
    recordSur("math-ce2-tables", "Calcul rapide : tables de 3 et 4"),
    recordSur("math-cm2-fractions", "Calcul rapide : fractions"),
    recordSur("math-ce1-tables", "Calcul rapide : tables de 2 à 5"),
  ];

  assertEquals(clesDesPastilles(records, lecons), [
    "math-ce1-tables/Calcul rapide : tables de 2 à 5",
    "math-ce2-tables/Calcul rapide : tables de 3 et 4",
    "math-cm2-fractions/Calcul rapide : fractions",
  ]);
});

Deno.test("deux leçons d'un même niveau ont leurs pastilles dans l'ordre des leçons, pas dans l'ordre des records", () => {
  const lecons = [
    leconDe("math-ce1-a", "CE1", 5, fluenceTitree("Calcul rapide : A")),
    leconDe("math-ce1-b", "CE1", 2, fluenceTitree("Calcul rapide : B")),
  ];
  const records = [recordSur("math-ce1-a", "Calcul rapide : A"), recordSur("math-ce1-b", "Calcul rapide : B")];

  assertEquals(clesDesPastilles(records, lecons), [
    "math-ce1-b/Calcul rapide : B",
    "math-ce1-a/Calcul rapide : A",
  ]);
});

Deno.test("deux fluences d'une même leçon ont leurs pastilles dans l'ordre de la leçon, pas dans l'ordre des records", () => {
  const lecons = [
    leconDe("math-ce1-tables", "CE1", 1, fluenceTitree("Calcul rapide : A"), fluenceTitree("Calcul rapide : B")),
  ];
  const records = [
    recordSur("math-ce1-tables", "Calcul rapide : B"),
    recordSur("math-ce1-tables", "Calcul rapide : A"),
  ];

  assertEquals(clesDesPastilles(records, lecons), [
    "math-ce1-tables/Calcul rapide : A",
    "math-ce1-tables/Calcul rapide : B",
  ]);
});

Deno.test("les pastilles orphelines (leçon ou exercice disparu) viennent après les autres, dans l'ordre de leurs clés", () => {
  const lecons = [leconDe("math-ce1-tables", "CE1", 1, fluenceTitree("Calcul rapide : A"))];
  const records = [
    recordSur("math-zz-disparue", "Calcul rapide : Z"),
    recordSur("math-aa-disparue", "Calcul rapide : Y"),
    recordSur("math-ce1-tables", "Calcul rapide : renommee"),
    recordSur("math-ce1-tables", "Calcul rapide : A"),
  ];

  assertEquals(clesDesPastilles(records, lecons), [
    "math-ce1-tables/Calcul rapide : A",
    "math-aa-disparue/Calcul rapide : Y",
    "math-ce1-tables/Calcul rapide : renommee",
    "math-zz-disparue/Calcul rapide : Z",
  ]);
});
