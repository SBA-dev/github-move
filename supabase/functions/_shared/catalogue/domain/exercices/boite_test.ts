import { assertEquals, assertThrows } from "@std/assert";
import { LeconMalFormee } from "../erreurs.ts";
import { lireLecon } from "../lire-lecon.ts";

function leconAvec(exercice: unknown): Record<string, unknown> {
  return {
    id: "math-cp-boite",
    matiere: "maths",
    niveau: "CP",
    titre: "La boîte à jetons",
    ordre: 3,
    programme: {
      section: "c2-mathematiques-cp-calculer-avec-des-nombres-entiers",
      citation: "Calculer mentalement.",
    },
    lecon: [],
    exercices: [exercice],
  };
}

function exerciceBoite(exercice: unknown) {
  const lu = lireLecon(leconAvec(exercice)).exercices[0];
  if (lu.type !== "boite") throw new Error("exercice « boite » attendu");
  return lu;
}

Deno.test("un exercice « boite » donne pour chaque item son sens, sa réponse et l'écriture du calcul", () => {
  const exercice = exerciceBoite({
    type: "boite",
    titre: "La boîte à jetons",
    items: [
      { a: 4, op: "+", b: 3 },
      { a: 8, op: "-", b: 3 },
      { a: 2, b: 7 },
    ],
  });

  assertEquals(exercice.titre, "La boîte à jetons");
  assertEquals(exercice.items, [
    { a: 4, sens: "ajout", b: 3, reponse: 7, ecriture: "4 + 3 = 7" },
    { a: 8, sens: "retrait", b: 3, reponse: 5, ecriture: "8 − 3 = 5" },
    { a: 2, sens: "ajout", b: 7, reponse: 9, ecriture: "2 + 7 = 9" },
  ]);
});

const itemsImpossibles: ReadonlyArray<[string, unknown]> = [
  ["un retrait plus grand que le contenu de la boîte", { a: 3, op: "-", b: 5 }],
  ["un nombre de départ négatif", { a: -1, op: "+", b: 2 }],
  ["un nombre de jetons négatif", { a: 2, op: "+", b: -1 }],
  ["un nombre de départ qui n'est pas entier", { a: 2.5, op: "+", b: 1 }],
  ["un nombre de jetons qui n'est pas entier", { a: 2, op: "+", b: 1.5 }],
  ["une opération autre que « + » ou « - »", { a: 4, op: "×", b: 2 }],
];

for (const [impossible, item] of itemsImpossibles) {
  Deno.test(`un exercice « boite » refuse ${impossible}`, () => {
    assertThrows(() => exerciceBoite({ type: "boite", items: [item] }), LeconMalFormee);
  });
}
