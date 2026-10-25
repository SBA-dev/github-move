import { assertEquals, assertThrows } from "@std/assert";
import { TexteTropCourt, TexteTropLong } from "./erreurs.ts";
import { TexteDuParent } from "./texte-du-parent.ts";
import { normaliser } from "./texte-normalise.ts";

Deno.test("les espaces autour du texte du parent sont retirés", () => {
  assertEquals(TexteDuParent.de("  chat, chien  ").valeur, "chat, chien");
});

Deno.test("un texte de moins de 3 caractères est trop court", () => {
  assertThrows(() => TexteDuParent.de("  ab  "), TexteTropCourt, "Colle d'abord un texte.");
});

Deno.test("un texte de 3 caractères est accepté", () => {
  assertEquals(TexteDuParent.de("abc").valeur, "abc");
});

Deno.test("un texte de 3000 caractères est accepté", () => {
  assertEquals(TexteDuParent.de("a".repeat(3000)).valeur.length, 3000);
});

Deno.test("un texte de plus de 3000 caractères est trop long", () => {
  assertThrows(() => TexteDuParent.de("a".repeat(3001)), TexteTropLong);
});

Deno.test("les éléments sont coupés sur les retours à la ligne, les virgules et les points-virgules", () => {
  const texte = TexteDuParent.de("chat, chien;  lapin\nécureuil ,, \n\n oiseau");

  assertEquals(texte.elements(), ["chat", "chien", "lapin", "écureuil", "oiseau"]);
});

Deno.test("les lignes sont les lignes non vides", () => {
  const texte = TexteDuParent.de("Le loup\n\n  \nl'agneau");

  assertEquals(texte.lignes(), ["Le loup", "l'agneau"]);
});

Deno.test("les phrases sont coupées après un point, un point d'exclamation ou un point d'interrogation", () => {
  const texte = TexteDuParent.de("Il pleut. Quel temps ! Tu viens ? Oui");

  assertEquals(texte.phrases(), ["Il pleut.", "Quel temps !", "Tu viens ?", "Oui"]);
});

Deno.test("le message d'un texte trop long dit la limite de 3000 caractères", () => {
  assertThrows(
    () => TexteDuParent.de("a".repeat(3001)),
    TexteTropLong,
    "Ton texte est trop long : 3000 caractères au plus.",
  );
});

Deno.test("la normalisation unifie les apostrophes typographiques et droites", () => {
  assertEquals(normaliser("l’école"), "l'ecole");
  assertEquals(normaliser("l‘école"), "l'ecole");
});
