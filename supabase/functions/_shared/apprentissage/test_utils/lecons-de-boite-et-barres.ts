import { type Lecon, lireLecon } from "../../catalogue/domain/index.ts";

const programme = { section: "c2-test", citation: "Citation de test." };

function leconDeBoiteAuNiveau(id: string, niveau: "CP" | "CE1"): Lecon {
  return lireLecon({
    id,
    matiere: "maths",
    niveau,
    titre: "La boîte à jetons",
    ordre: 1,
    programme,
    lecon: [],
    exercices: [{
      type: "boite",
      items: [{ a: 4, op: "+", b: 3 }, { a: 15, op: "+", b: 9 }, { a: 8, op: "-", b: 3 }],
    }],
  });
}

export function leconDeBoiteAuCP(): Lecon {
  return leconDeBoiteAuNiveau("ma-cp-boite", "CP");
}

export function leconDeBoiteAuCE1(): Lecon {
  return leconDeBoiteAuNiveau("ma-ce1-boite", "CE1");
}
