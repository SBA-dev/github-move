import { assertEquals, assertThrows } from "@std/assert";
import { Reponse } from "../domain/reponse.ts";
import { lireLeTestDeDepartTermine } from "./corps-du-test-de-depart-termine.ts";
import { EntreeInvalide } from "./http-apprentissage.ts";

const MAINTENANT = new Date("2026-10-23T10:15:00.000Z");
const TEST = "3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b";
const ENFANT = "9a1b2c3d-4e5f-4a6b-8c7d-0e1f2a3b4c5d";

function lire(corps: Record<string, unknown>) {
  return lireLeTestDeDepartTermine(corps, MAINTENANT);
}

function corpsValide(): Record<string, unknown> {
  return {
    test: TEST,
    enfant: ENFANT,
    questions: [{ leconId: "ma-cp-calcul", exercice: 0, rang: 2 }],
    tirages: [[["6", "7", "8", "9"]]],
    reponses: [[{ choix: "6" }, { jeNeSaisPas: true }]],
    termineeLe: "2026-10-23T10:15:00.000Z",
  };
}

function avecQuestion(question: Record<string, unknown>): Record<string, unknown> {
  return { ...corpsValide(), questions: [{ leconId: "ma-cp-calcul", exercice: 0, rang: 2, ...question }] };
}

Deno.test("un corps correct devient un test de départ terminé à enregistrer", () => {
  assertEquals(lire(corpsValide()), {
    test: TEST,
    enfant: ENFANT,
    questions: [{ leconId: "ma-cp-calcul", exercice: 0, rang: 2 }],
    tirages: [[["6", "7", "8", "9"]]],
    reponses: [[Reponse.choix("6"), { genre: "jeNeSaisPas" }]],
    termineeLe: new Date("2026-10-23T10:15:00.000Z"),
  });
});

Deno.test("un champ manquant est une entrée invalide", () => {
  for (const cle of ["test", "enfant", "questions", "tirages", "reponses", "termineeLe"]) {
    const corps = corpsValide();
    delete corps[cle];
    assertThrows(() => lire(corps), EntreeInvalide, cle);
  }
});

Deno.test("une clé inconnue du corps est refusée et nommée", () => {
  assertThrows(() => lire({ ...corpsValide(), leconsReussies: ["ma-cp-calcul"] }), EntreeInvalide, "leconsReussies");
});

Deno.test("l'identifiant du test et celui de l'enfant doivent être des UUID", () => {
  assertThrows(() => lire({ ...corpsValide(), test: "test-1" }), EntreeInvalide, "test");
  assertThrows(() => lire({ ...corpsValide(), enfant: "1' or '1'='1" }), EntreeInvalide, "enfant");
});

Deno.test("plus de 12 questions dans un test de départ est refusé", () => {
  const question = { leconId: "ma-cp-calcul", exercice: 0, rang: 0 };

  assertThrows(
    () => lire({ ...corpsValide(), questions: Array.from({ length: 13 }, () => question) }),
    EntreeInvalide,
    "questions",
  );
});

Deno.test("12 questions dans un test de départ sont acceptées", () => {
  const question = { leconId: "ma-cp-calcul", exercice: 0, rang: 0 };

  assertEquals(lire({ ...corpsValide(), questions: Array.from({ length: 12 }, () => question) }).questions.length, 12);
});

Deno.test("plus de 12 groupes de tirages est refusé", () => {
  assertThrows(
    () => lire({ ...corpsValide(), tirages: Array.from({ length: 13 }, () => []) }),
    EntreeInvalide,
    "tirages",
  );
});

Deno.test("plus de 12 groupes de réponses est refusé", () => {
  assertThrows(
    () => lire({ ...corpsValide(), reponses: Array.from({ length: 13 }, () => []) }),
    EntreeInvalide,
    "reponses",
  );
});

Deno.test("un exercice ou un rang négatif, non entier ou non numérique est refusé", () => {
  for (const valeur of [-1, 1.5, "2", null, Number.NaN]) {
    assertThrows(() => lire(avecQuestion({ exercice: valeur })), EntreeInvalide, "exercice");
    assertThrows(() => lire(avecQuestion({ rang: valeur })), EntreeInvalide, "rang");
  }
});

Deno.test("un identifiant de leçon vide est refusé", () => {
  assertThrows(() => lire(avecQuestion({ leconId: "" })), EntreeInvalide, "leconId");
});

Deno.test("un identifiant de leçon de plus de 100 caractères est refusé, 100 caractères sont acceptés", () => {
  assertThrows(() => lire(avecQuestion({ leconId: "a".repeat(101) })), EntreeInvalide, "leconId");
  assertEquals(lire(avecQuestion({ leconId: "a".repeat(100) })).questions[0]?.leconId.length, 100);
});

Deno.test("plus de 50 tirages pour une question est refusé", () => {
  const tirages = [Array.from({ length: 51 }, () => ["a", "b"])];

  assertThrows(() => lire({ ...corpsValide(), tirages }), EntreeInvalide, "tirages");
});

Deno.test("plus de 20 choix dans un tirage est refusé", () => {
  const tirage = Array.from({ length: 21 }, (_, i) => `choix ${i}`);

  assertThrows(() => lire({ ...corpsValide(), tirages: [[tirage]] }), EntreeInvalide, "tirages");
});

Deno.test("un genre de réponse inconnu est refusé", () => {
  for (const reponse of [{}, { autre: "6" }, { choix: "6", jeNeSaisPas: true }, { jeNeSaisPas: false }]) {
    assertThrows(() => lire({ ...corpsValide(), reponses: [[reponse]] }), EntreeInvalide, "reponses");
  }
});

Deno.test("une date de fin qui n'est pas une date ISO valide est refusée", () => {
  for (const termineeLe of ["demain", "", 1761214500000, null]) {
    assertThrows(() => lire({ ...corpsValide(), termineeLe }), EntreeInvalide, "termineeLe");
  }
});

Deno.test("une date de fin dans le futur, au-delà de 5 minutes de tolérance, est refusée", () => {
  assertThrows(
    () => lire({ ...corpsValide(), termineeLe: "2026-10-23T10:20:01.000Z" }),
    EntreeInvalide,
    "termineeLe",
  );
});

Deno.test("une date de fin dans les 5 minutes de tolérance est acceptée", () => {
  const termineeLe = "2026-10-23T10:19:59.000Z";

  assertEquals(lire({ ...corpsValide(), termineeLe }).termineeLe, new Date(termineeLe));
});
