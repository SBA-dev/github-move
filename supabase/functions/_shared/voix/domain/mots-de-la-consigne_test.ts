import { assertEquals } from "@std/assert";
import { motsDeLaConsigne } from "./mots-de-la-consigne.ts";

function motsAvecRang(texteAffiche: string) {
  return motsDeLaConsigne(texteAffiche)
    .filter((segment) => segment.rang !== undefined)
    .map(({ texte, rang }) => [texte, rang]);
}

Deno.test("les mots d'une consigne sont numérotés dans l'ordre, le trou de soulignés n'est pas un mot", () => {
  assertEquals(motsAvecRang("Le chat ___ du lait."), [["Le", 0], ["chat", 1], ["du", 2], ["lait.", 3]]);
});

Deno.test("la numérotation des mots continue à travers les phrases", () => {
  assertEquals(motsAvecRang("Bravo ! Encore une."), [["Bravo", 0], ["Encore", 1], ["une.", 2]]);
});

Deno.test("une ponctuation isolée n'est pas un mot", () => {
  assertEquals(motsAvecRang("Écoute : range."), [["Écoute", 0], ["range.", 1]]);
});

Deno.test("les guillemets et leur ponctuation ne sont pas des mots", () => {
  assertEquals(motsAvecRang("« Bonjour », dit Lumi."), [["Bonjour", 0], ["dit", 1], ["Lumi.", 2]]);
});

Deno.test("une opération collée « 3+4=7 » est un seul mot affiché, même si elle se dit en plusieurs mots", () => {
  assertEquals(motsAvecRang("3+4=7"), [["3+4=7", 0]]);
});

Deno.test("la concaténation des segments redonne le texte affiché", () => {
  const texte = "« Bonjour », dit  Lumi ___ ! 3 + 4.";

  assertEquals(motsDeLaConsigne(texte).map((segment) => segment.texte).join(""), texte);
});
