import { assertEquals } from "@std/assert";
import {
  complementDeLEncouragement,
  explicationDeLaReponse,
  INTRODUCTION_DE_LA_LECTURE,
  MESSAGE_DE_L_ECOUTE_SANS_SON,
  questionDeLEcoute,
} from "./phrases-des-exercices-a-choix.ts";

Deno.test("la bonne réponse d'une écoute est expliquée : « « a cat », c'est « un chat ». »", () => {
  assertEquals(
    explicationDeLaReponse("ecoute", { dire: "a cat", reponse: "un chat", langue: "en-GB" })?.texte,
    "« a cat », c'est « un chat ».",
  );
});

Deno.test("l'explication d'une écoute se lit en morceaux : le mot écouté dans sa langue, puis la réponse", () => {
  assertEquals(
    explicationDeLaReponse("ecoute", { dire: "a cat", reponse: "un chat", langue: "en-GB" })?.morceaux,
    [{ texte: "a cat", langue: "en-GB" }, { texte: "c'est un chat." }],
  );
});

Deno.test("les bulles et la lecture n'expliquent pas la réponse", () => {
  assertEquals(explicationDeLaReponse("bulles", { reponse: "ou" }), undefined);
  assertEquals(explicationDeLaReponse("lecture", { reponse: "gris" }), undefined);
});

Deno.test("l'écoute pose la question de l'item", () => {
  assertEquals(
    questionDeLEcoute({ question: "Écoute bien. Que veut dire cette phrase ?" }),
    "Écoute bien. Que veut dire cette phrase ?",
  );
});

Deno.test("sans question, l'écoute pose la question par défaut", () => {
  assertEquals(questionDeLEcoute({}), "Écoute bien ! Que veut dire ce mot ?");
});

Deno.test("après une erreur sur des bulles, l'aide de la question complète l'encouragement", () => {
  assertEquals(
    complementDeLEncouragement("bulles", { aide: "Écoute le début du mot." }),
    "Écoute le début du mot.",
  );
});

Deno.test("sans aide, bulles et lecture invitent à essayer une autre bulle", () => {
  assertEquals(complementDeLEncouragement("bulles", {}), "Essaie une autre bulle.");
  assertEquals(complementDeLEncouragement("lecture", {}), "Essaie une autre bulle.");
});

Deno.test("après une erreur à l'écoute, l'encouragement est suivi de « Écoute encore. »", () => {
  assertEquals(complementDeLEncouragement("ecoute", { aide: "ignorée" }), "Écoute encore.");
});

Deno.test("la lecture est introduite par Noisette", () => {
  assertEquals(
    INTRODUCTION_DE_LA_LECTURE,
    "Installe-toi bien, j'ai une histoire pour toi. Suis les mots avec tes yeux !",
  );
});

Deno.test("l'écoute sans son prévient l'enfant qu'elle a besoin du son", () => {
  assertEquals(
    MESSAGE_DE_L_ECOUTE_SANS_SON,
    "Pour écouter l'anglais, j'ai besoin du son : active-le avec le bouton ci-dessous.",
  );
});
