import { assertEquals } from "@std/assert";
import { phrasesDesMotsAffiches } from "./phrases-des-mots-affiches.ts";
import { motsDeLaConsigne } from "./mots-de-la-consigne.ts";
import { texteALire } from "./texte-a-lire.ts";

const TEXTE_PETIT_CHAT = "Plume est un petit chat gris. Il dort sur le lit de Léa. " +
  "Un matin, Plume voit une souris. Il saute du lit, mais la souris file dans son trou. " +
  "Plume est déçu. Alors Léa lui donne du lait, et Plume ronronne.";

Deno.test("un texte d'une seule phrase place tous ses mots dans la phrase 0", () => {
  assertEquals(phrasesDesMotsAffiches("Plume est un petit chat gris."), [0, 0, 0, 0, 0, 0]);
});

Deno.test("chaque mot affiché a une phrase, au même rang que dans les mots de la consigne", () => {
  const nombreDeMots = motsDeLaConsigne(TEXTE_PETIT_CHAT).filter(({ rang }) => rang !== undefined).length;

  assertEquals(phrasesDesMotsAffiches(TEXTE_PETIT_CHAT).length, nombreDeMots);
});

Deno.test("le texte de la leçon « Le petit chat Plume » est coupé en 6 phrases sans trou, comme la voix", () => {
  const phrases = phrasesDesMotsAffiches(TEXTE_PETIT_CHAT);
  const motsParPhrase = [0, 1, 2, 3, 4, 5].map((rang) => phrases.filter((r) => r === rang).length);

  assertEquals(texteALire(TEXTE_PETIT_CHAT)?.phrases.length, 6);
  assertEquals(motsParPhrase, [6, 7, 6, 11, 3, 9]);
  assertEquals(phrases, [...phrases].sort((a, b) => a - b));
});

Deno.test("un point d'exclamation et un point d'interrogation terminent une phrase", () => {
  assertEquals(phrasesDesMotsAffiches("Plume dort ! Où est Léa ? Elle rit."), [0, 0, 1, 1, 1, 2, 2]);
});

Deno.test("des points de suspension terminent une phrase", () => {
  assertEquals(phrasesDesMotsAffiches("Il hésite… puis saute."), [0, 0, 1, 1]);
});

Deno.test("les deux-points terminent une phrase", () => {
  assertEquals(phrasesDesMotsAffiches("Léa dit : Plume ronronne."), [0, 0, 1, 1]);
});

Deno.test("un texte sans ponctuation finale reste une seule phrase", () => {
  assertEquals(phrasesDesMotsAffiches("Plume dort sur le lit"), [0, 0, 0, 0, 0]);
});

Deno.test("des guillemets français ne changent pas la coupure des phrases", () => {
  assertEquals(
    phrasesDesMotsAffiches("Léa dit : « Bonjour Plume. » Plume ronronne."),
    [0, 0, 1, 1, 2, 2],
  );
});

Deno.test("un texte vide n'a aucun mot affiché", () => {
  assertEquals(phrasesDesMotsAffiches(""), []);
});
