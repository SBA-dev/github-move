import { assertEquals, assertThrows } from "@std/assert";
import { libelleDeLaMatiere, matiere, MATIERES } from "./matiere.ts";
import { MatiereInconnue } from "./erreurs.ts";

const libellesAttendus: ReadonlyArray<readonly [string, string]> = [
  ["francais", "Français"],
  ["maths", "Mathématiques"],
  ["sciences", "Sciences"],
  ["histoire", "Histoire et géographie"],
  ["anglais", "Anglais"],
  ["emc", "Vivre ensemble (EMC)"],
];

Deno.test("le format compte 6 matières", () => {
  assertEquals([...MATIERES].sort(), libellesAttendus.map(([identifiant]) => identifiant).sort());
});

for (const [identifiant, libelle] of libellesAttendus) {
  Deno.test(`la matière « ${identifiant} » a pour libellé « ${libelle} »`, () => {
    assertEquals(libelleDeLaMatiere(matiere(identifiant)), libelle);
  });
}

Deno.test("une matière inconnue est refusée", () => {
  assertThrows(() => matiere("musique"), MatiereInconnue);
});

Deno.test("une valeur qui n'est pas un texte n'est pas une matière", () => {
  assertThrows(() => matiere(undefined), MatiereInconnue);
});
