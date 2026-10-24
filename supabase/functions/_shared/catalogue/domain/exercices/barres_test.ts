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

Deno.test("un problème en barres de forme comparaison, dont l'écart est la valeur cherchée, soustrait le petit du grand", () => {
  const probleme = problemeEnBarres({
    type: "comparaison",
    enonce: "Combien de plus ?",
    grand: 43,
    petit: 37,
    ecart: null,
    noms: ["Léa", "Tom"],
  });

  assertEquals(probleme.forme, {
    genre: "comparaison",
    grand: 43,
    petit: 37,
    ecart: null,
    noms: ["Léa", "Tom"],
  });
  assertEquals(probleme.reponse, 6);
  assertEquals(probleme.ecriture, "43 − 37 = 6");
});

Deno.test("un problème en barres de forme comparaison, dont le grand est la valeur cherchée, ajoute l'écart au petit", () => {
  const probleme = problemeEnBarres({
    type: "comparaison",
    enonce: "Combien en a Léa ?",
    grand: null,
    petit: 9,
    ecart: 4,
    noms: ["Léa", "Tom"],
  });

  assertEquals(probleme.reponse, 13);
  assertEquals(probleme.ecriture, "9 + 4 = 13");
});

Deno.test("un problème en barres de forme comparaison, dont le petit est la valeur cherchée, retire l'écart du grand", () => {
  const probleme = problemeEnBarres({
    type: "comparaison",
    enonce: "Combien en a Tom ?",
    grand: 15,
    petit: null,
    ecart: 6,
    noms: ["Léa", "Tom"],
  });

  assertEquals(probleme.reponse, 9);
  assertEquals(probleme.ecriture, "15 − 6 = 9");
});

Deno.test("un problème en barres de forme parts, dont le total est la valeur cherchée, multiplie le nombre de parts par la valeur d'une part", () => {
  const probleme = problemeEnBarres({
    type: "parts",
    enonce: "Combien en tout ?",
    nb: 4,
    valeur: 5,
    total: null,
  });

  assertEquals(probleme.forme, { genre: "parts", nb: 4, valeur: 5, total: null });
  assertEquals(probleme.reponse, 20);
  assertEquals(probleme.ecriture, "4 × 5 = 20");
});

Deno.test("un problème en barres de forme parts, dont la valeur d'une part est la valeur cherchée, divise le total par le nombre de parts", () => {
  const probleme = problemeEnBarres({
    type: "parts",
    enonce: "Combien dans chaque part ?",
    nb: 3,
    valeur: null,
    total: 12,
  });

  assertEquals(probleme.reponse, 4);
  assertEquals(probleme.ecriture, "12 = 3 × 4");
});

Deno.test("un problème en barres de forme parts, dont le nombre de parts est la valeur cherchée, divise le total par la valeur d'une part", () => {
  const probleme = problemeEnBarres({
    type: "parts",
    enonce: "Combien de parts de 3 ?",
    nb: null,
    valeur: 3,
    total: 18,
  });

  assertEquals(probleme.reponse, 6);
  assertEquals(probleme.ecriture, "18 = 6 × 3");
});
