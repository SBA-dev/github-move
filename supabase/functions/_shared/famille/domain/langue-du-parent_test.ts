import { assertEquals, assertThrows } from "@std/assert";
import { LangueDuParentInconnue } from "./erreurs.ts";
import { LangueDuParent, LANGUES_DU_PARENT_PROPOSEES } from "./langue-du-parent.ts";

const LES_VINGT_LANGUES = [
  "anglais",
  "arabe",
  "espagnol",
  "portugais",
  "turc",
  "roumain",
  "polonais",
  "italien",
  "allemand",
  "russe",
  "ukrainien",
  "chinois",
  "vietnamien",
  "tamoul",
  "wolof",
  "bambara",
  "lingala",
  "persan",
  "albanais",
  "serbe",
];

Deno.test("la langue du parent peut n'être aucune", () => {
  assertEquals(LangueDuParent.aucune().valeur, "aucune");
  assertEquals(LangueDuParent.de("aucune").valeur, "aucune");
});

Deno.test("les vingt langues proposées au parent sont celles du legacy, dans le même ordre", () => {
  assertEquals(LANGUES_DU_PARENT_PROPOSEES.map((langue) => langue.code), LES_VINGT_LANGUES);
});

Deno.test("chaque langue proposée au parent a pour libellé son code avec une majuscule", () => {
  assertEquals(
    LANGUES_DU_PARENT_PROPOSEES.map((langue) => langue.libelle),
    LES_VINGT_LANGUES.map((code) => code.charAt(0).toUpperCase() + code.slice(1)),
  );
});

Deno.test("chacune des vingt langues proposées est une langue du parent valide", () => {
  const valeurs = LES_VINGT_LANGUES.map((code) => LangueDuParent.de(code).valeur);

  assertEquals(valeurs, LES_VINGT_LANGUES);
});

Deno.test("une langue du parent inconnue est refusée", () => {
  assertThrows(() => LangueDuParent.de("klingon"), LangueDuParentInconnue);
});
