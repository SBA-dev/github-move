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

function leconDeBarresAuNiveau(id: string, niveau: "CP" | "CE1"): Lecon {
  return lireLecon({
    id,
    matiere: "maths",
    niveau,
    titre: "Les problèmes en barres",
    ordre: 1,
    programme,
    lecon: [],
    exercices: [{
      type: "barres",
      items: [
        {
          enonce: "Au marché, j'achète 4 pommes rouges et 2 pommes vertes. Combien ai-je de pommes ?",
          parties: [4, 2],
          tout: null,
          phrase: "J'ai {r} pommes.",
        },
        {
          enonce: "Lina a 9 crayons, dont 6 rouges. Combien de bleus ?",
          parties: [6, null],
          tout: 9,
          aide: "On connaît le tout, 9, et une partie, 6. On cherche l'autre partie.",
        },
        { type: "parts", enonce: "4 sacs de 6 billes. Combien de billes en tout ?", nb: 4, valeur: 6, total: null },
      ],
    }],
  });
}

export function leconDeBarresAuCP(): Lecon {
  return leconDeBarresAuNiveau("ma-cp-barres", "CP");
}

export function leconDeBarresAuCE1(): Lecon {
  return leconDeBarresAuNiveau("ma-ce1-barres", "CE1");
}
