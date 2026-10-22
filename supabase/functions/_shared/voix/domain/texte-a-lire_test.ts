import { assertEquals, assertStrictEquals } from "@std/assert";
import { texteALire } from "./texte-a-lire.ts";

Deno.test("les balises HTML sont retirées du texte lu", () => {
  assertEquals(texteALire("Lis <b>le mot</b> vite")?.texte, "Lis le mot vite");
});

Deno.test("les entités HTML sont remplacées par une espace", () => {
  assertEquals(texteALire("Tom&nbsp;et&amp;Léa")?.texte, "Tom et Léa");
});

Deno.test("le signe plus se dit « plus » et le signe égal se dit « égale »", () => {
  assertEquals(texteALire("3 + 4 = ?")?.texte, "3 plus 4 égale ?");
});

Deno.test("les signes collés aux nombres sont dits avec des espaces", () => {
  assertEquals(texteALire("3+4=7")?.texte, "3 plus 4 égale 7");
});

Deno.test("un trou de soulignés se lit comme un silence", () => {
  assertEquals(texteALire("Le chat ___ noir.")?.texte, "Le chat ... noir.");
});

Deno.test("les guillemets français ne sont pas lus", () => {
  assertEquals(texteALire("Lis « papa »")?.texte, "Lis papa");
});

Deno.test("un guillemet fermant ne laisse pas d'espace devant la ponctuation", () => {
  assertEquals(texteALire("Lis le mot « maman ».")?.texte, "Lis le mot maman.");
  assertEquals(texteALire("Dis « Bravo » !")?.texte, "Dis Bravo !");
});

Deno.test("les espaces multiples sont réduites et le texte rogné", () => {
  assertEquals(texteALire("  Bonjour   les \n amis  ")?.texte, "Bonjour les amis");
});

Deno.test("un texte vide après nettoyage n'est pas lu", () => {
  assertStrictEquals(texteALire("<b> </b>"), undefined);
});

Deno.test("le texte est découpé en phrases après . ! ? … ou :", () => {
  assertEquals(
    texteALire("Bravo ! Encore une. Prêt ? Voici… Écoute : vas-y")?.phrases,
    ["Bravo !", "Encore une.", "Prêt ?", "Voici…", "Écoute :", "vas-y"],
  );
});
