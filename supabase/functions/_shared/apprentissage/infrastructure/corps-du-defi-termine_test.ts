import { assertEquals, assertThrows } from "@std/assert";
import { matiereDeCode, Niveau } from "../../catalogue/domain/index.ts";
import { CleDeQuestion } from "../domain/cle-de-question.ts";
import { Reponse } from "../domain/reponse.ts";
import { lireLeDefiTermine } from "./corps-du-defi-termine.ts";
import { EntreeInvalide } from "./http-apprentissage.ts";

const MAINTENANT = new Date("2026-10-29T08:35:00.000Z");
const DEFI = "3f2b8c1e-5a4d-4e6f-9b7a-1c2d3e4f5a6b";
const ENFANT = "9a1b2c3d-4e5f-4a6b-8c7d-0e1f2a3b4c5d";

function lire(corps: Record<string, unknown>) {
  return lireLeDefiTermine(corps, MAINTENANT);
}

function corpsValide(): Record<string, unknown> {
  return {
    id: DEFI,
    enfant: ENFANT,
    defi: { matiere: "maths", niveau: "CE1", numero: 2 },
    questions: ["b:combien font 3 + 4 ?", "e:cat"],
    tirages: [["6", "7", "8", "9"], []],
    reponses: [[{ choix: "6" }, { jeNeSaisPas: true }], [{ motEcrit: ["c", "a", "t"] }]],
    termineeLe: "2026-10-29T08:30:00.000Z",
    jour: "2026-10-29",
  };
}

Deno.test("un corps correct devient un défi terminé à enregistrer, avec sa matière et son niveau reconstruits", () => {
  assertEquals(lire(corpsValide()), {
    id: DEFI,
    enfant: ENFANT,
    defi: { matiere: matiereDeCode("maths"), niveau: Niveau.de("CE1"), numero: 2 },
    questions: [CleDeQuestion.de("bulles", "Combien font 3 + 4 ?"), CleDeQuestion.de("ecoute", "cat")],
    tirages: [["6", "7", "8", "9"], []],
    reponses: [[Reponse.choix("6"), { genre: "jeNeSaisPas" }], [Reponse.motEcrit(["c", "a", "t"])]],
    termineeLe: new Date("2026-10-29T08:30:00.000Z"),
    jour: "2026-10-29",
  });
});

Deno.test("la matière envoyée n'est jamais reprise telle quelle : son libellé vient du catalogue", () => {
  const corps = { ...corpsValide(), defi: { matiere: "maths", niveau: "CE1", numero: 2, libelle: "Truqué" } };

  assertThrows(() => lire(corps), EntreeInvalide, "defi");
  assertEquals(lire(corpsValide()).defi.matiere.libelle, "Mathématiques");
});

Deno.test("un champ manquant du défi terminé est une entrée invalide", () => {
  for (const cle of ["id", "enfant", "defi", "questions", "tirages", "reponses", "termineeLe", "jour"]) {
    const corps = corpsValide();
    delete corps[cle];
    assertThrows(() => lire(corps), EntreeInvalide, cle);
  }
});

Deno.test("une clé inconnue du corps du défi est refusée et nommée", () => {
  assertThrows(() => lire({ ...corpsValide(), etoiles: 3 }), EntreeInvalide, "etoiles");
});

Deno.test("l'identifiant du défi et celui de l'enfant doivent être des UUID", () => {
  assertThrows(() => lire({ ...corpsValide(), id: "defi-1" }), EntreeInvalide, "id");
  assertThrows(() => lire({ ...corpsValide(), enfant: "1' or '1'='1" }), EntreeInvalide, "enfant");
});

Deno.test("une matière inconnue ou un niveau inconnu est refusé", () => {
  for (const matiere of ["danse", "", 3, null, "toString"]) {
    assertThrows(
      () => lire({ ...corpsValide(), defi: { matiere, niveau: "CE1", numero: 2 } }),
      EntreeInvalide,
      "matiere",
    );
  }
  for (const niveau of ["6e", "ce1", "", 1, null]) {
    assertThrows(
      () => lire({ ...corpsValide(), defi: { matiere: "maths", niveau, numero: 2 } }),
      EntreeInvalide,
      "niveau",
    );
  }
});

Deno.test("un numéro de défi qui n'est pas un entier d'au moins 1 est refusé", () => {
  for (const numero of [0, -1, 1.5, "2", null, NaN, Infinity]) {
    assertThrows(
      () => lire({ ...corpsValide(), defi: { matiere: "maths", niveau: "CE1", numero } }),
      EntreeInvalide,
      "numero",
    );
  }
});

Deno.test("un défi qui n'est pas un objet avec exactement matiere, niveau et numero est refusé", () => {
  for (const defi of ["maths", null, [], { matiere: "maths", niveau: "CE1" }]) {
    assertThrows(() => lire({ ...corpsValide(), defi }), EntreeInvalide, "defi");
  }
});

Deno.test("une question du défi qui n'est pas une clé de question en texte est refusée", () => {
  for (const questions of [[1], [null], [{}], "b:cat", [""]]) {
    assertThrows(() => lire({ ...corpsValide(), questions }), EntreeInvalide, "questions");
  }
});

Deno.test("plus de 10 questions dans un défi est refusé, 10 sont acceptées", () => {
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

Deno.test("des tirages ou des réponses mal formés du défi sont refusés", () => {
  assertThrows(() => lire({ ...corpsValide(), tirages: [["6"], "7"] }), EntreeInvalide, "tirages");
  assertThrows(() => lire({ ...corpsValide(), tirages: [[6], []] }), EntreeInvalide, "tirages");
  assertThrows(() => lire({ ...corpsValide(), reponses: [[{ autre: "6" }], []] }), EntreeInvalide, "reponses");
});

Deno.test("une date de fin de défi invalide ou dans le futur est refusée", () => {
  for (const termineeLe of ["demain", "", null, "2026-10-29T08:41:00.000Z"]) {
    assertThrows(() => lire({ ...corpsValide(), termineeLe }), EntreeInvalide, "termineeLe");
  }
});

Deno.test("un jour de défi qui n'est pas au format AAAA-MM-JJ est refusé", () => {
  for (const jour of ["29/10/2026", "2026-13-01", "2026-02-30", "", 20261029, null]) {
    assertThrows(() => lire({ ...corpsValide(), jour }), EntreeInvalide, "jour");
  }
});
