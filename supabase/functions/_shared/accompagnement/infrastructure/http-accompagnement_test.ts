import { assertEquals, assertThrows } from "@std/assert";
import { AucuneSectionDuProgramme, LeconPersonnelleIntrouvable, ParentNonRattache } from "../domain/erreurs.ts";
import { EntreeInvalide, lireLaCreation, lireLaSuppression, statutEtMessage } from "./http-accompagnement.ts";

const PROFIL = "3f2b8c1e-9d4a-4b6e-8f10-2a7c5e9d1b34";

Deno.test("le corps d'une création donne le profil, le texte, la classe et la matière facultative", () => {
  const creation = lireLaCreation({ profil: PROFIL, texte: "chaton, maison, poisson", niveau: "CE1", matiere: "emc" });

  assertEquals(creation.profil, PROFIL);
  assertEquals(creation.texte, "chaton, maison, poisson");
  assertEquals(creation.niveau.valeur, "CE1");
  assertEquals(creation.matiere?.code, "emc");
});

Deno.test("sans matière, la création n'en impose pas", () => {
  assertEquals(lireLaCreation({ profil: PROFIL, texte: "abc", niveau: "CP" }).matiere, undefined);
});

Deno.test("un corps de création mal formé est refusé", () => {
  const valide = { profil: PROFIL, texte: "abc", niveau: "CP" };
  assertThrows(() => lireLaCreation({ ...valide, profil: "pas-un-uuid" }), EntreeInvalide);
  assertThrows(() => lireLaCreation({ ...valide, texte: 12 }), EntreeInvalide);
  assertThrows(() => lireLaCreation({ ...valide, texte: "a".repeat(10001) }), EntreeInvalide);
  assertThrows(() => lireLaCreation({ ...valide, matiere: "danse" }), EntreeInvalide);
  assertThrows(() => lireLaCreation({ ...valide, niveau: "6e" }));
});

Deno.test("seul l'identifiant d'une leçon personnelle se supprime", () => {
  assertEquals(lireLaSuppression({ lecon: "perso-abc" }), { lecon: "perso-abc" });
  assertThrows(() => lireLaSuppression({ lecon: "ma-cp-calcul" }), EntreeInvalide);
  assertThrows(() => lireLaSuppression({}), EntreeInvalide);
});

Deno.test("les erreurs métier deviennent des codes HTTP : non rattaché et introuvable en 404, texte ou section en 400", () => {
  assertEquals(statutEtMessage(new ParentNonRattache()).statut, 404);
  assertEquals(statutEtMessage(new LeconPersonnelleIntrouvable()).statut, 404);
  assertEquals(statutEtMessage(new AucuneSectionDuProgramme()).statut, 400);
  assertEquals(statutEtMessage(new Error("autre")).statut, 500);
});
