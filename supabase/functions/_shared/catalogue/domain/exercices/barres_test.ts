import { assertEquals, assertThrows } from "@std/assert";
import { LeconMalFormee } from "../erreurs.ts";
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

const enonce = "Combien ?";
const noms = ["Léa", "Tom"];

const problemesImpossibles: ReadonlyArray<[string, unknown]> = [
  ["un énoncé du problème absent", { parties: [4, 2], tout: null }],
  ["un énoncé du problème vide", { enonce: "", parties: [4, 2], tout: null }],
  ["une aide qui n'est pas un texte", { enonce, parties: [4, 2], tout: null, aide: 3 }],
  ["une phrase réponse qui n'est pas un texte", { enonce, parties: [4, 2], tout: null, phrase: 3 }],
  ["parties et tout sans valeur cherchée", { enonce, parties: [4, 2], tout: 6 }],
  ["parties et tout avec deux valeurs cherchées", { enonce, parties: [4, null], tout: null }],
  ["comparaison sans valeur cherchée", { type: "comparaison", enonce, grand: 10, petit: 6, ecart: 4, noms }],
  ["comparaison avec deux valeurs cherchées", {
    type: "comparaison",
    enonce,
    grand: null,
    petit: 6,
    ecart: null,
    noms,
  }],
  ["parts sans valeur cherchée", { type: "parts", enonce, nb: 3, valeur: 4, total: 12 }],
  ["parts avec deux valeurs cherchées", { type: "parts", enonce, nb: null, valeur: null, total: 12 }],
  ["un nombre négatif", { enonce, parties: [-2, 3], tout: null }],
  ["un nombre qui n'est pas entier", { enonce, parties: [1.5, 3], tout: null }],
  ["un nombre écrit en texte", { enonce, parties: ["4", 3], tout: null }],
  ["des parties qui ne sont pas deux", { enonce, parties: [4], tout: null }],
  ["des parties qui sont plus de deux", { enonce, parties: [4, 2, 1], tout: null }],
  ["un tout plus petit que la partie connue", { enonce, parties: [6, null], tout: 4 }],
  ["un grand plus petit que le petit", { type: "comparaison", enonce, grand: 5, petit: 9, ecart: null, noms }],
  ["un grand plus petit que l'écart quand on cherche le petit", {
    type: "comparaison",
    enonce,
    grand: 4,
    petit: null,
    ecart: 6,
    noms,
  }],
  ["un partage dont la division n'est pas exacte", { type: "parts", enonce, nb: 3, valeur: null, total: 13 }],
  ["un partage par un nombre de parts nul", { type: "parts", enonce, nb: 0, valeur: null, total: 12 }],
  ["un partage par une valeur de part nulle", { type: "parts", enonce, nb: null, valeur: 0, total: 12 }],
  ["une forme inconnue", { type: "triangle", enonce, parties: [4, 2], tout: null }],
  ["une comparaison dont les noms ne sont pas deux", {
    type: "comparaison",
    enonce,
    grand: 10,
    petit: 6,
    ecart: null,
    noms: ["Léa"],
  }],
];

for (const [impossible, item] of problemesImpossibles) {
  Deno.test(`un exercice « barres » refuse ${impossible}`, () => {
    assertThrows(() => problemeEnBarres(item), LeconMalFormee);
  });
}
