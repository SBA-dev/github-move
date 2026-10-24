import { type Lecon, lireLecon } from "../../catalogue/domain/index.ts";

const programme = { section: "c2-test", citation: "Citation de test." };

const calculDesDoubles = {
  type: "calcul",
  titre: "Les doubles",
  operations: [{ q: "2 + 2", r: 4 }, { q: "3 + 3", r: 6 }],
};

const fluenceDesDoubles = {
  type: "fluence",
  titre: "Calcul rapide : les doubles",
  duree: 45,
  generateur: { op: "×", a: [1, 10], b: [2, 2] },
};

function leconAvec(id: string, exercices: object[]): Lecon {
  return lireLecon({
    id,
    matiere: "maths",
    niveau: "CP",
    titre: "Les doubles",
    ordre: 18,
    programme,
    lecon: [],
    exercices,
  });
}

export function leconLesDoublesAvecUneFluenceAuCP(): Lecon {
  return leconAvec("ma-cp-doubles", [calculDesDoubles, fluenceDesDoubles]);
}

export function leconDUneSeuleFluenceAuCP(): Lecon {
  return leconAvec("ma-cp-doubles-fluence", [fluenceDesDoubles]);
}
