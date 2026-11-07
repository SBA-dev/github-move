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

const estLisible = (phrase: string) => /[\p{L}\p{N}]/u.test(phrase);

Deno.test("une ponctuation restée seule après un guillemet fermant est rattachée à la phrase qui la précède", () => {
  assertEquals(
    texteALire("Comment lire « Oh non ! » ?")?.phrases,
    ["Comment lire Oh non ! ?"],
  );
});

Deno.test("une ponctuation restée seule en tête de texte est rattachée à la phrase qui la suit", () => {
  assertEquals(texteALire("… = 3 + 3 + 2")?.phrases, ["… égale 3 plus 3 plus 2"]);
});

Deno.test("aucune phrase des textes réels qui produisaient de la ponctuation seule n'est sans lettre ni chiffre", () => {
  const textes = [
    "Comment lire « Nous allons y arriver… » ?",
    "Le verbe s'accorde avec son sujet. Pour le trouver, je demande : qui est-ce qui… ?",
    "« Take your pencil ! » : prends ton crayon. Écoute bien les objets de la classe.",
    "… + 25 = 60",
  ];

  const phrases = textes.flatMap((texte) => texteALire(texte)?.phrases ?? []);

  assertEquals(phrases.filter((phrase) => !estLisible(phrase)), []);
  assertEquals(phrases.length > 0, true);
});
