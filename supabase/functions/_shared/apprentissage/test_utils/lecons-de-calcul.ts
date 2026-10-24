import { type Lecon, lireLecon } from "../../catalogue/domain/index.ts";

const programme = { section: "c2-test", citation: "Citation de test." };

function leconDeCalculAvecOperations(id: string, niveau: "CP" | "CE1", operations: object[]): Lecon {
  return lireLecon({
    id,
    matiere: "maths",
    niveau,
    titre: "Du calcul",
    ordre: 1,
    programme,
    lecon: [],
    exercices: [{ type: "calcul", operations }],
  });
}

export function leconDeSoustractionsAuCE1(): Lecon {
  return leconDeCalculAvecOperations("ma-ce1-soustractions", "CE1", [{ q: "12 − 5", r: 7 }, { q: "9 − 4", r: 5 }]);
}

export function leconLesDoublesAuCP(): Lecon {
  return leconDeCalculAvecOperations("ma-cp-les-doubles", "CP", [{ q: "2 + 2", r: 4 }, { q: "3 + 3", r: 6 }]);
}

function leconDeCalculTire(id: string, generateur: object): Lecon {
  return lireLecon({
    id,
    matiere: "maths",
    niveau: "CE1",
    titre: "Du calcul tiré",
    ordre: 1,
    programme,
    lecon: [],
    exercices: [{ type: "calcul", generateur }],
  });
}

export function leconDAdditionsTireesDe1a5AuCE1(): Lecon {
  return leconDeCalculTire("ma-ce1-additions-tirees", { op: "+", a: [1, 5], b: [1, 5], combien: 3 });
}

export function leconDUneAdditionTireeDe1a20AuCE1(): Lecon {
  return leconDeCalculTire("ma-ce1-addition-tiree-large", { op: "+", a: [1, 20], b: [1, 20], combien: 1 });
}
