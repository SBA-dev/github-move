import { assertEquals, assertThrows } from "@std/assert";
import { CleDeQuestion } from "../domain/cle-de-question.ts";
import { Reponse } from "../domain/reponse.ts";
import { lireLaSeanceDeRevisionTerminee } from "./corps-de-la-seance-de-revision-terminee.ts";
import { EntreeInvalide } from "./http-apprentissage.ts";

const MAINTENANT = new Date("2026-10-26T08:35:00.000Z");
const SEANCE = "3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b";
const ENFANT = "9a1b2c3d-4e5f-4a6b-8c7d-0e1f2a3b4c5d";

function lire(corps: Record<string, unknown>) {
  return lireLaSeanceDeRevisionTerminee(corps, MAINTENANT);
}

function corpsValide(): Record<string, unknown> {
  return {
    id: SEANCE,
    enfant: ENFANT,
    questions: ["b:combien font 3 + 4 ?", "e:cat"],
    tirages: [["6", "7", "8", "9"], []],
    reponses: [[{ choix: "6" }, { jeNeSaisPas: true }], [{ motEcrit: ["c", "a", "t"] }]],
    termineeLe: "2026-10-26T08:30:00.000Z",
    jour: "2026-10-26",
  };
}

Deno.test("un corps correct devient une séance de révision terminée à enregistrer", () => {
  assertEquals(lire(corpsValide()), {
    id: SEANCE,
    enfant: ENFANT,
    questions: [CleDeQuestion.de("bulles", "Combien font 3 + 4 ?"), CleDeQuestion.de("ecoute", "cat")],
    tirages: [["6", "7", "8", "9"], []],
    reponses: [[Reponse.choix("6"), { genre: "jeNeSaisPas" }], [Reponse.motEcrit(["c", "a", "t"])]],
    termineeLe: new Date("2026-10-26T08:30:00.000Z"),
    jour: "2026-10-26",
  });
});

Deno.test("un champ manquant est une entrée invalide", () => {
  for (const cle of ["id", "enfant", "questions", "tirages", "reponses", "termineeLe", "jour"]) {
    const corps = corpsValide();
    delete corps[cle];
    assertThrows(() => lire(corps), EntreeInvalide, cle);
  }
});

Deno.test("une clé inconnue du corps est refusée et nommée", () => {
  assertThrows(() => lire({ ...corpsValide(), etoiles: 3 }), EntreeInvalide, "etoiles");
});

Deno.test("l'identifiant de la séance et celui de l'enfant doivent être des UUID", () => {
  assertThrows(() => lire({ ...corpsValide(), id: "seance-1" }), EntreeInvalide, "id");
  assertThrows(() => lire({ ...corpsValide(), enfant: "1' or '1'='1" }), EntreeInvalide, "enfant");
});

Deno.test("une question qui n'est pas une clé de question en texte est refusée", () => {
  for (const questions of [[1], [null], [{}], "b:cat", [""]]) {
    assertThrows(() => lire({ ...corpsValide(), questions }), EntreeInvalide, "questions");
  }
});

Deno.test("plus de 10 questions dans une séance de révision est refusé, 10 sont acceptées", () => {
  const dix = Array.from({ length: 10 }, (_, i) => `b:question ${i}`);
  const onze = [...dix, "b:question 10"];

  assertThrows(
    () => lire({ ...corpsValide(), questions: onze, tirages: onze.map(() => []), reponses: onze.map(() => []) }),
    EntreeInvalide,
    "questions",
  );
  assertEquals(
    lire({ ...corpsValide(), questions: dix, tirages: dix.map(() => []), reponses: dix.map(() => []) }).questions
      .length,
    10,
  );
});

Deno.test("des tirages ou des réponses mal formés sont refusés", () => {
  assertThrows(() => lire({ ...corpsValide(), tirages: [["6"], "7"] }), EntreeInvalide, "tirages");
  assertThrows(() => lire({ ...corpsValide(), tirages: [[6], []] }), EntreeInvalide, "tirages");
  assertThrows(() => lire({ ...corpsValide(), reponses: [[{ autre: "6" }], []] }), EntreeInvalide, "reponses");
});

Deno.test("plus de 10 groupes de tirages ou de réponses est refusé", () => {
  assertThrows(
    () => lire({ ...corpsValide(), tirages: Array.from({ length: 11 }, () => []) }),
    EntreeInvalide,
    "tirages",
  );
  assertThrows(
    () => lire({ ...corpsValide(), reponses: Array.from({ length: 11 }, () => []) }),
    EntreeInvalide,
    "reponses",
  );
});

Deno.test("une date de fin invalide ou dans le futur est refusée", () => {
  for (const termineeLe of ["demain", "", null, "2026-10-26T08:41:00.000Z"]) {
    assertThrows(() => lire({ ...corpsValide(), termineeLe }), EntreeInvalide, "termineeLe");
  }
});

Deno.test("un jour qui n'est pas au format AAAA-MM-JJ est refusé", () => {
  for (const jour of ["26/10/2026", "2026-13-01", "2026-02-30", "", 20261026, null]) {
    assertThrows(() => lire({ ...corpsValide(), jour }), EntreeInvalide, "jour");
  }
});
