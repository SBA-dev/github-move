import { assertEquals } from "@std/assert";
import { lireLecon } from "../lire-lecon.ts";

function leconAvec(exercice: unknown): Record<string, unknown> {
  return {
    id: "math-cp-barres",
    matiere: "maths",
    niveau: "CP",
    titre: "Les problèmes en barres",
    ordre: 4,
    programme: {
      section: "c2-mathematiques-cp-calculer-avec-des-nombres-entiers",
      citation: "Calculer mentalement.",
    },
    lecon: [],
    exercices: [exercice],
  };
}

function problemeEnBarres(item: unknown) {
  const lu = lireLecon(leconAvec({ type: "barres", items: [item] })).exercices[0];
  if (lu.type !== "barres") throw new Error("exercice « barres » attendu");
  return lu.items[0];
}

Deno.test("un problème en barres de forme parties et tout, dont le tout est la valeur cherchée, s'additionne", () => {
  const probleme = problemeEnBarres({ enonce: "Combien en tout ?", parties: [4, 2], tout: null });

  assertEquals(probleme.forme, { genre: "partiesEtTout", parties: [4, 2], tout: null });
  assertEquals(probleme.reponse, 6);
  assertEquals(probleme.ecriture, "4 + 2 = 6");
});

Deno.test("un problème en barres de forme parties et tout, dont la 2e partie est la valeur cherchée, se soustrait du tout", () => {
  const probleme = problemeEnBarres({ enonce: "Combien reste-t-il ?", parties: [6, null], tout: 9 });

  assertEquals(probleme.forme, { genre: "partiesEtTout", parties: [6, null], tout: 9 });
  assertEquals(probleme.reponse, 3);
  assertEquals(probleme.ecriture, "9 − 6 = 3");
});

Deno.test("un problème en barres de forme parties et tout, dont la 1re partie est la valeur cherchée, se soustrait du tout", () => {
  const probleme = problemeEnBarres({ enonce: "Combien y en avait-il ?", parties: [null, 6], tout: 9 });

  assertEquals(probleme.forme, { genre: "partiesEtTout", parties: [null, 6], tout: 9 });
  assertEquals(probleme.reponse, 3);
  assertEquals(probleme.ecriture, "9 − 6 = 3");
});

Deno.test("un problème en barres garde son énoncé du problème, son aide et sa phrase réponse telle quelle", () => {
  const probleme = problemeEnBarres({
    enonce: "Léa a 4 pommes et Tom en a 2. Combien en ont-ils ?",
    parties: [4, 2],
    tout: null,
    aide: "Cherche le tout.",
    phrase: "J'ai {r} pommes.",
  });

  assertEquals(
    [probleme.enonce, probleme.aide, probleme.phrase],
    ["Léa a 4 pommes et Tom en a 2. Combien en ont-ils ?", "Cherche le tout.", "J'ai {r} pommes."],
  );
});
