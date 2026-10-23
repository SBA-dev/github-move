import { assertEquals, assertThrows } from "@std/assert";
import { libelleDuType, typeDExercice, TYPES_D_EXERCICE } from "./type-d-exercice.ts";
import { TypeDExerciceInconnu } from "./erreurs.ts";

const libellesAttendus: ReadonlyArray<readonly [string, string]> = [
  ["bulles", "Bulles-réponses"],
  ["classer", "Ranger dans les maisons"],
  ["dictee", "Dictée"],
  ["ordre", "Remettre dans l'ordre"],
  ["trous", "Texte à trous"],
  ["conjugaison", "Conjugaison"],
  ["lecture", "Écouter et comprendre"],
  ["memoriser", "Apprendre par cœur"],
  ["addition", "Addition posée"],
  ["calcul", "Calcul"],
  ["fluence", "Calcul rapide"],
  ["ecoute", "Écouter (langue)"],
  ["boite", "La boîte à jetons"],
  ["barres", "Problème en schéma"],
];

Deno.test("le format compte 14 types d'exercice", () => {
  assertEquals([...TYPES_D_EXERCICE].sort(), libellesAttendus.map(([type]) => type).sort());
});

for (const [type, libelle] of libellesAttendus) {
  Deno.test(`le type d'exercice « ${type} » a pour libellé « ${libelle} »`, () => {
    assertEquals(libelleDuType(typeDExercice(type)), libelle);
  });
}

Deno.test("un type d'exercice inconnu est refusé", () => {
  assertThrows(() => typeDExercice("puzzle"), TypeDExerciceInconnu);
});

Deno.test("une valeur qui n'est pas un texte n'est pas un type d'exercice", () => {
  assertThrows(() => typeDExercice(42), TypeDExerciceInconnu);
});
